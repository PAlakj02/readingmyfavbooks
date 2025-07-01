const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
const prisma = new PrismaClient();

// 🔁 Get items from people you follow (feed)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get list of user IDs that current user is following
    const followings = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const followingIds = followings.map(f => f.followingId);

    // Step 2: Get items posted by those users
    const items = await prisma.item.findMany({
      where: {
        userId: { in: followingIds }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(items);
  } catch (err) {
    console.error('Feed fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
