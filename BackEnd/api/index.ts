import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index.js';

// Wrap the Express app as a Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
