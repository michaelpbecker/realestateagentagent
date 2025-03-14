import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';

describe('API Endpoints', () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('POST /api/calculations', () => {
    it('saves a valid calculation', async () => {
      const calculation = {
        purchasePrice: 500000,
        downPaymentPercent: 20,
        hoa: 200,
        taxes: 6000,
        interestRate: 6.5,
        insurance: 150,
        renovationBudget: 50000,
        monthlyNetIncome: 10000
      };

      const response = await supertest(app)
        .post('/api/calculations')
        .send(calculation);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.purchasePrice).toBe(calculation.purchasePrice);
    });

    it('rejects invalid calculation data', async () => {
      const invalidCalculation = {
        purchasePrice: -500000, // Invalid negative price
        downPaymentPercent: 150, // Invalid percentage > 100
      };

      const response = await supertest(app)
        .post('/api/calculations')
        .send(invalidCalculation);

      expect(response.status).toBe(400);
    });
  });
});