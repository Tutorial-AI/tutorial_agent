import {
    type Action,
    type IAgentRuntime,
    type Memory,
    type State,
    composeContext,
    elizaLogger,
    ModelClass,
    generateObject,
    truncateToCompleteSentence,
} from "@elizaos/core";
import { Scraper } from "agent-twitter-client";
import { tweetTemplate } from "../templates";
import { isTweetContent, TweetSchema } from "../types";

export const DEFAULT_MAX_TWEET_LENGTH = 280;

async function composeTweet(
    runtime: IAgentRuntime,
    _message: Memory,
    state?: State
): Promise<string> {
    try {
        const context = composeContext({
            state,
            template: tweetTemplate,
        });

        const tweetContentObject = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            schema: TweetSchema,
            stop: ["\n"],
        });

        if (!isTweetContent(tweetContentObject.object)) {
            elizaLogger.error(
                "Invalid tweet content:",
                tweetContentObject.object
            );
            return;
        }

        let trimmedContent = tweetContentObject.object.text.trim();

        // Truncate the content to the maximum tweet length specified in the environment settings.
        const maxTweetLength = runtime.getSetting("MAX_TWEET_LENGTH");
        if (maxTweetLength) {
            trimmedContent = truncateToCompleteSentence(
                trimmedContent,
                Number(maxTweetLength)
            );
        }

        return trimmedContent;
    } catch (error) {
        elizaLogger.error("Error composing tweet:", error);
        throw error;
    }
}

async function sendTweetViaScraper(twitterClient: Scraper, content: string) {
    const result = await twitterClient.sendTweet(content);

    const body = await result.json();
    elizaLogger.log("Tweet response:", body);

    // Check for Twitter API errors
    if (body.errors) {
        const error = body.errors[0];
        elizaLogger.error(
            `Twitter API error (${error.code}): ${error.message}`
        );
        return false;
    }

    // Check for successful tweet creation
    if (!body?.data?.create_tweet?.tweet_results?.result) {
        elizaLogger.error("Failed to post tweet: No tweet result in response");
        return false;
    }

    return true;
}

async function postTweet(
    runtime: IAgentRuntime,
    content: string
): Promise<boolean> {
    try {
        // First check if we already have a Twitter client available
        if (runtime.clients.twitter?.client?.twitterClient) {
            // Use the existing Twitter client
            const twitterClient = runtime.clients.twitter.client.twitterClient;

            // Check the authentication mode
            const authMode = runtime.getSetting("TWITTER_AUTH_MODE");
            if (authMode === "api_key" || authMode === "bearer") {
                // Using API client
                elizaLogger.log("Posting tweet via Twitter API client:", content);
                try {
                    await twitterClient.sendTweet(content);
                    return true;
                } catch (error) {
                    elizaLogger.error("Error sending tweet via API client:", error);
                    return false;
                }
            } else {
                // Using scraper client
                elizaLogger.log("Posting tweet via Twitter scraper client:", content);
                try {
                    if (content.length > DEFAULT_MAX_TWEET_LENGTH) {
                        const noteTweetResult = await twitterClient.sendNoteTweet(content);
                        if (noteTweetResult.errors && noteTweetResult.errors.length > 0) {
                            // Note Tweet failed due to authorization. Falling back to standard Tweet.
                            return await sendTweetViaScraper(twitterClient, content);
                        }
                        return true;
                    }
                    return await sendTweetViaScraper(twitterClient, content);
                } catch (error) {
                    throw new Error(`Tweet failed: ${error}`);
                }
            }
        } else {
            // No existing Twitter client, need to initialize one

            // Check if we have API keys first
            const apiKey = runtime.getSetting("TWITTER_API_KEY");
            const apiSecret = runtime.getSetting("TWITTER_API_SECRET");
            const accessToken = runtime.getSetting("TWITTER_ACCESS_TOKEN");
            const accessTokenSecret = runtime.getSetting("TWITTER_ACCESS_TOKEN_SECRET");

            if (apiKey && apiSecret && accessToken && accessTokenSecret) {
                elizaLogger.log("Using Twitter API for posting (API key auth)");

                // Import dynamically to avoid circular dependencies
                try {
                    // This is a simplification - in a real implementation you'd use the client-twitter package properly
                    const { TwitterApi } = await import("twitter-api-v2");

                    const client = new TwitterApi({
                        appKey: apiKey,
                        appSecret: apiSecret,
                        accessToken: accessToken,
                        accessSecret: accessTokenSecret,
                    });

                    const v2Client = client.v2;
                    await v2Client.tweet(content);
                    elizaLogger.log("Tweet posted successfully via API v2");
                    return true;
                } catch (error) {
                    elizaLogger.error("Failed to post tweet via Twitter API:", error);
                    return false;
                }
            } else {
                // Fall back to username/password auth
                const username = runtime.getSetting("TWITTER_USERNAME");
                const password = runtime.getSetting("TWITTER_PASSWORD");
                const email = runtime.getSetting("TWITTER_EMAIL");
                const twitter2faSecret = runtime.getSetting("TWITTER_2FA_SECRET");

                if (!username || !password) {
                    elizaLogger.error(
                        "Twitter credentials not configured in environment"
                    );
                    return false;
                }

                // Create a new scraper and login
                const scraper = new Scraper();
                await scraper.login(username, password, email, twitter2faSecret);
                if (!(await scraper.isLoggedIn())) {
                    elizaLogger.error("Failed to login to Twitter");
                    return false;
                }

                // Send the tweet
                elizaLogger.log("Attempting to send tweet via scraper:", content);

                try {
                    if (content.length > DEFAULT_MAX_TWEET_LENGTH) {
                        const noteTweetResult = await scraper.sendNoteTweet(content);
                        if (noteTweetResult.errors && noteTweetResult.errors.length > 0) {
                            // Note Tweet failed due to authorization. Falling back to standard Tweet.
                            return await sendTweetViaScraper(scraper, content);
                        }
                        return true;
                    }
                    return await sendTweetViaScraper(scraper, content);
                } catch (error) {
                    throw new Error(`Note Tweet failed: ${error}`);
                }
            }
        }
    } catch (error) {
        // Log the full error details
        elizaLogger.error("Error posting tweet:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause,
        });
        return false;
    }
}

export const postAction: Action = {
    name: "POST_TWEET",
    similes: ["TWEET", "POST", "SEND_TWEET"],
    description: "Post a tweet to Twitter",
    validate: async (
        runtime: IAgentRuntime,
// eslint-disable-next-line
        _message: Memory,
// eslint-disable-next-line
        _state?: State
    ) => {
        // Check for API key credentials first
        const apiKey = runtime.getSetting("TWITTER_API_KEY");
        const apiSecret = runtime.getSetting("TWITTER_API_SECRET");
        const accessToken = runtime.getSetting("TWITTER_ACCESS_TOKEN");
        const accessTokenSecret = runtime.getSetting("TWITTER_ACCESS_TOKEN_SECRET");

        const hasApiCredentials = !!apiKey && !!apiSecret && !!accessToken && !!accessTokenSecret;

        // Check for username/password credentials
        const username = runtime.getSetting("TWITTER_USERNAME");
        const password = runtime.getSetting("TWITTER_PASSWORD");
        const email = runtime.getSetting("TWITTER_EMAIL");
        const hasUserCredentials = !!username && !!password && !!email;

        const hasCredentials = hasApiCredentials || hasUserCredentials;
        elizaLogger.log(`Has credentials: ${hasCredentials} (API: ${hasApiCredentials}, User: ${hasUserCredentials})`);

        return hasCredentials;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<boolean> => {
        try {
            // Generate tweet content using context
            const tweetContent = await composeTweet(runtime, message, state);

            if (!tweetContent) {
                elizaLogger.error("No content generated for tweet");
                return false;
            }

            elizaLogger.log(`Generated tweet content: ${tweetContent}`);

            // Check for dry run mode - explicitly check for string "true"
            const dryRun = runtime.getSetting("TWITTER_DRY_RUN") || process.env.TWITTER_DRY_RUN;
            if (dryRun && dryRun.toLowerCase() === "true") {
                elizaLogger.info(
                    `Dry run: would have posted tweet: ${tweetContent}`
                );
                return true;
            }

            return await postTweet(runtime, tweetContent);
        } catch (error) {
            elizaLogger.error("Error in post action:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "You should tweet that" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll share this update with my followers right away!",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Post this tweet" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll post that as a tweet now.",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Share that on Twitter" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll share this message on Twitter.",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Post that on X" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll post this message on X right away.",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "You should put that on X dot com" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll put this message up on X.com now.",
                    action: "POST_TWEET",
                },
            },
        ],
    ],
};
