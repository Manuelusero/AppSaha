import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// GET /api/messages/conversation/:otherUserId
// Returns all messages between the authenticated user and another user
router.get('/conversation/:otherUserId', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages sent to this user as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// GET /api/messages/conversations
// Returns the most recent message per conversation for the authenticated user
router.get('/conversations', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    // Get all messages involving the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Deduplicate to one entry per conversation partner
    const seen = new Set<string>();
    const conversations = messages.filter((msg) => {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (seen.has(otherId)) return false;
      seen.add(otherId);
      return true;
    });

    // Attach unread count per conversation
    const withUnread = await Promise.all(
      conversations.map(async (msg) => {
        const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const unreadCount = await prisma.message.count({
          where: { senderId: otherId, receiverId: userId, isRead: false },
        });
        return { ...msg, unreadCount };
      })
    );

    res.json(withUnread);
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
});

// POST /api/messages
// Send a message to another user
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ error: 'receiverId y content son requeridos' });
    }

    // Validate receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'Usuario destinatario no encontrado' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'No puedes enviarte un mensaje a ti mismo' });
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content: content.trim() },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Create in-app notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'NEW_MESSAGE',
        title: 'Nuevo mensaje',
        message: `${message.sender.name} te envió un mensaje`,
        metadata: JSON.stringify({ messageId: message.id, senderId }),
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// GET /api/messages/unread-count
// Returns total unread messages for the authenticated user
router.get('/unread-count', authenticateToken, async (req: any, res) => {
  try {
    const count = await prisma.message.count({
      where: { receiverId: req.user.userId, isRead: false },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes no leídos' });
  }
});

export default router;
