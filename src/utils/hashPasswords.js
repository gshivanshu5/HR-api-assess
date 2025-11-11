// src/utils/hashPasswords.js
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', '..', 'data', 'db.json');

async function run() {
  const raw = fs.readFileSync(file, 'utf-8');
  const json = JSON.parse(raw);
  if (!json.users) json.users = [];
  for (let u of json.users) {
    if (u.password && !u.password.startsWith('$2b$')) {
      u.password = await bcrypt.hash(u.password, 10);
      console.log(`Hashed password for ${u.email}`);
    } else {
      console.log(`Already hashed (or empty) for ${u.email}`);
    }
  }
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.log('Done hashing.');
}

run().catch(err => console.error(err));
