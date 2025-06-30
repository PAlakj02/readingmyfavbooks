const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Follow a user
router.post('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params; // ID of user to follow
  const followerId = req.user.id; // From JWT

  try {
    // Prevent self-follow
    if (followerId === userId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    // Check if target user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId: userId,
      },
    });
    if (existingFollow) {
      return res.status(409).json({ error: "Already following this user" });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId: userId,
      },
    });

    res.json({ message: "Followed successfully", follow });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Unfollow a user
router.delete('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params; // ID of user to unfollow
  const followerId = req.user.id; // From JWT

  try {
    const deletedFollow = await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId: userId,
      },
    });

    if (deletedFollow.count === 0) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get user's followers
router.get('/followers', verifyToken, async (req, res) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: req.user.id }, // People who follow YOU
      include: { follower: { select: { id: true, name: true, email: true } } },
    });

    res.json(followers);
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get who the user is following
router.get('/following', verifyToken, async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.user.id }, // People YOU follow
      include: { following: { select: { id: true, name: true, email: true } } },
    });

    res.json(following);
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;