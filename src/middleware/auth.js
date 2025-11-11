// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import config from '../config.js';

const JWT_SECRET = config.jwtSecret;

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verify error:', err.message);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
}

export const authorize = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};
