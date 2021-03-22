import supertest from 'supertest';
import app from '../app';

let server = null;
beforeAll(() => {
  server = supertest(app);
});

describe('HOME', () => {
  describe('HEALTHCHECK', () => {
    it('should return 200. GET /healthcheck', async () => {
      await server
        .get('/healthcheck')
        .expect(200)
        .then(response => {
          expect(response.body.message).toBe('OK');
        });
    });
  });
});
