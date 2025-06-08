import axios from 'axios';

// Mock configuration
const config = {
  enabled: true,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  thresholds: {
    hate: 0.5,
    violence: 0.5,
  },
  blockReasons: ['hate', 'violence'],
  onlyReplies: true
};

// Mock logging
const elizaLogger = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

/**
 * Moderates text content using OpenAI's moderation API.
 */
async function moderateContent(text, config) {
  try {
    if (!config.openaiApiKey) {
      console.error("Error: No OpenAI API key provided. Set the OPENAI_API_KEY environment variable.");
      return { shouldBlock: false };
    }
    
    // Make request to OpenAI moderation API
    const response = await axios.post(
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
    
    console.log("Moderation scores:", scores);
    
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
    console.error("OpenAI moderation API error:", error.message);
    return { shouldBlock: false };
  }
}

/**
 * Hook that intercepts tweets before they are sent and blocks them if they violate moderation policies.
 */
async function beforeSend(content, options) {
  try {
    // Skip moderation if disabled
    if (!config.enabled) {
      return content;
    }
    
    // If we're only moderating replies and this isn't a reply, skip moderation
    if (config.onlyReplies && !options?.inReplyToTweetId) {
      return content;
    }
    
    console.log(`Moderating ${options?.inReplyToTweetId ? "reply" : "tweet"} content...`);
    
    // Check content against moderation API
    const { shouldBlock, reason, scores } = await moderateContent(content, config);
    
    if (shouldBlock) {
      console.warn(`Tweet blocked by moderation: ${reason} content detected`);
      console.warn(`Flagged content: "${content}"`);
      
      if (scores) {
        const scoresString = Object.entries(scores)
          .filter(([category]) => config.blockReasons.includes(category))
          .map(([category, score]) => `${category}: ${score.toFixed(4)}`)
          .join(", ");
        
        console.warn(`Moderation scores: ${scoresString}`);
      }
      
      // Block the tweet
      return null;
    }
    
    // Allow the tweet to be sent
    return content;
  } catch (error) {
    // Log error but allow content through on plugin error (fail open)
    console.error("Error in OpenAI moderation plugin:", error);
    return content;
  }
}

async function testModeration() {
  console.log("Testing OpenAI Moderation Plugin");
  
  // Test 1: Safe content
  const safeContent = "This is a friendly tweet about technology and science.";
  console.log("\nTesting safe content:");
  console.log(`Input: "${safeContent}"`);
  const safeResult = await beforeSend(safeContent, { inReplyToTweetId: '123456' });
  console.log(`Result: ${safeResult === safeContent ? "PASSED" : "BLOCKED"}`);
  
  // Test 2: Content with hate speech (should be blocked)
  const hateContent = "I hate everyone from that group, they're all terrible people";
  console.log("\nTesting content with hate speech:");
  console.log(`Input: "${hateContent}"`);
  const hateResult = await beforeSend(hateContent, { inReplyToTweetId: '123456' });
  console.log(`Result: ${hateResult === null ? "BLOCKED" : "PASSED"}`);
  
  // Test 3: Content with violent language (should be blocked)
  const violentContent = "I'm going to hurt someone very badly tomorrow";
  console.log("\nTesting content with violent language:");
  console.log(`Input: "${violentContent}"`);
  const violentResult = await beforeSend(violentContent, { inReplyToTweetId: '123456' });
  console.log(`Result: ${violentResult === null ? "BLOCKED" : "PASSED"}`);
  
  // Test 4: Testing non-reply tweet (should pass due to onlyReplies setting)
  console.log("\nTesting non-reply tweet:");
  console.log(`Input: "${hateContent}" (not a reply)`);
  const nonReplyResult = await beforeSend(hateContent, { inReplyToTweetId: undefined });
  console.log(`Result: ${nonReplyResult === hateContent ? "PASSED (as expected for non-replies)" : "BLOCKED"}`);
}

// Run the test
testModeration().catch(error => {
  console.error("Error running moderation test:", error);
});