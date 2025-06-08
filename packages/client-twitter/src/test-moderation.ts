import { beforeSend } from './plugins/OpenAIModerationPlugin.js';

// Mock runtime for testing
const mockRuntime = {
  getSetting: (key: string) => {
    const settings: Record<string, string> = {
      'OPENAI_API_KEY': process.env.OPENAI_API_KEY || '',
      'TWITTER_MODERATION_ENABLED': 'true',
      'TWITTER_MODERATION_THRESHOLD_HATE': '0.5',
      'TWITTER_MODERATION_THRESHOLD_VIOLENCE': '0.5',
      'TWITTER_MODERATION_BLOCK_REASONS': 'hate,violence',
      'TWITTER_MODERATION_ONLY_REPLIES': 'true',
    };
    return settings[key];
  },
  cacheManager: {
    get: async () => null,
    set: async () => {},
  },
  elizaLogger: {
    log: console.log,
    warn: console.warn,
    error: console.error,
  },
};

async function testModeration() {
  console.log("Testing OpenAI Moderation Plugin");
  
  // Test 1: Safe content
  const safeContent = "This is a friendly tweet about technology and science.";
  console.log("\nTesting safe content:");
  console.log(`Input: "${safeContent}"`);
  const safeResult = await beforeSend(mockRuntime as any, safeContent, { inReplyToTweetId: '123456' });
  console.log(`Result: ${safeResult === safeContent ? "PASSED" : "BLOCKED"}`);
  
  // Test 2: Content with hate speech (should be blocked)
  const hateContent = "I hate everyone from that group, they're all terrible";
  console.log("\nTesting content with hate speech:");
  console.log(`Input: "${hateContent}"`);
  const hateResult = await beforeSend(mockRuntime as any, hateContent, { inReplyToTweetId: '123456' });
  console.log(`Result: ${hateResult === null ? "BLOCKED" : "PASSED"}`);
  
  // Test 3: Content with violent language (should be blocked)
  const violentContent = "I'm going to hurt someone very badly tomorrow";
  console.log("\nTesting content with violent language:");
  console.log(`Input: "${violentContent}"`);
  const violentResult = await beforeSend(mockRuntime as any, violentContent, { inReplyToTweetId: '123456' });
  console.log(`Result: ${violentResult === null ? "BLOCKED" : "PASSED"}`);
  
  // Test 4: Testing non-reply tweet (should pass due to onlyReplies setting)
  console.log("\nTesting non-reply tweet:");
  console.log(`Input: "${hateContent}" (not a reply)`);
  const nonReplyResult = await beforeSend(mockRuntime as any, hateContent, { inReplyToTweetId: undefined });
  console.log(`Result: ${nonReplyResult === hateContent ? "PASSED (as expected for non-replies)" : "BLOCKED"}`);
}

// Run the test
testModeration().catch(error => {
  console.error("Error running moderation test:", error);
});