
import request from 'supertest';

const app = 'http://localhost:3000';

test('should reject TLS versions below 1.2', async () => {
  const req = request(app).get('/health');
  req.set('TLS-Version', '1.1');
  await req.expect(403);
});