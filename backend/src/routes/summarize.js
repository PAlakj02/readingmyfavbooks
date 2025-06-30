const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

// Environment variables
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8080";

// POST /api/summarize
router.post("/", verifyToken, async (req, res) => {
  const { title, url, text } = req.body;

  // Validate input
  if (!title || !url || !text) {
    return res.status(400).json({ 
      success: false, 
      error: "Title, URL, and text are required" 
    });
  }

  try {
    // 1. Call Python backend
    const response = await axios.post(`${PYTHON_BACKEND_URL}/scrape`, {
      title,
      url,
      text
    }, {
      timeout: 120000 // 120-second timeout
    });

    const summary = response.data?.summary;
    if (!summary) {
      throw new Error("No summary returned from Python backend");
    }

    // 2. Save to database
    const savedItem = await prisma.item.create({
      data: {
        title: title.substring(0, 255), // Prevent DB overflow
        url,
        summary,
        userId: req.user.id,
      },
      select: { id: true, title: true } // Return only needed fields
    });

    res.json({ 
      success: true, 
      summary,
      item: savedItem 
    });

  } catch (err) {
    console.error("Summarization error:", err.message);
    
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.error || "Summarization failed";

    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

module.exports = router;