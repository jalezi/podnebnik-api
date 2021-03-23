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
