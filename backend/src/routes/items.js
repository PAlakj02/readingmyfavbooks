const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Get all items (with pagination)
router.get('/', verifyToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const items = await prisma.item.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: { id: true, url: true, title: true, summary: true, createdAt: true } // Optimized payload
    });

    res.json(items);
  } catch (err) {
    console.error('Items fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Add new item
router.post('/', verifyToken, async (req, res) => {
  const { url, title, summary } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: 'URL and title are required' });
  }

  try {
    const item = await prisma.item.create({
      data: {
        url,
        title,
        summary: summary || '', // Handle optional summary
        userId: req.user.id
      }
    });
    res.json(item);
  } catch (err) {
    console.error('Item creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;