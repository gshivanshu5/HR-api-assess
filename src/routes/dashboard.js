// src/routes/dashboard.js
import express from 'express';
import { db } from '../db.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', authMiddleware, authorize(['hr','superadmin']), async (req, res) => {
  await db.read();
  const totalEmployees = (db.data.employees || []).length;
  const totalApplicants = (db.data.applicants || []).length;
  const departmentCount = [...new Set((db.data.employees || []).map(e => e.department).filter(Boolean))].length;
  const activeJobRoles = [...new Set((db.data.applicants || []).map(a => a.appliedRole).filter(Boolean))].length;
  return res.json({ totalEmployees, totalApplicants, departmentCount, activeJobRoles });
});

export default router;
