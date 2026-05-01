import express from 'express';
import prisma from '../db/prisma.js';
import { sendProfileIncompleteReminder } from '../utils/notifications.js';

const router = express.Router();

// Simple secret check — set CRON_SECRET in env vars and Vercel cron config
const verifyCronSecret = (req: any, res: any, next: any) => {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/cron/remind-incomplete
// Called daily by Vercel cron. Sends reminder to providers who:
//  - Verified their email (isEmailVerified: true)
//  - Have an incomplete providerProfile (no location = incomplete)
//  - Registered > 24h ago but < 7 days ago (remind once in that window)
router.get('/remind-incomplete', verifyCronSecret, async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const incompleteProviders = await prisma.user.findMany({
      where: {
        role: 'PROVIDER',
        isEmailVerified: true,
        createdAt: {
          lt: twentyFourHoursAgo,
          gt: sevenDaysAgo,
        },
        providerProfile: {
          location: null  // no completaron hasta el paso 2 donde se pone la ubicación
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://app-saha.vercel.app';
    const results = [];

    for (const user of incompleteProviders) {
      const continueLink = `${FRONTEND_URL}/provider-signup?userId=${user.id}`;
      const result = await sendProfileIncompleteReminder(user.email, user.name.split(' ')[0], continueLink);
      results.push({ email: user.email, ...result });
    }

    console.log(`📧 Recordatorios enviados: ${results.length}`);
    res.json({ success: true, sent: results.length, results });

  } catch (error) {
    console.error('❌ Error en cron remind-incomplete:', error);
    res.status(500).json({ error: 'Error en cron job' });
  }
});

export default router;
