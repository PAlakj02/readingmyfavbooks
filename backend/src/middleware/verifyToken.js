// src/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

// Fail fast if JWT_SECRET is missing (critical for production)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable not set!');
}

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message); // Debug aid
    return res.status(403).json({ 
      message: err.name === 'TokenExpiredError' 
        ? 'Token expired' 
        : 'Invalid token' 
    });
  }
};