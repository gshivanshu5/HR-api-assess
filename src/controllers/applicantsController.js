// src/controllers/applicantsController.js
import { db } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🟢 GET /api/applicants
 * List all applicants
 */
export const listApplicants = async (req, res) => {
  await db.read();
  const applicants = db.data.applicants || [];
  res.json(applicants);
};

/**
 * 🟢 GET /api/applicants/:id
 * Get a single applicant by ID
 */
export const getApplicant = async (req, res) => {
  const { id } = req.params;
  await db.read();
  const applicant = db.data.applicants.find(a => a.id === id);
  if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
  res.json(applicant);
};

/**
 * 🟢 POST /api/applicants
 * Create a new applicant
 */
export const createApplicant = async (req, res) => {
  const { name, email, appliedRole, experience, contact, resume, status } = req.body;

  if (!name || !email || !appliedRole) {
    return res.status(400).json({ message: 'Name, email, and appliedRole are required' });
  }

  await db.read();

  const newApplicant = {
    id: uuidv4(),
    name,
    email,
    appliedRole,
    experience: experience || '0 years',
    contact: contact || '',
    resume: resume || '',
    status: status || 'New',
    createdAt: new Date().toISOString()
  };

  db.data.applicants.push(newApplicant);
  await db.write();

  res.status(201).json(newApplicant);
};

/**
 * 🟢 PUT /api/applicants/:id
 * Update applicant info or status
 */
export const updateApplicant = async (req, res) => {
  const { id } = req.params;
  const { name, email, appliedRole, experience, contact, resume, status } = req.body;

  await db.read();
  const applicant = db.data.applicants.find(a => a.id === id);

  if (!applicant) {
    return res.status(404).json({ message: 'Applicant not found' });
  }

  Object.assign(applicant, {
    name: name ?? applicant.name,
    email: email ?? applicant.email,
    appliedRole: appliedRole ?? applicant.appliedRole,
    experience: experience ?? applicant.experience,
    contact: contact ?? applicant.contact,
    resume: resume ?? applicant.resume,
    status: status ?? applicant.status
  });

  await db.write();
  res.json({ message: 'Applicant updated successfully', applicant });
};

/**
 * 🟢 DELETE /api/applicants/:id
 * Remove an applicant (Super Admin only)
 */
export const deleteApplicant = async (req, res) => {
  const { id } = req.params;

  await db.read();
  const before = db.data.applicants.length;
  db.data.applicants = db.data.applicants.filter(a => a.id !== id);
  await db.write();

  if (db.data.applicants.length === before) {
    return res.status(404).json({ message: 'Applicant not found' });
  }

  res.json({ message: 'Applicant deleted successfully' });
};
