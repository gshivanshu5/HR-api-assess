// src/config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET || 'hrms_secret_key_123',
  jwtExpiry: process.env.JWT_EXPIRES || '8h',
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  dbFile: process.env.DB_FILE || './data/db.json'
};
