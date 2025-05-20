import { TwitterApi } from 'twitter-api-v2';
import { elizaLogger } from '@elizaos/core';
import type { MediaData } from './types';

export class TwitterApiClient {
  private client: TwitterApi;
  private apiKey: string;
  private apiSecret: string;
  private accessToken?: string;
  private accessTokenSecret?: string;
  private bearerToken?: string;

  constructor(
    apiKey: string,
    apiSecret: string,
    accessToken?: string,
    accessTokenSecret?: string,
    bearerToken?: string
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = accessToken;
    this.accessTokenSecret = accessTokenSecret;
    this.bearerToken = bearerToken;

    if (accessToken && accessTokenSecret) {
      // Use OAuth 1.0a for user-context requests (posting tweets, etc)
      this.client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
      });
    } else if (bearerToken) {
      // Use bearer token for app-context requests (search, etc)
      this.client = new TwitterApi(bearerToken);
    } else {
      // Use the consumer keys with oauth2 flow
      this.client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
      });
    }
  }

  async getUserProfile() {
    try {
      const userClient = this.client.readWrite;
      const userInfo = await userClient.v2.me({
        'user.fields': ['description', 'profile_image_url', 'username', 'name'],
      });
      
      elizaLogger.log('Fetched user profile:', userInfo);
      
      if (!userInfo?.data) {
        throw new Error('Failed to retrieve user profile');
      }
      
      return {
        id: userInfo.data.id,
        username: userInfo.data.username,
        screenName: userInfo.data.name,
        description: userInfo.data.description || '',
        profileImageUrl: userInfo.data.profile_image_url || '',
      };
    } catch (error) {
      elizaLogger.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async sendTweet(content: string, inReplyToTweetId?: string, mediaData?: MediaData[]) {
    try {
      const tweetClient = this.client.readWrite;
      const tweetOptions: any = { text: content };
      
      if (inReplyToTweetId) {
        tweetOptions.reply = { in_reply_to_tweet_id: inReplyToTweetId };
      }
      
      // Handle media attachments if provided
      if (mediaData && mediaData.length > 0) {
        const mediaIds = await this.uploadMedia(mediaData);
        if (mediaIds.length > 0) {
          tweetOptions.media = { media_ids: mediaIds };
        }
      }
      
      const result = await tweetClient.v2.tweet(tweetOptions);
      
      elizaLogger.log('Tweet sent successfully:', result);
      
      return {
        json: () => Promise.resolve({
          data: {
            create_tweet: {
              tweet_results: {
                result: {
                  rest_id: result.data.id,
                  legacy: {
                    full_text: content,
                    conversation_id_str: result.data.id,
                    created_at: new Date().toISOString(),
                    in_reply_to_status_id_str: inReplyToTweetId || null,
                  }
                }
              }
            }
          }
        })
      };
    } catch (error) {
      elizaLogger.error('Error sending tweet:', error);
      throw error;
    }
  }

  async likeTweet(tweetId: string) {
    try {
      const result = await this.client.readWrite.v2.like(await this.getUserId(), tweetId);
      return result;
    } catch (error) {
      elizaLogger.error('Error liking tweet:', error);
      throw error;
    }
  }

  async retweet(tweetId: string) {
    try {
      const result = await this.client.readWrite.v2.retweet(await this.getUserId(), tweetId);
      return result;
    } catch (error) {
      elizaLogger.error('Error retweeting:', error);
      throw error;
    }
  }

  async sendQuoteTweet(content: string, quotedTweetId: string) {
    try {
      const tweetClient = this.client.readWrite;
      const quotedTweetUrl = `https://twitter.com/i/status/${quotedTweetId}`;
      
      const result = await tweetClient.v2.tweet({
        text: `${content} ${quotedTweetUrl}`,
      });
      
      return {
        json: () => Promise.resolve({
          data: {
            create_tweet: {
              tweet_results: {
                result: {
                  rest_id: result.data.id,
                  legacy: {
                    full_text: `${content} ${quotedTweetUrl}`,
                    conversation_id_str: result.data.id,
                    created_at: new Date().toISOString(),
                  }
                }
              }
            }
          }
        })
      };
    } catch (error) {
      elizaLogger.error('Error sending quote tweet:', error);
      throw error;
    }
  }

  async sendNoteTweet(content: string, inReplyToTweetId?: string, mediaData?: MediaData[]) {
    // Twitter API v2 doesn't have a separate endpoint for "note tweets" (longer tweets)
    return this.sendTweet(content, inReplyToTweetId, mediaData);
  }

  async getTweet(tweetId: string) {
    try {
      const result = await this.client.readWrite.v2.singleTweet(tweetId, {
        'tweet.fields': ['created_at', 'author_id', 'conversation_id', 'text'],
        'user.fields': ['username', 'name'],
        'expansions': ['author_id'],
      });
      
      if (!result.data || !result.includes?.users?.[0]) {
        throw new Error('Failed to retrieve tweet data');
      }
      
      const user = result.includes.users[0];
      
      return {
        id: result.data.id,
        username: user.username,
        name: user.name,
        text: result.data.text,
        createdAt: result.data.created_at,
        timestamp: new Date(result.data.created_at).getTime(),
        permanentUrl: `https://twitter.com/${user.username}/status/${result.data.id}`,
      };
    } catch (error) {
      elizaLogger.error('Error fetching tweet:', error);
      throw error;
    }
  }

  private async getUserId(): Promise<string> {
    const profile = await this.getUserProfile();
    return profile.id;
  }

  private async uploadMedia(mediaData: MediaData[]) {
    const mediaClient = this.client.readWrite.v1;
    const mediaIds: string[] = [];

    for (const media of mediaData) {
      try {
        // Use mediaType from our MediaData type
        const mimeType = media.mediaType;
        if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
          const uploadedMedia = await mediaClient.uploadMedia(media.data, { mimeType });
          mediaIds.push(uploadedMedia);
        }
      } catch (error) {
        elizaLogger.error(`Error uploading media: ${error}`);
      }
    }

    return mediaIds;
  }
}