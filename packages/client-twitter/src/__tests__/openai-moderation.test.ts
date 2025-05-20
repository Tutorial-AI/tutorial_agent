import { describe, it, expect, vi, beforeEach } from 'vitest';
import { beforeSend } from '../plugins/OpenAIModerationPlugin';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockAxios = axios as unknown as jest.Mocked<typeof axios>;

// Mock runtime
const mockRuntime = {
  getSetting: vi.fn((key: string) => {
    const settings: Record<string, string> = {
      'OPENAI_API_KEY': 'test-api-key',
      'TWITTER_MODERATION_ENABLED': 'true',
      'TWITTER_MODERATION_THRESHOLD_HATE': '0.5',
      'TWITTER_MODERATION_THRESHOLD_VIOLENCE': '0.5',
      'TWITTER_MODERATION_BLOCK_REASONS': 'hate,violence',
      'TWITTER_MODERATION_ONLY_REPLIES': 'true',
    };
    return settings[key];
  }),
  cacheManager: {
    get: vi.fn(),
    set: vi.fn(),
  },
  elizaLogger: {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
};

describe('OpenAI Moderation Plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow safe content to pass through', async () => {
    // Mock OpenAI API response for safe content
    mockAxios.post.mockResolvedValueOnce({
      data: {
        id: 'modr-123',
        model: 'text-moderation-latest',
        results: [
          {
            flagged: false,
            categories: {
              hate: false,
              violence: false,
            },
            category_scores: {
              hate: 0.01,
              violence: 0.01,
            },
          },
        ],
      },
    });

    const content = 'This is a friendly tweet.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: '123456' });
    
    expect(result).toBe(content);
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/moderations',
      { input: content },
      expect.anything()
    );
  });

  it('should block content with high hate score', async () => {
    // Mock OpenAI API response for hateful content
    mockAxios.post.mockResolvedValueOnce({
      data: {
        id: 'modr-456',
        model: 'text-moderation-latest',
        results: [
          {
            flagged: true,
            categories: {
              hate: true,
              violence: false,
            },
            category_scores: {
              hate: 0.91,
              violence: 0.05,
            },
          },
        ],
      },
    });

    const content = 'This contains hateful language.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: '123456' });
    
    expect(result).toBeNull();
  });

  it('should block content with high violence score', async () => {
    // Mock OpenAI API response for violent content
    mockAxios.post.mockResolvedValueOnce({
      data: {
        id: 'modr-789',
        model: 'text-moderation-latest',
        results: [
          {
            flagged: true,
            categories: {
              hate: false,
              violence: true,
            },
            category_scores: {
              hate: 0.1,
              violence: 0.85,
            },
          },
        ],
      },
    });

    const content = 'This contains violent language.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: '123456' });
    
    expect(result).toBeNull();
  });

  it('should allow content when moderation is disabled', async () => {
    // Override the getSetting mock for this test
    mockRuntime.getSetting.mockImplementation((key: string) => {
      const settings: Record<string, string> = {
        'OPENAI_API_KEY': 'test-api-key',
        'TWITTER_MODERATION_ENABLED': 'false',
        'TWITTER_MODERATION_THRESHOLD_HATE': '0.5',
        'TWITTER_MODERATION_THRESHOLD_VIOLENCE': '0.5',
        'TWITTER_MODERATION_BLOCK_REASONS': 'hate,violence',
        'TWITTER_MODERATION_ONLY_REPLIES': 'true',
      };
      return settings[key];
    });

    const content = 'This could be problematic content.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: '123456' });
    
    expect(result).toBe(content);
    expect(mockAxios.post).not.toHaveBeenCalled();
  });

  it('should only moderate replies when onlyReplies is true', async () => {
    const content = 'This is a normal tweet, not a reply.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: undefined });
    
    expect(result).toBe(content);
    expect(mockAxios.post).not.toHaveBeenCalled();
  });

  it('should fail open (allow content) when API call fails', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('API Error'));

    const content = 'This tweet should pass even with API error.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: '123456' });
    
    expect(result).toBe(content);
  });

  it('should respect custom thresholds', async () => {
    // Override the getSetting mock for this test
    mockRuntime.getSetting.mockImplementation((key: string) => {
      const settings: Record<string, string> = {
        'OPENAI_API_KEY': 'test-api-key',
        'TWITTER_MODERATION_ENABLED': 'true',
        'TWITTER_MODERATION_THRESHOLD_HATE': '0.9', // Higher threshold
        'TWITTER_MODERATION_THRESHOLD_VIOLENCE': '0.5',
        'TWITTER_MODERATION_BLOCK_REASONS': 'hate,violence',
        'TWITTER_MODERATION_ONLY_REPLIES': 'true',
      };
      return settings[key];
    });

    // Mock OpenAI API response for borderline hateful content (0.85)
    mockAxios.post.mockResolvedValueOnce({
      data: {
        id: 'modr-456',
        model: 'text-moderation-latest',
        results: [
          {
            flagged: true,
            categories: {
              hate: true,
              violence: false,
            },
            category_scores: {
              hate: 0.85, // Below our custom threshold of 0.9
              violence: 0.05,
            },
          },
        ],
      },
    });

    const content = 'This contains borderline hateful language.';
    const result = await beforeSend(mockRuntime as any, content, { inReplyToTweetId: '123456' });
    
    // Should pass because our threshold is now 0.9 and the score is 0.85
    expect(result).toBe(content);
  });
});