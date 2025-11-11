// src/db.js
import { JSONFilePreset } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import config from './config.js';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
const file = join(__dirname, '..', config.dbFile.replace(/^.\//, ''));

// ensure data dir exists
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// ensure file exists
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({ users: [], employees: [], applicants: [] }, null, 2), 'utf-8');
}

// create preset db with defaults
export const db = await JSONFilePreset(file, {
  users: [],
  employees: [],
  applicants: []
});

// initializes superadmin if not exists
export async function initSuperAdmin() {
  await db.read();
  const exists = db.data.users.find(u => u.role === 'superadmin' || u.email === 'admin@example.com');
  if (!exists) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    const user = {
      id: 'user_super_1',
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashed,
      role: 'superadmin'
    };
    db.data.users.push(user);
    await db.write();
    console.log('✅ Created default superadmin: admin@example.com / Admin@123');
  } else {
    console.log('ℹ️ Superadmin already exists.');
  }
}
