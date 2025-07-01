const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Get user profile by ID (string-based)
router.get('/:id', async (req, res) => {
  const userId = req.params.id; // ✅ Keep as string

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        // Add other public fields as needed (e.g., bio, createdAt)
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get public items of a specific user (string-based ID)
router.get('/:id/items', async (req, res) => {
  const userId = req.params.id; // ✅ Keep as string

  try {
    const items = await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        title: true,
        summary: true,
        createdAt: true,
      },
    });

    res.json(items);
  } catch (err) {
    console.error('Error fetching user items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
