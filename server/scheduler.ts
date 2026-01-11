import cron, { ScheduledTask } from 'node-cron';
import { modeClient } from './mode.js';
import { giphyClient } from './giphy.js';
import { WebClient } from '@slack/web-api';

interface SchedulerConfig {
  enabled: boolean;
  schedule: string; // Cron expression
  modeReportToken: string;
  modeQueryName?: string;
}

class PerformanceScheduler {
  private config: SchedulerConfig;
  private slackClient: WebClient | null = null;
  private reviewChannel: string;
  private celebrationChannel: string;
  private task: ScheduledTask | null = null;
  private pendingApprovals = new Map<string, any>();

  constructor() {
    this.config = {
      enabled: process.env.PERFORMANCE_AGENT_ENABLED === 'true',
      schedule: process.env.PERFORMANCE_CHECK_SCHEDULE || '0 9 * * *', // Default: 9 AM daily
      modeReportToken: process.env.MODE_REPORT_TOKEN || '',
      modeQueryName: process.env.MODE_QUERY_NAME,
    };

    if (process.env.SLACK_BOT_TOKEN) {
      this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
    }

    this.reviewChannel = process.env.SLACK_REVIEW_CHANNEL || process.env.SLACK_CHANNEL || '#celebrations-review';
    this.celebrationChannel = process.env.SLACK_CHANNEL || '#celebrations';
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (!this.config.enabled) {
      console.log('Performance agent scheduler is disabled');
      return;
    }

    if (!this.config.modeReportToken) {
      console.warn('MODE_REPORT_TOKEN not configured. Scheduler will not run.');
      return;
    }

    console.log(`Starting performance agent scheduler with schedule: ${this.config.schedule}`);

    this.task = cron.schedule(this.config.schedule, async () => {
      console.log('Running scheduled performance check...');
      await this.runPerformanceCheck();
    });

    console.log('Performance agent scheduler started successfully');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      console.log('Performance agent scheduler stopped');
    }
  }

  /**
   * Run a performance check immediately
   */
  async runPerformanceCheck(): Promise<void> {
    try {
      console.log('Checking performance against forecast...');

      // Check if yesterday's performance beat the forecast
      const result = await modeClient.checkPerformanceBeatForecast(
        this.config.modeReportToken,
        this.config.modeQueryName
      );

      if (!result.beatForecast || !result.data) {
        console.log('Performance did not beat forecast. No celebration needed.');
        console.log('Performance data:', result.data);
        return;
      }

      console.log(`🎉 Performance beat forecast by ${result.percentDifference?.toFixed(1)}%!`);
      console.log('Performance data:', result.data);

      // Get GIF options
      const gifOptions = await giphyClient.getCelebrationGifOptions(3);

      if (gifOptions.length === 0) {
        console.error('Failed to fetch celebration GIFs');
        return;
      }

      // Send review message to Slack
      await this.sendReviewMessage(result.data, result.percentDifference!, gifOptions);
    } catch (error: any) {
      console.error('Error in scheduled performance check:', error);
    }
  }

  /**
   * Send a review message to Slack with GIF options
   */
  private async sendReviewMessage(
    performanceData: any,
    percentDifference: number,
    gifOptions: any[]
  ): Promise<void> {
    if (!this.slackClient) {
      console.warn('Slack not configured. Would send review message.');
      console.log('Performance data:', performanceData);
      console.log('GIF options:', gifOptions.map(g => g.images.original.url));
      return;
    }

    try {
      const messageBlocks = this.createReviewMessage(performanceData, percentDifference, gifOptions);

      const slackResponse = await this.slackClient.chat.postMessage({
        channel: this.reviewChannel,
        text: `🎉 We beat our forecast! Review the celebration GIF before posting.`,
        blocks: messageBlocks,
      });

      console.log(`Review message sent to ${this.reviewChannel}`);

      // Store the approval data
      const approvalId = slackResponse.ts || Date.now().toString();
      this.pendingApprovals.set(approvalId, {
        gifUrl: gifOptions[0].images.original.url,
        performanceData: {
          metricName: performanceData.metricName,
          actual: performanceData.actualPerformance,
          forecast: performanceData.forecast,
          percentDifference,
          date: performanceData.date,
        },
        timestamp: Date.now(),
      });
    } catch (error: any) {
      console.error('Error sending review message to Slack:', error);
    }
  }

  /**
   * Create the review message blocks for Slack
   */
  private createReviewMessage(
    performanceData: any,
    percentDifference: number,
    gifOptions: any[]
  ): any[] {
    const { metricName, actualPerformance, forecast, date } = performanceData;
    const formattedPercent = percentDifference.toFixed(1);

    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🎉 *We beat our forecast yesterday!*\n\n` +
            `📊 *${metricName}*\n` +
            `📅 Date: ${date}\n` +
            `✅ Actual: ${actualPerformance.toLocaleString()}\n` +
            `🎯 Forecast: ${forecast.toLocaleString()}\n` +
            `📈 Beat forecast by *${formattedPercent}%*`,
        },
      },
      {
        type: 'image',
        image_url: gifOptions[0].images.original.url,
        alt_text: 'Celebration GIF',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '_Preview the GIF above. Approve to post to the celebrations channel._',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '✅ Approve & Post',
            },
            style: 'primary',
            action_id: 'approve_gif',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '❌ Reject',
            },
            style: 'danger',
            action_id: 'reject_gif',
          },
        ],
      },
    ];
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    enabled: boolean;
    schedule: string;
    configured: boolean;
    nextRun?: Date;
  } {
    return {
      enabled: this.config.enabled,
      schedule: this.config.schedule,
      configured: !!(this.config.modeReportToken && this.slackClient),
      nextRun: this.task ? new Date() : undefined, // node-cron doesn't expose next run time easily
    };
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals(): Map<string, any> {
    return this.pendingApprovals;
  }
}

export const performanceScheduler = new PerformanceScheduler();
