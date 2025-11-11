// src/controllers/employeesController.js
import { db } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export async function listEmployees(req, res) {
  await db.read();
  const { q, department, position } = req.query;
  let list = db.data.employees || [];
  if (department) list = list.filter(e => e.department === department);
  if (position) list = list.filter(e => e.position === position);
  if (q) list = list.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  return res.json(list);
}

export async function getEmployee(req, res) {
  await db.read();
  const emp = db.data.employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  return res.json(emp);
}

export async function createEmployee(req, res) {
  const { name, email, position, department, salary, joiningDate, status } = req.body;
  if (!name || !email || !position) return res.status(400).json({ message: 'Name, email, and position are required' });

  await db.read();
  const newEmp = {
    id: uuidv4(),
    name,
    email,
    position,
    department: department || 'Unassigned',
    salary: salary || 0,
    joiningDate: joiningDate || new Date().toISOString(),
    status: status || 'active',
    createdAt: new Date().toISOString()
  };
  db.data.employees.push(newEmp);
  await db.write();
  return res.status(201).json(newEmp);
}

export async function updateEmployee(req, res) {
  const updates = req.body;
  await db.read();
  const idx = db.data.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
  db.data.employees[idx] = { ...db.data.employees[idx], ...updates, updatedAt: new Date().toISOString() };
  await db.write();
  return res.json(db.data.employees[idx]);
}

export async function deleteEmployee(req, res) {
  await db.read();
  const idx = db.data.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
  const removed = db.data.employees.splice(idx, 1);
  await db.write();
  return res.json({ removed: removed[0] });
}
