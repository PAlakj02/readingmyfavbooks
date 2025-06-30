const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', verifyToken, async (req, res) => {
  const { title, url, text } = req.body;
  const userId = req.user.id;

  try {
    const response = await axios.post('http://localhost:8080/scrape', {
      title,
      url,
      text
    });

    const summary = response.data.summary;

    const item = await prisma.item.create({
      data: { title, url, summary, userId }
    });

    res.json({ success: true, item });
  } catch (err) {
    console.error('Summarization error:', err.message);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

module.exports = router;
