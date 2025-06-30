const express = require('express');
const router = express.Router();
const axios = require('axios');

// ✅ Route to call Python microservice
router.post('/', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8080/scrape', req.body);
    res.json(response.data);
  } catch (err) {
    console.error('Summarization error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to summarize content' });
  }
});

module.exports = router;
