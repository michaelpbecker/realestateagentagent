import axios from 'axios';

interface ModeConfig {
  apiToken: string;
  apiSecret: string;
  workspace: string;
}

interface ModeQueryResult {
  actualPerformance: number;
  forecast: number;
  date: string;
  metricName: string;
}

export class ModeClient {
  private config: ModeConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiToken: process.env.MODE_API_TOKEN || '',
      apiSecret: process.env.MODE_API_SECRET || '',
      workspace: process.env.MODE_WORKSPACE || '',
    };
    this.baseUrl = 'https://app.mode.com/api';
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.apiToken}:${this.config.apiSecret}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  /**
   * Fetch yesterday's performance data from a Mode report
   * @param reportToken - The Mode report token (found in the report URL)
   * @param queryName - The name of the query within the report
   * @returns Performance data comparing actual vs forecast
   */
  async getYesterdayPerformance(
    reportToken: string,
    queryName?: string
  ): Promise<ModeQueryResult | null> {
    try {
      if (!this.config.apiToken || !this.config.apiSecret) {
        console.warn('Mode API credentials not configured, using mock data');
        return this.getMockData();
      }

      // Get the latest run of the report
      const runsResponse = await axios.get(
        `${this.baseUrl}/${this.config.workspace}/reports/${reportToken}/runs`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
          params: {
            order: 'desc',
            limit: 1,
          },
        }
      );

      const latestRun = runsResponse.data._embedded?.report_runs?.[0];
      if (!latestRun) {
        throw new Error('No report runs found');
      }

      const runToken = latestRun.token;

      // Get query results from the latest run
      const resultsResponse = await axios.get(
        `${this.baseUrl}/${this.config.workspace}/reports/${reportToken}/runs/${runToken}/query_runs`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      const queryRuns = resultsResponse.data._embedded?.query_runs || [];

      // Find the specific query or use the first one
      let targetQuery = queryRuns[0];
      if (queryName) {
        targetQuery = queryRuns.find((q: any) => q.query_name === queryName) || queryRuns[0];
      }

      if (!targetQuery) {
        throw new Error('No query results found');
      }

      // Fetch the actual query result data
      const queryResultResponse = await axios.get(
        targetQuery._links.results.href,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      const data = queryResultResponse.data;

      // Assuming the query returns columns: date, actual_performance, forecast
      // You may need to adjust these column names based on your Mode report structure
      const rows = data.content || [];
      const yesterdayRow = rows[0]; // Assuming the most recent row is yesterday

      if (!yesterdayRow) {
        throw new Error('No data found for yesterday');
      }

      return {
        actualPerformance: yesterdayRow.actual_performance || yesterdayRow.actual || 0,
        forecast: yesterdayRow.forecast || 0,
        date: yesterdayRow.date || new Date().toISOString().split('T')[0],
        metricName: yesterdayRow.metric_name || 'Performance',
      };
    } catch (error: any) {
      console.error('Error fetching Mode data:', error.message);
      // Return mock data for development/testing
      return this.getMockData();
    }
  }

  /**
   * Check if yesterday's performance beat the forecast
   * @param reportToken - The Mode report token
   * @param queryName - Optional query name within the report
   * @returns Object with performance data and whether it beat forecast
   */
  async checkPerformanceBeatForecast(
    reportToken: string,
    queryName?: string
  ): Promise<{
    beatForecast: boolean;
    data: ModeQueryResult | null;
    percentDifference?: number;
  }> {
    const data = await this.getYesterdayPerformance(reportToken, queryName);

    if (!data) {
      return { beatForecast: false, data: null };
    }

    const beatForecast = data.actualPerformance > data.forecast;
    const percentDifference = data.forecast > 0
      ? ((data.actualPerformance - data.forecast) / data.forecast) * 100
      : 0;

    return {
      beatForecast,
      data,
      percentDifference,
    };
  }

  /**
   * Mock data for development and testing
   */
  private getMockData(): ModeQueryResult {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Randomly decide if we beat forecast for testing
    const forecast = 1000;
    const beatForecast = Math.random() > 0.5;
    const actual = beatForecast ? forecast * (1 + Math.random() * 0.3) : forecast * (0.7 + Math.random() * 0.3);

    return {
      actualPerformance: Math.round(actual),
      forecast: forecast,
      date: yesterday.toISOString().split('T')[0],
      metricName: 'Daily Revenue',
    };
  }
}

export const modeClient = new ModeClient();
