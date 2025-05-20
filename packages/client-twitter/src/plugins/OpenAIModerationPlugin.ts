import { elizaLogger, type IAgentRuntime } from "@elizaos/core";
import axios from "axios";

// Configuration types
interface ModerationConfig {
  enabled: boolean;
  openaiApiKey: string;
  thresholds: {
    hate: number;
    violence: number;
    [key: string]: number;
  };
  blockReasons: string[];
  onlyReplies: boolean;
}

// Moderation API response types
interface ModerationCategory {
  hate: boolean;
  "hate/threatening": boolean;
  harassment: boolean;
  "harassment/threatening": boolean;
  "self-harm": boolean;
  "self-harm/intent": boolean;
  "self-harm/instructions": boolean;
  sexual: boolean;
  "sexual/minors": boolean;
  violence: boolean;
  "violence/graphic": boolean;
  [key: string]: boolean;
}

interface ModerationCategoryScore {
  hate: number;
  "hate/threatening": number;
  harassment: number;
  "harassment/threatening": number;
  "self-harm": number;
  "self-harm/intent": number;
  "self-harm/instructions": number;
  sexual: number;
  "sexual/minors": number;
  violence: number;
  "violence/graphic": number;
  [key: string]: number;
}

interface ModerationResult {
  categories: ModerationCategory;
  category_scores: ModerationCategoryScore;
  flagged: boolean;
}

interface OpenAIModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

/**
 * Loads moderation configuration from environment variables.
 * 
 * Required environment variables:
 * - OPENAI_API_KEY: The OpenAI API key for moderation
 * 
 * Optional environment variables:
 * - TWITTER_MODERATION_ENABLED: Whether moderation is enabled (default: true)
 * - TWITTER_MODERATION_THRESHOLD_HATE: Threshold for hate content (default: 0.5)
 * - TWITTER_MODERATION_THRESHOLD_VIOLENCE: Threshold for violence content (default: 0.5)
 * - TWITTER_MODERATION_BLOCK_REASONS: Comma-separated list of categories to block (default: hate,violence)
 * - TWITTER_MODERATION_ONLY_REPLIES: Only moderate replies (default: true)
 */
function loadModerationConfig(runtime: IAgentRuntime): ModerationConfig {
  const openaiApiKey = runtime.getSetting("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required for tweet moderation");
  }
  
  // Parse block reasons
  const blockReasonsSetting = runtime.getSetting("TWITTER_MODERATION_BLOCK_REASONS") || "hate,violence";
  const blockReasons = blockReasonsSetting.split(",").map(reason => reason.trim());
  
  // Parse thresholds
  const thresholds: Record<string, number> = {};
  
  // Default thresholds
  thresholds.hate = 0.5;
  thresholds.violence = 0.5;
  
  // Override with environment-specific thresholds
  for (const reason of blockReasons) {
    const thresholdEnvVar = `TWITTER_MODERATION_THRESHOLD_${reason.toUpperCase()}`;
    const thresholdValue = runtime.getSetting(thresholdEnvVar);
    
    if (thresholdValue) {
      const parsedThreshold = parseFloat(thresholdValue);
      if (!isNaN(parsedThreshold)) {
        thresholds[reason] = parsedThreshold;
      }
    }
  }
  
  return {
    enabled: runtime.getSetting("TWITTER_MODERATION_ENABLED") !== "false", // Default to true if not specified
    openaiApiKey,
    thresholds,
    blockReasons,
    onlyReplies: runtime.getSetting("TWITTER_MODERATION_ONLY_REPLIES") !== "false" // Default to true if not specified
  };
}

/**
 * Moderates text content using OpenAI's moderation API.
 * 
 * @param text The text content to moderate
 * @param config The moderation configuration
 * @returns A promise resolving to a boolean indicating whether the content should be blocked
 */
async function moderateContent(text: string, config: ModerationConfig): Promise<{ 
  shouldBlock: boolean;
  reason?: string;
  scores?: Record<string, number>;
}> {
  try {
    // Make request to OpenAI moderation API
    const response = await axios.post<OpenAIModerationResponse>(
      "https://api.openai.com/v1/moderations",
      { input: text },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.openaiApiKey}`
        }
      }
    );
    
    const result = response.data.results[0];
    const scores = result.category_scores;
    
    // Check if any configured categories exceed their thresholds
    for (const reason of config.blockReasons) {
      if (scores[reason] && scores[reason] >= config.thresholds[reason]) {
        return { 
          shouldBlock: true, 
          reason,
          scores
        };
      }
    }
    
    // Content passed moderation checks
    return { shouldBlock: false, scores };
  } catch (error) {
    // Log error but don't block content on API failure (fail open)
    elizaLogger.error("OpenAI moderation API error:", error);
    return { shouldBlock: false };
  }
}

/**
 * Hook that intercepts tweets before they are sent and blocks them if they violate moderation policies.
 * This hook specifically targets tweet replies.
 * 
 * @param runtime The agent runtime
 * @param content The tweet content
 * @param options Additional context (like inReplyToTweetId for identifying replies)
 * @returns Modified tweet content or null if the tweet should be blocked
 */
export async function beforeSend(
  runtime: IAgentRuntime,
  content: string,
  options?: { inReplyToTweetId?: string }
): Promise<string | null> {
  try {
    // Skip moderation if running in dry-run mode
    const isDryRun = runtime.getSetting("TWITTER_DRY_RUN") === "true";
    if (isDryRun) {
      elizaLogger.log("Skipping content moderation in dry run mode");
      return content;
    }
    
    // Load moderation configuration
    const config = loadModerationConfig(runtime);
    
    // Skip moderation if disabled
    if (!config.enabled) {
      return content;
    }
    
    // If we're only moderating replies and this isn't a reply, skip moderation
    if (config.onlyReplies && !options?.inReplyToTweetId) {
      return content;
    }
    
    elizaLogger.log(`Moderating ${options?.inReplyToTweetId ? "reply" : "tweet"} content...`);
    
    // Check content against moderation API
    const { shouldBlock, reason, scores } = await moderateContent(content, config);
    
    if (shouldBlock) {
      elizaLogger.warn(`Tweet blocked by moderation: ${reason} content detected`);
      elizaLogger.warn(`Flagged content: "${content}"`);
      
      if (scores) {
        const scoresString = Object.entries(scores)
          .filter(([category]) => config.blockReasons.includes(category))
          .map(([category, score]) => `${category}: ${score.toFixed(4)}`)
          .join(", ");
        
        elizaLogger.warn(`Moderation scores: ${scoresString}`);
      }
      
      // Block the tweet
      return null;
    }
    
    // Allow the tweet to be sent
    return content;
  } catch (error) {
    // Log error but allow content through on plugin error (fail open)
    elizaLogger.error("Error in OpenAI moderation plugin:", error);
    return content;
  }
}