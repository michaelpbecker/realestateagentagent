# Performance Celebration Agent

An automated agent that checks your Mode Analytics dashboard daily, compares yesterday's performance against forecasts, and posts celebration GIFs to Slack when you beat your targets.

## Features

- **Automated Daily Checks**: Runs on a configurable schedule to check yesterday's performance
- **Mode Analytics Integration**: Fetches performance data directly from your Mode reports
- **Smart GIF Selection**: Automatically selects celebration GIFs using the Giphy API
- **Slack Review Workflow**: Sends GIF preview to a review channel for approval before posting
- **Interactive Approval**: Approve or reject celebrations directly in Slack with buttons
- **Celebration Channel Posting**: Automatically posts approved celebrations to your team channel

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Mode Analytics Configuration
MODE_API_TOKEN=your_mode_api_token
MODE_API_SECRET=your_mode_api_secret
MODE_WORKSPACE=your_workspace_name
MODE_REPORT_TOKEN=your_report_token
MODE_QUERY_NAME=optional_query_name_within_report

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL=#celebrations
SLACK_REVIEW_CHANNEL=#celebrations-review

# Optional: Slack Webhook (alternative to bot token)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Giphy Configuration (optional - uses public beta key by default)
GIPHY_API_KEY=your_giphy_api_key

# Performance Agent Scheduler
PERFORMANCE_AGENT_ENABLED=true
PERFORMANCE_CHECK_SCHEDULE=0 9 * * *  # Cron format: daily at 9 AM
```

### 2. Mode Analytics Setup

1. **Get API Credentials**:
   - Go to Mode Settings → API Tokens
   - Create a new API token and secret
   - Note your workspace name (visible in your Mode URLs)

2. **Get Report Token**:
   - Open your Mode report that contains performance vs forecast data
   - The report token is in the URL: `https://app.mode.com/{workspace}/reports/{report_token}`

3. **Query Structure**:
   Your Mode query should return columns with these names (or similar):
   - `date` - The date of the performance data
   - `actual_performance` or `actual` - The actual performance metric
   - `forecast` - The forecasted performance
   - `metric_name` - (optional) Name of the metric

### 3. Slack Setup

#### Option A: Slack Bot Token (Recommended)

1. **Create a Slack App**:
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name it "Performance Celebration Agent"
   - Select your workspace

2. **Add Bot Permissions**:
   - Go to "OAuth & Permissions"
   - Add these Bot Token Scopes:
     - `chat:write` - Post messages
     - `chat:write.public` - Post to public channels
     - `channels:read` - List channels
     - `files:write` - Upload files (for GIFs)

3. **Install to Workspace**:
   - Click "Install to Workspace"
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)
   - Set it as `SLACK_BOT_TOKEN` in your `.env`

4. **Enable Interactive Components**:
   - Go to "Interactivity & Shortcuts"
   - Enable "Interactivity"
   - Set Request URL to: `https://your-domain.com/api/performance/slack-interaction`
   - Save changes

5. **Invite Bot to Channels**:
   ```
   /invite @Performance Celebration Agent
   ```
   Do this in both your review and celebration channels.

#### Option B: Slack Webhook URL (Simple Alternative)

1. Go to https://api.slack.com/messaging/webhooks
2. Create an Incoming Webhook for your channel
3. Copy the webhook URL to `SLACK_WEBHOOK_URL`

**Note**: Webhooks don't support interactive buttons, so approval workflow won't work.

### 4. Giphy Setup (Optional)

The agent uses Giphy's public beta API key by default. For production:

1. Go to https://developers.giphy.com/
2. Create an app and get your API key
3. Set `GIPHY_API_KEY` in your `.env`

## Usage

### Automatic Mode (Scheduled)

The agent runs automatically based on the `PERFORMANCE_CHECK_SCHEDULE` cron expression:

```bash
# Daily at 9 AM
PERFORMANCE_CHECK_SCHEDULE=0 9 * * *

# Every weekday at 8 AM
PERFORMANCE_CHECK_SCHEDULE=0 8 * * 1-5

# Every hour
PERFORMANCE_CHECK_SCHEDULE=0 * * * *
```

### Manual Trigger

You can manually trigger a performance check via API:

```bash
curl -X POST http://localhost:3000/api/performance/check \
  -H "Content-Type: application/json" \
  -d '{
    "reportToken": "your_report_token",
    "queryName": "optional_query_name"
  }'
```

### Check Status

Get the current configuration and status:

```bash
curl http://localhost:3000/api/performance/status
```

## Workflow

1. **Daily Check**: The agent checks Mode Analytics for yesterday's performance
2. **Compare**: Compares actual performance against forecast
3. **Beat Forecast?**:
   - **No**: Logs the result and does nothing
   - **Yes**: Proceeds to celebration flow
4. **Select GIF**: Fetches celebration GIFs from Giphy
5. **Review Message**: Sends interactive message to review channel with:
   - Performance metrics
   - GIF preview
   - Approve/Reject buttons
6. **Approval**:
   - **Approve**: Posts celebration to the main channel
   - **Reject**: Dismisses the celebration
7. **Celebration**: Team sees the celebration GIF and performance metrics!

## Troubleshooting

### Agent Not Running

Check if enabled:
```bash
# In .env
PERFORMANCE_AGENT_ENABLED=true
```

Check server logs for startup message:
```
Performance agent scheduler started successfully
```

### Slack Messages Not Sending

1. Verify bot token is correct
2. Ensure bot is invited to channels
3. Check channel names match (include `#`)
4. Verify Interactive Components URL is set correctly

### Mode Data Not Fetching

1. Verify API credentials are correct
2. Check report token is valid
3. Ensure query returns the expected column names
4. Check Mode API rate limits

### GIFs Not Loading

1. Try using a custom Giphy API key
2. Check network/firewall settings
3. Verify GIF URLs are accessible

## Development

### Testing Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up `.env` file

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Trigger manual check:
   ```bash
   curl -X POST http://localhost:3000/api/performance/check \
     -H "Content-Type: application/json" \
     -d '{"reportToken": "your_token"}'
   ```

### Mock Data

If Mode Analytics credentials aren't configured, the agent uses mock data for testing.

## Architecture

```
┌─────────────────────┐
│   Scheduler (cron)  │
│   Daily at 9 AM     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Mode API Client   │
│   Fetch Performance │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Compare vs         │
│  Forecast           │
└──────────┬──────────┘
           │
           │ Beat forecast?
           ▼
┌─────────────────────┐
│  Giphy API Client   │
│  Get Celebration    │
│  GIFs               │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Slack Client       │
│  Send Review Msg    │
└──────────┬──────────┘
           │
           │ User approves?
           ▼
┌─────────────────────┐
│  Slack Client       │
│  Post Celebration   │
└─────────────────────┘
```

## Files

- `/server/mode.ts` - Mode Analytics API client
- `/server/slack.ts` - Slack API client
- `/server/giphy.ts` - Giphy API client
- `/server/scheduler.ts` - Cron scheduler
- `/server/api/performance.ts` - API endpoints
- `/server/index.ts` - Server initialization

## Support

For issues or questions:
1. Check server logs
2. Verify all environment variables are set
3. Test each integration separately
4. Review Slack app configuration

## License

Part of the Real Estate Agent Agent project.
