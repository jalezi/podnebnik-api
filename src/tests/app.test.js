import supertest from 'supertest';
import app from '../app';

let server = null;
beforeAll(() => {
  server = supertest(app);
});

describe('HOME', () => {
  describe('HEALTHCHECK', () => {
    it('should return 200. GET /healthcheck', async () => {
      const res = await server.get('/healthcheck');
      expect(res.status).toBe(200);
    });
  });
});

describe('API', () => {
  describe('CREATED', () => {
    it('should return 200. GET /created', async () => {
      const res = await server.get('/api/created');
      expect(res.status).toBe(200);
    });
  });

  describe('HISTORICAL', () => {
    it('should return 200. GET /historical', async () => {
      const res = await server.get('/api/historical');
      expect(res.status).toBe(200);
    });
  });

  describe('PROJECTIONS', () => {
    it('should return 200. GET /projections', async () => {
      const res = await server.get('/api/projections');
      expect(res.status).toBe(200);
    });
  });
  describe('EMISSIONS_CO2_EQUIV', () => {
    it('should return 200. GET /projections', async () => {
      const res = await server.get('/api/emissions_CO2_equiv');
      expect(res.status).toBe(200);
    });
  });
});
