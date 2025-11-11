const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { nanoid } = require('nanoid');
const { jwtSecret, jwtExpiry } = require('../config');
const { validationResult } = require('express-validator');

const saltRounds = 10;

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  await db.read();
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, saltRounds);
  const user = { id: nanoid(), name, email, password: hashed, role };
  db.data.users.push(user);
  await db.write();

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiry });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiry });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

module.exports = { register, login };
