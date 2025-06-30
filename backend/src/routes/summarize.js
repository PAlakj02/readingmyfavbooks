const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

// POST /api/summarize
router.post("/", verifyToken, async (req, res) => {
  const { title, url, text } = req.body;

  if (!title || !url || !text) {
    return res.status(400).json({ success: false, error: "Missing title, url, or text" });
  }

  try {
    // Call Python backend
    const response = await axios.post("http://localhost:8080/scrape", {
      title,
      url,
      text,
    });

    const summary = response.data.summary;

    if (!summary) {
      return res.status(500).json({ success: false, error: "LLM returned no summary." });
    }

    // Save to database
    await prisma.item.create({
      data: {
        title,
        url,
        summary,
        userId: req.user.id,
      },
    });

    return res.json({ success: true, summary });
  } catch (err) {
    console.error("❌ Error in summarize route:", err.message);
    return res.status(500).json({ success: false, error: "Failed to summarize" });
  }
});

module.exports = router;
