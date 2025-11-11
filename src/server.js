// src/server.js
import express from 'express';
import cors from 'cors';
import { initSuperAdmin } from './db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employees.js';
import applicantRoutes from './routes/applicants.js';
import dashboardRoutes from './routes/dashboard.js';
import config from './config.js';

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => res.send('HRMS backend is running'));

await initSuperAdmin(); // will create superadmin if missing

app.listen(config.port, () => {
  console.log(`🚀 HRMS backend running on http://localhost:${config.port}`);
});
