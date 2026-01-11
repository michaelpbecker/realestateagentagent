import express from 'express';
import { modeClient } from '../mode.js';
import { giphyClient } from '../giphy.js';
import { WebClient } from '@slack/web-api';

export const performanceRouter = express.Router();

// Store pending approvals (in production, use Redis or database)
const pendingApprovals = new Map<string, {
  gifUrl: string;
  performanceData: any;
  timestamp: number;
}>();

// Initialize Slack client for sending messages
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const reviewChannel = process.env.SLACK_REVIEW_CHANNEL || process.env.SLACK_CHANNEL || '#celebrations-review';
const celebrationChannel = process.env.SLACK_CHANNEL || '#celebrations';

/**
 * POST /api/performance/check
 * Manually trigger a performance check
 */
performanceRouter.post('/check', async (req, res) => {
  try {
    const { reportToken, queryName } = req.body;

    if (!reportToken) {
      return res.status(400).json({ error: 'reportToken is required' });
    }

    console.log('Checking performance for report:', reportToken);

    // Check if yesterday's performance beat the forecast
    const result = await modeClient.checkPerformanceBeatForecast(reportToken, queryName);

    if (!result.beatForecast || !result.data) {
      return res.json({
        beatForecast: false,
        message: 'Performance did not beat forecast',
        data: result.data,
      });
    }

    console.log('Performance beat forecast! Getting celebration GIFs...');

    // Get GIF options for review
    const gifOptions = await giphyClient.getCelebrationGifOptions(3);

    if (gifOptions.length === 0) {
      return res.status(500).json({ error: 'Failed to fetch GIFs' });
    }

    // Send interactive message to Slack for review
    const messageBlocks = createReviewMessage(result.data!, result.percentDifference!, gifOptions);

    if (!process.env.SLACK_BOT_TOKEN) {
      console.warn('Slack not configured. Would send review message.');
      return res.json({
        beatForecast: true,
        message: 'Slack not configured. Preview mode.',
        data: result.data,
        percentDifference: result.percentDifference,
        gifOptions: gifOptions.map(g => g.images.original.url),
      });
    }

    // Send message to review channel
    const slackResponse = await slackClient.chat.postMessage({
      channel: reviewChannel,
      text: `🎉 We beat our forecast! Review the celebration GIF before posting.`,
      blocks: messageBlocks,
    });

    // Store the approval data
    const approvalId = slackResponse.ts || Date.now().toString();
    pendingApprovals.set(approvalId, {
      gifUrl: gifOptions[0].images.original.url,
      performanceData: {
        metricName: result.data.metricName,
        actual: result.data.actualPerformance,
        forecast: result.data.forecast,
        percentDifference: result.percentDifference!,
        date: result.data.date,
      },
      timestamp: Date.now(),
    });

    res.json({
      beatForecast: true,
      message: 'Review message sent to Slack',
      data: result.data,
      percentDifference: result.percentDifference,
      slackMessageId: approvalId,
    });
  } catch (error: any) {
    console.error('Error in performance check:', error);
    res.status(500).json({ error: error.message || 'Failed to check performance' });
  }
});

/**
 * POST /api/performance/slack-interaction
 * Handle Slack interactive button clicks
 */
performanceRouter.post('/slack-interaction', async (req, res) => {
  try {
    // Slack sends the payload as form-encoded
    const payload = JSON.parse(req.body.payload || '{}');
    const action = payload.actions?.[0];
    const messageTs = payload.message?.ts;

    if (!action || !messageTs) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const approval = pendingApprovals.get(messageTs);
    if (!approval) {
      return res.status(404).json({ error: 'Approval not found or expired' });
    }

    if (action.action_id === 'approve_gif') {
      // Post the celebration to the main channel
      await slackClient.chat.postMessage({
        channel: celebrationChannel,
        text: formatCelebrationMessage(approval.performanceData),
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: formatCelebrationMessage(approval.performanceData),
            },
          },
          {
            type: 'image',
            image_url: approval.gifUrl,
            alt_text: 'Celebration GIF',
          },
        ],
      });

      // Update the review message
      await slackClient.chat.update({
        channel: payload.channel.id,
        ts: messageTs,
        text: '✅ Celebration posted!',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `✅ *Approved and posted to ${celebrationChannel}*`,
            },
          },
        ],
      });

      pendingApprovals.delete(messageTs);

      return res.json({ ok: true });
    } else if (action.action_id === 'reject_gif') {
      // Update the review message
      await slackClient.chat.update({
        channel: payload.channel.id,
        ts: messageTs,
        text: '❌ Celebration rejected',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '❌ *Rejected* - No celebration posted.',
            },
          },
        ],
      });

      pendingApprovals.delete(messageTs);

      return res.json({ ok: true });
    } else if (action.action_id.startsWith('select_gif_')) {
      // User selected a different GIF option
      const gifIndex = parseInt(action.action_id.split('_')[2]);
      const gifOptions = await giphyClient.getCelebrationGifOptions(3);

      if (gifOptions[gifIndex]) {
        approval.gifUrl = gifOptions[gifIndex].images.original.url;
        pendingApprovals.set(messageTs, approval);

        // Update message with new GIF
        const updatedBlocks = createReviewMessage(
          {
            metricName: approval.performanceData.metricName,
            actualPerformance: approval.performanceData.actual,
            forecast: approval.performanceData.forecast,
            date: approval.performanceData.date,
          },
          approval.performanceData.percentDifference,
          gifOptions,
          gifIndex
        );

        await slackClient.chat.update({
          channel: payload.channel.id,
          ts: messageTs,
          text: 'GIF updated! Review and approve.',
          blocks: updatedBlocks,
        });
      }

      return res.json({ ok: true });
    }

    res.status(400).json({ error: 'Unknown action' });
  } catch (error: any) {
    console.error('Error handling Slack interaction:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/performance/status
 * Get the current status and configuration
 */
performanceRouter.get('/status', async (req, res) => {
  res.json({
    configured: {
      mode: !!(process.env.MODE_API_TOKEN && process.env.MODE_API_SECRET),
      slack: !!process.env.SLACK_BOT_TOKEN,
      giphy: !!process.env.GIPHY_API_KEY,
    },
    channels: {
      review: reviewChannel,
      celebration: celebrationChannel,
    },
    pendingApprovals: pendingApprovals.size,
  });
});

/**
 * Helper function to create the review message blocks
 */
function createReviewMessage(
  performanceData: {
    metricName: string;
    actualPerformance: number;
    forecast: number;
    date: string;
  },
  percentDifference: number,
  gifOptions: any[],
  selectedIndex: number = 0
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
      image_url: gifOptions[selectedIndex]?.images.original.url || gifOptions[0].images.original.url,
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
 * Helper function to format the celebration message
 */
function formatCelebrationMessage(performanceData: {
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

// Cleanup old pending approvals (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [id, approval] of pendingApprovals.entries()) {
    if (now - approval.timestamp > maxAge) {
      pendingApprovals.delete(id);
      console.log(`Cleaned up expired approval: ${id}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour
