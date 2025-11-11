const { body } = require('express-validator');

const registerValidator = [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['superadmin', 'hr'])
];

const loginValidator = [
  body('email').isEmail(),
  body('password').isString().notEmpty()
];

const employeeCreateValidator = [
  body('name').isString().notEmpty(),
  body('role').isString().notEmpty(),
  body('department').isString().notEmpty(),
  body('joiningDate').optional().isISO8601(),
  body('status').optional().isIn(['active','inactive','onleave'])
];

const applicantCreateValidator = [
  body('name').isString().notEmpty(),
  body('appliedRole').isString().notEmpty(),
  body('experience').optional().isNumeric(),
  body('contact').optional().isString(),
  body('status').optional().isIn(['new','shortlisted','rejected','interview'])
];

module.exports = {
  registerValidator,
  loginValidator,
  employeeCreateValidator,
  applicantCreateValidator
};
