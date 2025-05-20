import { EventEmitter } from 'events';
import { elizaLogger, type IAgentRuntime, type UUID, stringToUuid, getEmbeddingZeroVector, type Content, type Memory, type State, type IImageDescriptionService } from '@elizaos/core';
import type { TwitterConfig } from './environment';
import { TwitterApiClient } from './api';
import { type QueryTweetsResponse, SearchMode, type Tweet } from 'agent-twitter-client';
import { RequestQueue } from './base';


export class ApiTwitterClient extends EventEmitter {
    runtime: IAgentRuntime;
    twitterConfig: TwitterConfig;
    twitterClient: TwitterApiClient; // Using twitterClient name for compatibility
    directions: string;
    lastCheckedTweetId: bigint | null = null;
    imageDescriptionService: IImageDescriptionService;
    temperature = 0.5;
    requestQueue: RequestQueue = new RequestQueue();
    profile: {
        id: string;
        username: string;
        screenName: string;
        bio: string;
        nicknames: string[];
    } | null;
    static _twitterClients: { [accountIdentifier: string]: any } = {};

    constructor(runtime: IAgentRuntime, twitterConfig: TwitterConfig) {
        super();
        this.runtime = runtime;
        this.twitterConfig = twitterConfig;
        this.profile = null;

        // Create the API client with the appropriate credentials
        this.twitterClient = new TwitterApiClient(
            twitterConfig.TWITTER_API_KEY,
            twitterConfig.TWITTER_API_SECRET,
            twitterConfig.TWITTER_ACCESS_TOKEN,
            twitterConfig.TWITTER_ACCESS_TOKEN_SECRET,
            twitterConfig.TWITTER_BEARER_TOKEN
        );

        this.directions =
            "- " +
            this.runtime.character.style.all.join("\n- ") +
            "- " +
            this.runtime.character.style.post.join();
    }

    async getRateLimitStatus() {
        return { remaining: "unknown" }; // API client doesn't expose rate limits in the same way
    }

    async init(): Promise<void> {
        try {
            // Get profile information
            elizaLogger.log("Fetching Twitter profile...");
            const userProfile = await this.twitterClient.getUserProfile();

            this.profile = {
                id: userProfile.id,
                username: userProfile.username,
                screenName: userProfile.screenName,
                bio: userProfile.description || '',
                nicknames: [],
            };

            elizaLogger.log(
                `Twitter profile loaded for @${this.profile.username} (${this.profile.screenName})`
            );
            elizaLogger.debug(`Twitter profile: ${JSON.stringify(this.profile)}`);

            // Store profile info for the runtime
            this.runtime.character.twitterProfile = {
                id: this.profile.id,
                username: this.profile.username,
                screenName: this.profile.screenName,
                bio: this.profile.bio,
                nicknames: this.profile.nicknames,
            };

        } catch (error) {
            elizaLogger.error("Error initializing Twitter API client:", error);
            throw error;
        }
    }

    async cacheTweet(tweet: Tweet): Promise<void> {
        try {
            // Cache the tweet in the runtime's cache
            await this.runtime.cacheManager.set(
                `twitter/tweet/${tweet.id}`,
                tweet
            );
        } catch (error) {
            elizaLogger.error("Error caching tweet:", error);
        }
    }

    async getCachedTweet(tweetId: string): Promise<Tweet | undefined> {
        return await this.runtime.cacheManager.get<Tweet>(
            `twitter/tweet/${tweetId}`
        );
    }

    async getTweet(tweetId: string): Promise<Tweet> {
        const cachedTweet = await this.getCachedTweet(tweetId);

        if (cachedTweet) {
            return cachedTweet;
        }

        const tweetData = await this.twitterClient.getTweet(tweetId);

        // Convert to Tweet type with all required properties
        const tweet: Tweet = {
            id: tweetData.id,
            username: tweetData.username,
            name: tweetData.name,
            text: tweetData.text,
            timestamp: tweetData.timestamp,
            permanentUrl: tweetData.permanentUrl,
            // Add missing required properties
            hashtags: [],
            mentions: [],
            photos: [],
            thread: [],
            urls: [],
            videos: [],
            conversationId: tweetData.id,
            inReplyToStatusId: null,
            replies: 0,
            retweets: 0,
            likes: 0
        };

        await this.cacheTweet(tweet);
        return tweet;
    }

    // Timeline fetching is not fully implemented in the API client yet
    async fetchTimelineForActions(count: number = 10): Promise<Tweet[]> {
        elizaLogger.log("Timeline fetching not yet fully implemented for API client");
        return [];
    }

    // Implement additional methods from ClientBase to ensure compatibility
    async fetchOwnPosts(count: number): Promise<Tweet[]> {
        elizaLogger.log("fetchOwnPosts not yet implemented for API client");
        return [];
    }

    async fetchHomeTimeline(count: number, following?: boolean): Promise<Tweet[]> {
        elizaLogger.log("fetchHomeTimeline not yet implemented for API client");
        return [];
    }

    async fetchSearchTweets(
        query: string,
        maxTweets: number,
        searchMode: SearchMode,
        cursor?: string
    ): Promise<QueryTweetsResponse> {
        elizaLogger.log("fetchSearchTweets not yet implemented for API client");
        return { tweets: [] };
    }

    async loadLatestCheckedTweetId(): Promise<void> {
        const latestCheckedTweetId = await this.runtime.cacheManager.get<string>(
            `twitter/${this.profile?.username}/latest_checked_tweet_id`
        );

        if (latestCheckedTweetId) {
            this.lastCheckedTweetId = BigInt(latestCheckedTweetId);
        }
    }

    async cacheLatestCheckedTweetId() {
        if (this.lastCheckedTweetId && this.profile) {
            await this.runtime.cacheManager.set(
                `twitter/${this.profile.username}/latest_checked_tweet_id`,
                this.lastCheckedTweetId.toString()
            );
        }
    }

    async getCachedTimeline(): Promise<Tweet[] | undefined> {
        if (!this.profile) return undefined;
        return await this.runtime.cacheManager.get<Tweet[]>(
            `twitter/${this.profile.username}/timeline`
        );
    }

    async cacheTimeline(timeline: Tweet[]) {
        if (!this.profile) return;
        await this.runtime.cacheManager.set(
            `twitter/${this.profile.username}/timeline`,
            timeline,
            { expires: Date.now() + 10 * 1000 }
        );
    }

    async cacheMentions(mentions: Tweet[]) {
        if (!this.profile) return;
        await this.runtime.cacheManager.set(
            `twitter/${this.profile.username}/mentions`,
            mentions,
            { expires: Date.now() + 10 * 1000 }
        );
    }

    async getCachedCookies(username: string) {
        return null; // API client doesn't use cookies
    }

    async cacheCookies(username: string, cookies: any[]) {
        // No-op for API client
    }

    async fetchProfile(username: string) {
        try {
            const profile = await this.twitterClient.getUserProfile();
            return {
                id: profile.id,
                username: profile.username,
                screenName: profile.screenName || this.runtime.character.name,
                bio: profile.description || (typeof this.runtime.character.bio === "string"
                    ? this.runtime.character.bio
                    : this.runtime.character.bio.length > 0
                        ? this.runtime.character.bio[0]
                        : ""),
                nicknames: this.runtime.character.twitterProfile?.nicknames || [],
            };
        } catch (error) {
            console.error("Error fetching Twitter profile:", error);
            throw error;
        }
    }

    async saveRequestMessage(message: Memory, state: State) {
        if (message.content.text) {
            const recentMessage = await this.runtime.messageManager.getMemories(
                {
                    roomId: message.roomId,
                    count: 1,
                    unique: false,
                }
            );

            if (
                recentMessage.length > 0 &&
                recentMessage[0].content === message.content
            ) {
                elizaLogger.debug("Message already saved", recentMessage[0].id);
            } else {
                await this.runtime.messageManager.createMemory({
                    ...message,
                    embedding: getEmbeddingZeroVector(),
                });
            }

            await this.runtime.evaluate(message, {
                ...state,
                twitterClient: this.twitterClient,
            });
        }
    }

    // Required by ClientBase - stub methods for API client
    async populateTimeline() {
        elizaLogger.log("populateTimeline not fully implemented for API client");
    }

    async isLoggedIn() {
        return true; // API client is always considered logged in if it can get profile
    }
}