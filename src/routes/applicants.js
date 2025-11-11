// src/routes/applicants.js
import express from 'express';
import { listApplicants, getApplicant, createApplicant, updateApplicant, deleteApplicant } from '../controllers/applicantsController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, authorize(['superadmin','hr']), listApplicants);
router.get('/:id', authMiddleware, authorize(['superadmin','hr']), getApplicant);
router.post('/', authMiddleware, authorize(['superadmin','hr']), createApplicant);
router.put('/:id', authMiddleware, authorize(['superadmin','hr']), updateApplicant);
router.delete('/:id', authMiddleware, authorize(['superadmin']), deleteApplicant);

export default router;
