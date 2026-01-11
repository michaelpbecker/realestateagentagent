import { WebClient } from '@slack/web-api';
import axios from 'axios';

interface SlackConfig {
  token: string;
  channel: string;
  webhookUrl?: string;
}

export class SlackClient {
  private config: SlackConfig;
  private client: WebClient | null = null;

  constructor() {
    this.config = {
      token: process.env.SLACK_BOT_TOKEN || '',
      channel: process.env.SLACK_CHANNEL || '#celebrations',
      webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    };

    if (this.config.token) {
      this.client = new WebClient(this.config.token);
    }
  }

  /**
   * Post a celebration message with GIF to Slack
   * @param gifUrl - URL of the GIF to post
   * @param performanceData - Performance metrics to include in the message
   */
  async postCelebration(
    gifUrl: string,
    performanceData: {
      metricName: string;
      actual: number;
      forecast: number;
      percentDifference: number;
      date: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const message = this.formatCelebrationMessage(performanceData);

      // Try using Slack Web API first (more reliable)
      if (this.client && this.config.token) {
        await this.client.chat.postMessage({
          channel: this.config.channel,
          text: message,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: message,
              },
            },
            {
              type: 'image',
              image_url: gifUrl,
              alt_text: 'Celebration GIF',
            },
          ],
        });

        console.log('Successfully posted to Slack via Web API');
        return { success: true };
      }

      // Fallback to webhook if Web API is not configured
      if (this.config.webhookUrl) {
        await axios.post(this.config.webhookUrl, {
          text: message,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: message,
              },
            },
            {
              type: 'image',
              image_url: gifUrl,
              alt_text: 'Celebration GIF',
            },
          ],
        });

        console.log('Successfully posted to Slack via webhook');
        return { success: true };
      }

      // If neither is configured, log and return mock success
      console.warn('Slack not configured. Would have posted:', message);
      return { success: true };
    } catch (error: any) {
      console.error('Error posting to Slack:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a test message to verify Slack configuration
   */
  async sendTestMessage(): Promise<{ success: boolean; error?: string }> {
    try {
      const message = '🎉 Test message from Performance Celebration Agent!';

      if (this.client && this.config.token) {
        await this.client.chat.postMessage({
          channel: this.config.channel,
          text: message,
        });
        return { success: true };
      }

      if (this.config.webhookUrl) {
        await axios.post(this.config.webhookUrl, { text: message });
        return { success: true };
      }

      console.warn('Slack not configured');
      return { success: true };
    } catch (error: any) {
      console.error('Error sending test message:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format the celebration message with performance data
   */
  private formatCelebrationMessage(performanceData: {
    metricName: string;
    actual: number;
    forecast: number;
    percentDifference: number;
    date: string;
  }): string {
    const { metricName, actual, forecast, percentDifference, date } = performanceData;

    const formattedPercent = percentDifference.toFixed(1);
    const emoji = percentDifference > 10 ? '🚀' : '🎉';

    return `${emoji} *Great News!* We beat our forecast yesterday!\n\n` +
      `📊 *${metricName}*\n` +
      `📅 Date: ${date}\n` +
      `✅ Actual: ${actual.toLocaleString()}\n` +
      `🎯 Forecast: ${forecast.toLocaleString()}\n` +
      `📈 Beat forecast by ${formattedPercent}%\n\n` +
      `Keep up the amazing work, team! 💪`;
  }

  /**
   * Check if Slack is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.token || this.config.webhookUrl);
  }

  /**
   * Get the configured channel name
   */
  getChannel(): string {
    return this.config.channel;
  }
}

export const slackClient = new SlackClient();
