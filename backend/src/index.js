require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// --- Initialize ---
const app = express();
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL + "?connection_limit=10" } }
});

// --- Middleware ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());
app.use(morgan('combined'));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});
app.use(limiter);

// --- Health Check ---
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'OK', 
      services: { database: 'connected' } 
    });
  } catch (err) {
    res.status(500).json({ status: 'DB_ERROR' });
  }
});

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/follow', require('./routes/follow'));
app.use('/api/summarize', require('./routes/summarize'));

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// --- Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// --- Cleanup ---
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});