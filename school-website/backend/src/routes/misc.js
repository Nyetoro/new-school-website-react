/**
 * Routes for staff, students, events, gallery, contact messages and dashboard stats.
 */
const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const admin = [requireAuth, requireRole('admin')];

/* ---------------------------- STAFF ---------------------------- */
router.get('/staff', (req, res) => {
  const { department } = req.query;
  const sql = department && department !== 'All'
    ? 'SELECT * FROM staff WHERE department = ? ORDER BY id'
    : 'SELECT * FROM staff ORDER BY id';
  res.json(department && department !== 'All' ? db.prepare(sql).all(department) : db.prepare(sql).all());
});

router.post('/staff', ...admin, (req, res) => {
  const { name, role, department, bio = '', photo = null, email = '' } = req.body || {};
  if (!name || !role || !department) {
    return res.status(400).json({ error: 'Name, role and department are required' });
  }
  const info = db.prepare(
    'INSERT INTO staff (name, role, department, bio, photo, email) VALUES (?,?,?,?,?,?)'
  ).run(name, role, department, bio, photo, email);
  res.status(201).json(db.prepare('SELECT * FROM staff WHERE id = ?').get(info.lastInsertRowid));
});

router.delete('/staff/:id', ...admin, (req, res) => {
  db.prepare('DELETE FROM staff WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* --------------------------- STUDENTS -------------------------- */
router.get('/students', ...admin, (req, res) => {
  const { search = '', class_level } = req.query;
  let sql = 'SELECT * FROM students WHERE (first_name LIKE ? OR last_name LIKE ? OR admission_no LIKE ?)';
  const like = `%${search}%`;
  const params = [like, like, like];
  if (class_level && class_level !== 'All') {
    sql += ' AND class_level = ?';
    params.push(class_level);
  }
  sql += ' ORDER BY last_name, first_name';
  res.json(db.prepare(sql).all(...params));
});

router.post('/students', ...admin, (req, res) => {
  const { admission_no, first_name, last_name, class_level, gender,
          guardian_name = '', guardian_phone = '' } = req.body || {};
  if (!admission_no || !first_name || !last_name || !class_level || !gender) {
    return res.status(400).json({ error: 'Admission number, name, class and gender are required' });
  }
  if (db.prepare('SELECT 1 FROM students WHERE admission_no = ?').get(admission_no)) {
    return res.status(409).json({ error: 'That admission number already exists' });
  }
  const info = db.prepare(
    `INSERT INTO students (admission_no, first_name, last_name, class_level, gender, guardian_name, guardian_phone)
     VALUES (?,?,?,?,?,?,?)`
  ).run(admission_no, first_name, last_name, class_level, gender, guardian_name, guardian_phone);
  res.status(201).json(db.prepare('SELECT * FROM students WHERE id = ?').get(info.lastInsertRowid));
});

router.delete('/students/:id', ...admin, (req, res) => {
  db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------------------------- EVENTS --------------------------- */
router.get('/events', (req, res) => {
  const { upcoming } = req.query;
  const sql = upcoming
    ? "SELECT * FROM events WHERE date(starts_at) >= date('now') ORDER BY datetime(starts_at) ASC"
    : 'SELECT * FROM events ORDER BY datetime(starts_at) ASC';
  res.json(db.prepare(sql).all());
});

router.post('/events', ...admin, (req, res) => {
  const { title, description, location, starts_at } = req.body || {};
  if (!title || !description || !location || !starts_at) {
    return res.status(400).json({ error: 'All event fields are required' });
  }
  const info = db.prepare(
    'INSERT INTO events (title, description, location, starts_at) VALUES (?,?,?,?)'
  ).run(title, description, location, starts_at);
  res.status(201).json(db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid));
});

router.delete('/events/:id', ...admin, (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------------------------- GALLERY -------------------------- */
router.get('/gallery', (req, res) => {
  res.json(db.prepare('SELECT * FROM gallery ORDER BY id DESC').all());
});

router.post('/gallery', ...admin, (req, res) => {
  const { caption, category = 'Campus', image } = req.body || {};
  if (!caption || !image) return res.status(400).json({ error: 'Caption and image are required' });
  const info = db.prepare(
    'INSERT INTO gallery (caption, category, image) VALUES (?,?,?)'
  ).run(caption, category, image);
  res.status(201).json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(info.lastInsertRowid));
});

router.delete('/gallery/:id', ...admin, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* --------------------------- MESSAGES -------------------------- */
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/messages', contactLimiter, (req, res) => {
  const { name, email, subject, body } = req.body || {};
  if (!name || !email || !subject || !body) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  db.prepare('INSERT INTO messages (name, email, subject, body) VALUES (?,?,?,?)')
    .run(name, email, subject, body);
  res.status(201).json({ ok: true, message: 'Thank you! Your message has been sent.' });
});

router.get('/messages', ...admin, (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY datetime(created_at) DESC').all());
});

router.patch('/messages/:id', ...admin, (req, res) => {
  db.prepare('UPDATE messages SET handled = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.delete('/messages/:id', ...admin, (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ----------------------------- STATS --------------------------- */
router.get('/stats', ...admin, (req, res) => {
  const one = (sql) => db.prepare(sql).get().c;
  res.json({
    students: one('SELECT COUNT(*) c FROM students'),
    staff: one('SELECT COUNT(*) c FROM staff'),
    news: one('SELECT COUNT(*) c FROM news'),
    events: one("SELECT COUNT(*) c FROM events WHERE date(starts_at) >= date('now')"),
    pendingAdmissions: one("SELECT COUNT(*) c FROM admissions WHERE status = 'pending'"),
    unreadMessages: one('SELECT COUNT(*) c FROM messages WHERE handled = 0'),
    byClass: db.prepare(
      'SELECT class_level AS label, COUNT(*) AS value FROM students GROUP BY class_level ORDER BY class_level'
    ).all(),
  });
});

module.exports = router;
