import axios from 'axios';

interface GiphyConfig {
  apiKey: string;
}

interface GiphyGif {
  id: string;
  url: string;
  title: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
    };
    fixed_height: {
      url: string;
    };
  };
}

export class GiphyClient {
  private config: GiphyConfig;
  private baseUrl = 'https://api.giphy.com/v1/gifs';

  constructor() {
    this.config = {
      apiKey: process.env.GIPHY_API_KEY || 'dc6zaTOxFJmzC', // Public beta key for development
    };
  }

  /**
   * Search for celebration GIFs
   * @param query - Search query (default: 'celebration')
   * @param limit - Number of results to return (default: 5)
   * @returns Array of GIF objects
   */
  async searchGifs(query: string = 'celebration success', limit: number = 5): Promise<GiphyGif[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          api_key: this.config.apiKey,
          q: query,
          limit,
          rating: 'g', // Keep it workplace appropriate
          lang: 'en',
        },
      });

      return response.data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.url,
        title: gif.title,
        images: {
          original: {
            url: gif.images.original.url,
            width: gif.images.original.width,
            height: gif.images.original.height,
          },
          fixed_height: {
            url: gif.images.fixed_height.url,
          },
        },
      }));
    } catch (error: any) {
      console.error('Error searching Giphy:', error.message);
      // Return fallback GIFs if API fails
      return this.getFallbackGifs();
    }
  }

  /**
   * Get a random trending celebration GIF
   */
  async getRandomCelebrationGif(): Promise<GiphyGif | null> {
    const searchTerms = [
      'celebration',
      'success',
      'winning',
      'party',
      'achievement',
      'victory',
      'excited',
      'yes',
    ];

    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const gifs = await this.searchGifs(randomTerm, 10);

    if (gifs.length === 0) {
      return null;
    }

    // Return a random GIF from the results
    return gifs[Math.floor(Math.random() * gifs.length)];
  }

  /**
   * Get multiple celebration GIFs for user to choose from
   * @param count - Number of GIFs to return
   */
  async getCelebrationGifOptions(count: number = 3): Promise<GiphyGif[]> {
    const gifs = await this.searchGifs('celebration success achievement', count * 2);

    // Randomize and return the requested count
    const shuffled = gifs.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Fallback GIFs if API is unavailable
   */
  private getFallbackGifs(): GiphyGif[] {
    return [
      {
        id: 'fallback-1',
        url: 'https://giphy.com/gifs/celebration-victory-success',
        title: 'Celebration',
        images: {
          original: {
            url: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
            width: '480',
            height: '270',
          },
          fixed_height: {
            url: 'https://media.giphy.com/media/g9582DNuQppxC/200.gif',
          },
        },
      },
      {
        id: 'fallback-2',
        url: 'https://giphy.com/gifs/success-achievement',
        title: 'Success',
        images: {
          original: {
            url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
            width: '480',
            height: '270',
          },
          fixed_height: {
            url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/200.gif',
          },
        },
      },
      {
        id: 'fallback-3',
        url: 'https://giphy.com/gifs/party-celebration',
        title: 'Party',
        images: {
          original: {
            url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            width: '480',
            height: '270',
          },
          fixed_height: {
            url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200.gif',
          },
        },
      },
    ];
  }
}

export const giphyClient = new GiphyClient();
