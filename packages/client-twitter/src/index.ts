import { type Client, elizaLogger, type IAgentRuntime } from "@elizaos/core";
import { ClientBase } from "./base.ts";
import { validateTwitterConfig, type TwitterConfig } from "./environment.ts";
import { TwitterInteractionClient } from "./interactions.ts";
import { TwitterPostClient } from "./post.ts";
import { TwitterSearchClient } from "./search.ts";
import { TwitterSpaceClient } from "./spaces.ts";
import { ApiTwitterClient } from "./api-client.ts";

// Define a union type for the Twitter client
export type TwitterClient = ClientBase | ApiTwitterClient;

/**
 * A manager that orchestrates all specialized Twitter logic:
 * - client: base operations (login, timeline caching, etc.)
 * - post: autonomous posting logic
 * - search: searching tweets / replying logic
 * - interaction: handling mentions, replies
 * - space: launching and managing Twitter Spaces (optional)
 */
class TwitterManager {
    client: TwitterClient;
    post: TwitterPostClient;
    search: TwitterSearchClient;
    interaction: TwitterInteractionClient;
    space?: TwitterSpaceClient;

    constructor(runtime: IAgentRuntime, twitterConfig: TwitterConfig) {
        // Determine which client implementation to use based on auth mode
        if (twitterConfig.TWITTER_AUTH_MODE === 'api_key' || twitterConfig.TWITTER_AUTH_MODE === 'bearer') {
            elizaLogger.log("Using Twitter API client with API key authentication");
            this.client = new ApiTwitterClient(runtime, twitterConfig);
        } else {
            elizaLogger.log("Using Twitter scraper client with username/password authentication");
            this.client = new ClientBase(runtime, twitterConfig);
        }

        // Posting logic
        this.post = new TwitterPostClient(this.client, runtime);

        // Optional search logic (enabled if TWITTER_SEARCH_ENABLE is true)
        if (twitterConfig.TWITTER_SEARCH_ENABLE) {
            elizaLogger.warn("Twitter/X client running in a mode that:");
            elizaLogger.warn("1. violates consent of random users");
            elizaLogger.warn("2. burns your rate limit");
            elizaLogger.warn("3. can get your account banned");
            elizaLogger.warn("use at your own risk");
            this.search = new TwitterSearchClient(this.client, runtime);
        }

        // Mentions and interactions
        this.interaction = new TwitterInteractionClient(this.client, runtime);

        // Optional Spaces logic (enabled if TWITTER_SPACES_ENABLE is true)
        if (twitterConfig.TWITTER_SPACES_ENABLE && twitterConfig.TWITTER_AUTH_MODE !== 'api_key') {
            // Spaces are only supported with the scraper client for now
            this.space = new TwitterSpaceClient(this.client as ClientBase, runtime);
        }
    }
}

export const TwitterClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        const twitterConfig: TwitterConfig =
            await validateTwitterConfig(runtime);

        elizaLogger.log("Twitter client started");
        elizaLogger.log(`Using authentication mode: ${twitterConfig.TWITTER_AUTH_MODE}`);

        const manager = new TwitterManager(runtime, twitterConfig);

        // Initialize login/session
        await manager.client.init();

        // Start the posting loop
        await manager.post.start();

        // Start the search logic if it exists
        if (manager.search) {
            await manager.search.start();
        }

        // Start interactions (mentions, replies)
        await manager.interaction.start();

        // If Spaces are enabled, start the periodic check
        if (manager.space) {
            manager.space.startPeriodicSpaceCheck();
        }

        return manager;
    },

    async stop(_runtime: IAgentRuntime) {
        elizaLogger.warn("Twitter client does not support stopping yet");
    },
};

export default TwitterClientInterface;
