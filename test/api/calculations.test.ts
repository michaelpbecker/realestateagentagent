import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { calculationsRouter } from '../../server/api/calculations';

// Mock the OpenAI module
vi.mock('../../server/openai', () => ({
  handleChatMessage: vi.fn().mockImplementation(async (message: string) => {
    return 'Mocked response for: ' + message;
  })
}));

describe('Calculations API', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/calculations', calculationsRouter);
  });

  describe('POST /api/calculations/monthly-payment', () => {
    it('should calculate monthly payments correctly', async () => {
      const response = await request(app)
        .post('/api/calculations/monthly-payment')
        .send({
          homePrice: 500000,
          downPayment: 100000,
          interestRate: 5,
          loanTerm: 30
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('monthlyPayment');
      expect(typeof response.body.monthlyPayment).toBe('number');
    });

    it('should validate monthly payment calculation inputs', async () => {
      const response = await request(app)
        .post('/api/calculations/monthly-payment')
        .send({
          homePrice: -500000,
          downPayment: 100000,
          interestRate: 5,
          loanTerm: 30
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing monthly payment calculation inputs', async () => {
      const response = await request(app)
        .post('/api/calculations/monthly-payment')
        .send({
          homePrice: 500000
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/calculations/down-payment', () => {
    it('should calculate down payment correctly', async () => {
      const response = await request(app)
        .post('/api/calculations/down-payment')
        .send({
          homePrice: 500000,
          percentage: 20
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('downPayment');
      expect(typeof response.body.downPayment).toBe('number');
    });

    it('should validate down payment calculation inputs', async () => {
      const response = await request(app)
        .post('/api/calculations/down-payment')
        .send({
          homePrice: -500000,
          percentage: 20
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing down payment calculation inputs', async () => {
      const response = await request(app)
        .post('/api/calculations/down-payment')
        .send({
          homePrice: 500000
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});