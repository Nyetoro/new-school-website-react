const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Stop spam/bot submissions on the public form
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions. Please try again later.' },
});

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));

// POST /api/admissions  (public application form)
router.post('/', formLimiter, (req, res) => {
  const {
    student_name, date_of_birth, gender, class_applying,
    parent_name, email, phone, address = '', previous_school = '', message = '',
  } = req.body || {};

  const required = { student_name, date_of_birth, gender, class_applying, parent_name, email, phone };
  const missing = Object.keys(required).filter((k) => !required[k]);
  if (missing.length) {
    return res.status(400).json({ error: `Please fill in: ${missing.join(', ')}` });
  }
  if (!isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email address' });

  const info = db
    .prepare(
      `INSERT INTO admissions
       (student_name, date_of_birth, gender, class_applying, parent_name, email, phone, address, previous_school, message)
       VALUES (?,?,?,?,?,?,?,?,?,?)`
    )
    .run(student_name, date_of_birth, gender, class_applying, parent_name, email, phone, address, previous_school, message);

  res.status(201).json({
    ok: true,
    reference: 'ADM-' + String(info.lastInsertRowid).padStart(5, '0'),
    message: 'Application received. Our admissions office will contact you within 3 working days.',
  });
});

// GET /api/admissions  (admin)
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  res.json(db.prepare('SELECT * FROM admissions ORDER BY datetime(created_at) DESC').all());
});

// PATCH /api/admissions/:id  (admin — approve / reject)
router.patch('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const { status } = req.body || {};
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be pending, approved or rejected' });
  }
  db.prepare('UPDATE admissions SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json(db.prepare('SELECT * FROM admissions WHERE id = ?').get(req.params.id));
});

// DELETE /api/admissions/:id  (admin)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.prepare('DELETE FROM admissions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
