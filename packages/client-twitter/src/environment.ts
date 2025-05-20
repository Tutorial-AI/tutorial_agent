import {
    parseBooleanFromText,
    type IAgentRuntime,
    ActionTimelineType,
} from "@elizaos/core";
import { z, ZodError } from "zod";

export const DEFAULT_MAX_TWEET_LENGTH = 280;

const twitterUsernameSchema = z
    .string()
    .min(1, "An X/Twitter Username must be at least 1 character long")
    .max(15, "An X/Twitter Username cannot exceed 15 characters")
    .refine((username) => {
        // Allow wildcard '*' as a special case
        if (username === "*") return true;

        // Twitter usernames can:
        // - Start with digits now
        // - Contain letters, numbers, underscores
        // - Must not be empty
        return /^[A-Za-z0-9_]+$/.test(username);
    }, "An X Username can only contain letters, numbers, and underscores");

/**
 * Base schema for common Twitter configuration settings
 */
const twitterBaseEnvSchema = z.object({
    TWITTER_DRY_RUN: z.boolean(),
    MAX_TWEET_LENGTH: z.number().int().default(DEFAULT_MAX_TWEET_LENGTH),
    TWITTER_SEARCH_ENABLE: z.boolean().default(false),
    TWITTER_RETRY_LIMIT: z.number().int(),
    TWITTER_POLL_INTERVAL: z.number().int(),
    TWITTER_TARGET_USERS: z.array(twitterUsernameSchema).default([]),
    POST_INTERVAL_MIN: z.number().int(),
    POST_INTERVAL_MAX: z.number().int(),
    ENABLE_ACTION_PROCESSING: z.boolean(),
    ACTION_INTERVAL: z.number().int(),
    POST_IMMEDIATELY: z.boolean(),
    TWITTER_SPACES_ENABLE: z.boolean().default(false),
    MAX_ACTIONS_PROCESSING: z.number().int(),
    ACTION_TIMELINE_TYPE: z
        .nativeEnum(ActionTimelineType)
        .default(ActionTimelineType.ForYou),
});


//Schema for username/password authentication

const twitterUsernamePasswordSchema = z.object({
    TWITTER_USERNAME: z.string().min(1, "X/Twitter username is required"),
    TWITTER_PASSWORD: z.string().min(1, "X/Twitter password is required"),
    TWITTER_EMAIL: z.string().email("Valid X/Twitter email is required"),
    TWITTER_2FA_SECRET: z.string(),
    TWITTER_API_KEY: z.string().optional(),
    TWITTER_API_SECRET: z.string().optional(),
    TWITTER_ACCESS_TOKEN: z.string().optional(),
    TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),
    TWITTER_BEARER_TOKEN: z.string().optional(),
    TWITTER_AUTH_MODE: z.literal("password").default("password"),
});


// Schema for API key authentication
 
const twitterApiKeySchema = z.object({
    TWITTER_USERNAME: z.string().optional(),
    TWITTER_PASSWORD: z.string().optional(),
    TWITTER_EMAIL: z.string().optional(),
    TWITTER_2FA_SECRET: z.string().optional(),
    TWITTER_API_KEY: z.string().min(1, "X/Twitter API key is required"),
    TWITTER_API_SECRET: z.string().min(1, "X/Twitter API secret is required"),
    TWITTER_ACCESS_TOKEN: z.string().min(1, "X/Twitter access token is required"),
    TWITTER_ACCESS_TOKEN_SECRET: z.string().min(1, "X/Twitter access token secret is required"),
    TWITTER_BEARER_TOKEN: z.string().optional(),
    TWITTER_AUTH_MODE: z.literal("api_key").default("api_key"),
});

/**
 * Schema for bearer token authentication (limited functionality - read-only)
 */
const twitterBearerTokenSchema = z.object({
    TWITTER_USERNAME: z.string().optional(),
    TWITTER_PASSWORD: z.string().optional(),
    TWITTER_EMAIL: z.string().optional(),
    TWITTER_2FA_SECRET: z.string().optional(),
    TWITTER_API_KEY: z.string().optional(),
    TWITTER_API_SECRET: z.string().optional(),
    TWITTER_ACCESS_TOKEN: z.string().optional(),
    TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),
    TWITTER_BEARER_TOKEN: z.string().min(1, "X/Twitter bearer token is required"),
    TWITTER_AUTH_MODE: z.literal("bearer").default("bearer"),
});

/**
 * Combined schema for all authentication methods
 */
export const twitterEnvSchema = z.intersection(
    twitterBaseEnvSchema,
    z.discriminatedUnion("TWITTER_AUTH_MODE", [
        twitterUsernamePasswordSchema,
        twitterApiKeySchema,
        twitterBearerTokenSchema,
    ])
);

export type TwitterConfig = z.infer<typeof twitterEnvSchema>;

/**
 * Helper to parse a comma-separated list of Twitter usernames
 * (already present in your code).
 */
function parseTargetUsers(targetUsersStr?: string | null): string[] {
    if (!targetUsersStr?.trim()) {
        return [];
    }
    return targetUsersStr
        .split(",")
        .map((user) => user.trim())
        .filter(Boolean);
}

function safeParseInt(
    value: string | undefined | null,
    defaultValue: number
): number {
    if (!value) return defaultValue;
    const parsed = Number.parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : Math.max(1, parsed);
}


 //Determines the authentication mode based on available credentials.
 //This is needed for the discriminated union above.
 
function determineAuthMode(runtime: IAgentRuntime): string {
    const apiKey = runtime.getSetting("TWITTER_API_KEY") || process.env.TWITTER_API_KEY;
    const apiSecret = runtime.getSetting("TWITTER_API_SECRET") || process.env.TWITTER_API_SECRET;
    const accessToken = runtime.getSetting("TWITTER_ACCESS_TOKEN") || process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = runtime.getSetting("TWITTER_ACCESS_TOKEN_SECRET") || process.env.TWITTER_ACCESS_TOKEN_SECRET;
    const bearerToken = runtime.getSetting("TWITTER_BEARER_TOKEN") || process.env.TWITTER_BEARER_TOKEN;
    const username = runtime.getSetting("TWITTER_USERNAME") || process.env.TWITTER_USERNAME;
    const password = runtime.getSetting("TWITTER_PASSWORD") || process.env.TWITTER_PASSWORD;

    // Explicitly set mode takes precedence
    const explicitMode = runtime.getSetting("TWITTER_AUTH_MODE") || process.env.TWITTER_AUTH_MODE;
    if (explicitMode) {
        return explicitMode;
    }

    // Otherwise infer from credentials
    if (apiKey && apiSecret && accessToken && accessTokenSecret) {
        return "api_key";
    } else if (bearerToken) {
        return "bearer";
    } else if (username && password) {
        return "password";
    }

    // Default to password auth (original behavior)
    return "password";
}

/**
 * Validates or constructs a TwitterConfig object using zod,
 * taking values from the IAgentRuntime or process.env as needed.
 */
export async function validateTwitterConfig(
    runtime: IAgentRuntime
): Promise<TwitterConfig> {
    try {
        // Determine the auth mode first
        const authMode = determineAuthMode(runtime);

        const twitterConfig = {
            TWITTER_AUTH_MODE: authMode,

            TWITTER_DRY_RUN:
                parseBooleanFromText(
                    runtime.getSetting("TWITTER_DRY_RUN") ||
                        process.env.TWITTER_DRY_RUN
                ) ?? false,

            TWITTER_USERNAME:
                runtime.getSetting("TWITTER_USERNAME") ||
                process.env.TWITTER_USERNAME,

            TWITTER_PASSWORD:
                runtime.getSetting("TWITTER_PASSWORD") ||
                process.env.TWITTER_PASSWORD,

            TWITTER_EMAIL:
                runtime.getSetting("TWITTER_EMAIL") ||
                process.env.TWITTER_EMAIL,

            TWITTER_API_KEY:
                runtime.getSetting("TWITTER_API_KEY") ||
                process.env.TWITTER_API_KEY,

            TWITTER_API_SECRET:
                runtime.getSetting("TWITTER_API_SECRET") ||
                process.env.TWITTER_API_SECRET,

            TWITTER_ACCESS_TOKEN:
                runtime.getSetting("TWITTER_ACCESS_TOKEN") ||
                process.env.TWITTER_ACCESS_TOKEN,

            TWITTER_ACCESS_TOKEN_SECRET:
                runtime.getSetting("TWITTER_ACCESS_TOKEN_SECRET") ||
                process.env.TWITTER_ACCESS_TOKEN_SECRET,

            TWITTER_BEARER_TOKEN:
                runtime.getSetting("TWITTER_BEARER_TOKEN") ||
                process.env.TWITTER_BEARER_TOKEN,

            MAX_TWEET_LENGTH: safeParseInt(
                runtime.getSetting("MAX_TWEET_LENGTH") ||
                    process.env.MAX_TWEET_LENGTH,
                DEFAULT_MAX_TWEET_LENGTH
            ),

            TWITTER_SEARCH_ENABLE:
                parseBooleanFromText(
                    runtime.getSetting("TWITTER_SEARCH_ENABLE") ||
                        process.env.TWITTER_SEARCH_ENABLE
                ) ?? false,

            TWITTER_2FA_SECRET:
                runtime.getSetting("TWITTER_2FA_SECRET") ||
                process.env.TWITTER_2FA_SECRET ||
                "",

            TWITTER_RETRY_LIMIT: safeParseInt(
                runtime.getSetting("TWITTER_RETRY_LIMIT") ||
                    process.env.TWITTER_RETRY_LIMIT,
                5
            ),

            TWITTER_POLL_INTERVAL: safeParseInt(
                runtime.getSetting("TWITTER_POLL_INTERVAL") ||
                    process.env.TWITTER_POLL_INTERVAL,
                120 // 2m
            ),

            TWITTER_TARGET_USERS: parseTargetUsers(
                runtime.getSetting("TWITTER_TARGET_USERS") ||
                    process.env.TWITTER_TARGET_USERS
            ),

            POST_INTERVAL_MIN: safeParseInt(
                runtime.getSetting("POST_INTERVAL_MIN") ||
                    process.env.POST_INTERVAL_MIN,
                90 // 1.5 hours
            ),

            POST_INTERVAL_MAX: safeParseInt(
                runtime.getSetting("POST_INTERVAL_MAX") ||
                    process.env.POST_INTERVAL_MAX,
                180 // 3 hours
            ),

            ENABLE_ACTION_PROCESSING:
                parseBooleanFromText(
                    runtime.getSetting("ENABLE_ACTION_PROCESSING") ||
                        process.env.ENABLE_ACTION_PROCESSING
                ) ?? false,

            ACTION_INTERVAL: safeParseInt(
                runtime.getSetting("ACTION_INTERVAL") ||
                    process.env.ACTION_INTERVAL,
                5 // 5 minutes
            ),

            POST_IMMEDIATELY:
                parseBooleanFromText(
                    runtime.getSetting("POST_IMMEDIATELY") ||
                        process.env.POST_IMMEDIATELY
                ) ?? false,

            TWITTER_SPACES_ENABLE:
                parseBooleanFromText(
                    runtime.getSetting("TWITTER_SPACES_ENABLE") ||
                        process.env.TWITTER_SPACES_ENABLE
                ) ?? false,

            MAX_ACTIONS_PROCESSING: safeParseInt(
                runtime.getSetting("MAX_ACTIONS_PROCESSING") ||
                    process.env.MAX_ACTIONS_PROCESSING,
                1
            ),

            ACTION_TIMELINE_TYPE:
                runtime.getSetting("ACTION_TIMELINE_TYPE") ||
                process.env.ACTION_TIMELINE_TYPE,
        };

        // Validate with zod schema
        return twitterEnvSchema.parse(twitterConfig);
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `X/Twitter configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
