// src/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db.js';
import config from '../config.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// POST /api/auth/register  (optional — protect if needed)
router.post('/register',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['superadmin','hr','user']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    await db.read();
    const { name, email, password, role = 'user' } = req.body;
    const exists = db.data.users.find(u => u.email === email);
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: `user_${Date.now()}`, name, email, password: hashed, role };
    db.data.users.push(newUser);
    await db.write();
    const token = jwt.sign({ id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email }, config.jwtSecret, { expiresIn: config.jwtExpiry });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiry });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
);

export default router;
