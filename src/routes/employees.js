// src/routes/employees.js
import express from 'express';
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeesController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, authorize(['superadmin','hr','user']), listEmployees);
router.get('/:id', authMiddleware, authorize(['superadmin','hr','user']), getEmployee);
router.post('/', authMiddleware, authorize(['superadmin','hr']), createEmployee);
router.put('/:id', authMiddleware, authorize(['superadmin','hr']), updateEmployee);
router.delete('/:id', authMiddleware, authorize(['superadmin']), deleteEmployee);

export default router;
