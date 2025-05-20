# Twitter Client Plugins

This directory contains plugins for the Eliza Twitter client that extend or modify its functionality.

## OpenAI Moderation Plugin

This plugin intercepts tweet replies before they are sent and blocks them if they contain harmful content according to the OpenAI moderation API.

### Configuration

To use the OpenAI moderation plugin, set the following environment variables:

**Required:**
- `OPENAI_API_KEY`: Your OpenAI API key for accessing the moderation API.

**Optional:**
- `TWITTER_MODERATION_ENABLED`: Set to "false" to disable moderation (default: true)
- `TWITTER_MODERATION_THRESHOLD_HATE`: Threshold for hate content (0.0-1.0, default: 0.5)
- `TWITTER_MODERATION_THRESHOLD_VIOLENCE`: Threshold for violence content (0.0-1.0, default: 0.5)
- `TWITTER_MODERATION_BLOCK_REASONS`: Comma-separated list of categories to block (default: "hate,violence")
- `TWITTER_MODERATION_ONLY_REPLIES`: Set to "false" to moderate all tweets, not just replies (default: true)

### Categories

The OpenAI moderation API checks for the following content categories:

- `hate`: Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.
- `hate/threatening`: Hateful content that also includes violence or serious harm towards the targeted group.
- `harassment`: Content that expresses, incites, or promotes harassing language towards any target.
- `harassment/threatening`: Harassment content that also includes violence or serious harm towards the target.
- `self-harm`: Content that promotes, encourages, or depicts acts of self-harm, such as suicide, cutting, and eating disorders.
- `self-harm/intent`: Content where the speaker expresses that they are engaging or intend to engage in acts of self-harm.
- `self-harm/instructions`: Content that encourages or instructs others to harm themselves.
- `sexual`: Content meant to arouse sexual excitement, such as descriptions of sexual activity or promotion of sexual services.
- `sexual/minors`: Sexual content that includes an individual under 18 years old.
- `violence`: Content that promotes or glorifies violence or celebrates the suffering of others.
- `violence/graphic`: Violent content that depicts death, violence, or serious physical injury in extreme detail.

You can block any of these categories by adding them to the `TWITTER_MODERATION_BLOCK_REASONS` environment variable. For each category, you can customize the threshold by setting environment variables in the format: `TWITTER_MODERATION_THRESHOLD_CATEGORY` (e.g., `TWITTER_MODERATION_THRESHOLD_HATE=0.7`).

### Behavior

When a tweet reply (or any tweet if `TWITTER_MODERATION_ONLY_REPLIES` is set to "false") is detected as violating the moderation policy:

1. The content is blocked and not sent to Twitter.
2. A warning is logged with details about the blocked content.
3. The moderation scores are logged for transparency.

The plugin fails open in case of API errors or other issues, allowing tweets to go through rather than potentially blocking legitimate content.