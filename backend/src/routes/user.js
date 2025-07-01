const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get public items of a specific user
router.get('/:id/items', async (req, res) => {
  const userId = req.params.id;

  try {
    const items = await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        title: true,
        summary: true,
        createdAt: true
      }
    });

    res.json(items);
  } catch (err) {
    console.error('User public profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
