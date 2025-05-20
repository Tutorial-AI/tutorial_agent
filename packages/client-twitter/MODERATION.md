# OpenAI Moderation Gate for Twitter Replies

This document describes the implementation of an automatic OpenAI Moderation Gate for Twitter replies in the Eliza Twitter client.

## Implementation Overview

The moderation system intercepts every Twitter reply (and can be configured to check all tweets) before they are sent, and blocks them if the content is flagged as harmful by the OpenAI Moderation API.

### Key Components

1. **OpenAIModerationPlugin.ts**: The core plugin file that implements the moderation logic
2. **Integration with post.ts**: Modifications to the Twitter client's post methods to use the moderation plugin
3. **Configuration via environment variables**: Flexible configuration to adjust moderation settings

## Features

- **Targeted Moderation**: Focuses on Twitter replies by default, but can be configured to moderate all tweets
- **Configurable Thresholds**: Set different thresholds for different content categories (hate, violence, etc.)
- **Detailed Logging**: Logs moderation decisions with justification and scores
- **Fail Open**: If the moderation API fails, tweets will still be sent (configurable)
- **Zero Runtime Dependency for Core Functionality**: Uses dynamic imports to avoid breaking changes
- **Comprehensive Testing**: Includes test cases for various moderation scenarios

## Configuration

To enable and configure the moderation gate, set the following environment variables:

```
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional with defaults
TWITTER_MODERATION_ENABLED=true
TWITTER_MODERATION_THRESHOLD_HATE=0.5
TWITTER_MODERATION_THRESHOLD_VIOLENCE=0.5
TWITTER_MODERATION_BLOCK_REASONS=hate,violence
TWITTER_MODERATION_ONLY_REPLIES=true
```

## How It Works

1. When a Twitter reply is about to be sent, the `beforeSend` function in `OpenAIModerationPlugin.ts` is called
2. The plugin checks if moderation is enabled and if the content should be moderated (based on config)
3. If moderation is needed, it sends the content to the OpenAI Moderation API
4. The API response includes scores for different content categories (hate, violence, etc.)
5. If any category exceeds its configured threshold, the content is blocked
6. Detailed information about the blocked content is logged
7. If the content passes moderation, it is sent to Twitter

## Installation

No additional installation steps are needed. The moderation plugin is automatically loaded when the Twitter client is initialized.

## Logging Examples

When content is blocked, logs will show details like:

```
[warn] Tweet blocked by moderation: hate content detected
[warn] Flagged content: "This contains hateful language"
[warn] Moderation scores: hate: 0.9100, violence: 0.0500
```

## Files Modified

- `/packages/client-twitter/src/plugins/OpenAIModerationPlugin.ts` (New file)
- `/packages/client-twitter/src/plugins/README.md` (New file)
- `/packages/client-twitter/src/post.ts` (Modified to integrate moderation)
- `/packages/client-twitter/src/__tests__/openai-moderation.test.ts` (New file)
- `/packages/client-twitter/package.json` (Added axios dependency)
- `/packages/client-twitter/MODERATION.md` (This file)

## Example Usage

The moderation plugin works automatically once the environment variables are set. No additional code changes are needed to use it.

## Testing

The implementation includes comprehensive test cases covering various scenarios, including:
- Safe content passing through
- Blocking content with high hate scores
- Blocking content with high violence scores
- Respecting custom thresholds
- Handling API errors gracefully

## Future Enhancements

Possible future enhancements for the moderation system:
1. Support for additional content moderation APIs
2. More granular control over which categories to check
3. Integration with a custom moderation database for persistent blocklists
4. User feedback loop for improving moderation accuracy
5. Admin dashboard for monitoring and adjusting moderation settings