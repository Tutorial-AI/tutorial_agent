import { 
    elizaLogger, 
    type IAgentRuntime,
    generateText,
    ModelClass
} from "@elizaos/core";
import type { BNBMCPInsight } from "../types";

export class TwitterService {
    private runtime: IAgentRuntime;
    private lastTweetedInsights: Set<string> = new Set();
    
    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
    }
    
    /**
     * Generate tweet text from insight using OpenAI
     */
    async generateTweetText(insight: BNBMCPInsight): Promise<string> {
        const prompt = `Generate an engaging tweet about this BNB Chain event. Be informative but concise.

Event Type: ${insight.type}
Title: ${insight.title}
Description: ${insight.description}
Severity: ${insight.severity}
Timestamp: ${new Date(insight.timestamp).toISOString()}

Requirements:
- Maximum 260 characters (leave room for links)
- Use relevant emojis
- Include 2-3 relevant hashtags from: #BNB #BSC #BNBChain #DeFi #Crypto #Web3 #SmartContract #WhaleAlert
- Make it sound exciting and newsworthy
- Be factual and informative
- Use active voice
- If it's a whale alert, include the amount
- If it's a new contract, mention potential use case

Generate only the tweet text, nothing else:`;
        
        try {
            const tweetText = await generateText({
                runtime: this.runtime,
                context: prompt,
                modelClass: ModelClass.SMALL,
            });
            
            return tweetText.trim();
        } catch (error) {
            elizaLogger.error("Failed to generate tweet text:", error);
            // Fallback to simple formatting
            return `${insight.title}\n\n${insight.description}\n\n#BNBChain #BSC #Crypto`;
        }
    }
    
    /**
     * Post insight to Twitter
     */
    async postInsight(insight: BNBMCPInsight): Promise<boolean> {
        // Check if we've already tweeted about this
        const insightKey = `${insight.type}-${insight.title}`;
        if (this.lastTweetedInsights.has(insightKey)) {
            elizaLogger.debug("Skipping duplicate insight:", insightKey);
            return false;
        }
        
        try {
            // Generate tweet text
            const tweetText = await this.generateTweetText(insight);
            
            // Add transaction link if available
            let finalTweet = tweetText;
            if ('hash' in insight.data && insight.data.hash) {
                const bscScanLink = `\n\nhttps://bscscan.com/tx/${insight.data.hash}`;
                if (finalTweet.length + bscScanLink.length <= 280) {
                    finalTweet += bscScanLink;
                }
            } else if ('contractAddress' in insight.data && insight.data.contractAddress) {
                const bscScanLink = `\n\nhttps://bscscan.com/address/${insight.data.contractAddress}`;
                if (finalTweet.length + bscScanLink.length <= 280) {
                    finalTweet += bscScanLink;
                }
            }
            
            elizaLogger.info(`Posting tweet: ${finalTweet}`);
            
            // Post to Twitter
            const twitterClient = this.runtime.clients?.twitter;
            if (twitterClient && typeof twitterClient.post === 'function') {
                await twitterClient.post({
                    text: finalTweet,
                    inReplyTo: null,
                });
                
                // Remember this insight
                this.lastTweetedInsights.add(insightKey);
                
                // Keep only last 100 insights in memory
                if (this.lastTweetedInsights.size > 100) {
                    const keysArray = Array.from(this.lastTweetedInsights);
                    this.lastTweetedInsights.delete(keysArray[0]);
                }
                
                elizaLogger.info("Tweet posted successfully!");
                return true;
            } else {
                elizaLogger.warn("Twitter client not available");
                
                // Store for later if caching is available
                if (this.runtime.cacheManager) {
                    await this.runtime.cacheManager.set(
                        `pending-tweet-${Date.now()}`,
                        { text: finalTweet, insight }
                    );
                }
                return false;
            }
        } catch (error) {
            elizaLogger.error("Failed to post tweet:", error);
            return false;
        }
    }
    
    /**
     * Post multiple insights with rate limiting
     */
    async postInsights(insights: BNBMCPInsight[], maxTweets: number = 3): Promise<number> {
        let posted = 0;
        
        for (const insight of insights.slice(0, maxTweets)) {
            if (await this.postInsight(insight)) {
                posted++;
                
                // Wait between tweets to avoid rate limiting
                if (posted < maxTweets && insights.length > posted) {
                    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
                }
            }
        }
        
        return posted;
    }
}