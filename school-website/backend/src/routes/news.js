const express = require('express');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// GET /api/news?limit=&category=
router.get('/', (req, res) => {
  const { limit, category } = req.query;
  let sql = 'SELECT * FROM news WHERE published = 1';
  const params = [];
  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY datetime(created_at) DESC';
  if (limit) {
    sql += ' LIMIT ?';
    params.push(Number(limit));
  }
  res.json(db.prepare(sql).all(...params));
});

// GET /api/news/:slug
router.get('/:slug', (req, res) => {
  const item = db.prepare('SELECT * FROM news WHERE slug = ?').get(req.params.slug);
  if (!item) return res.status(404).json({ error: 'Article not found' });
  res.json(item);
});

// POST /api/news  (admin)
router.post('/', requireAuth, requireRole('admin', 'editor'), (req, res) => {
  const { title, excerpt, body, category = 'News', image = null } = req.body || {};
  if (!title || !excerpt || !body) {
    return res.status(400).json({ error: 'Title, excerpt and body are required' });
  }
  let slug = slugify(title);
  if (db.prepare('SELECT 1 FROM news WHERE slug = ?').get(slug)) slug += '-' + Date.now().toString(36);

  const info = db
    .prepare(
      `INSERT INTO news (title, slug, excerpt, body, category, image, author)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(title, slug, excerpt, body, category, image, req.user.name);

  res.status(201).json(db.prepare('SELECT * FROM news WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/news/:id  (admin)
router.put('/:id', requireAuth, requireRole('admin', 'editor'), (req, res) => {
  const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Article not found' });

  const { title = existing.title, excerpt = existing.excerpt, body = existing.body,
          category = existing.category, image = existing.image } = req.body || {};

  db.prepare(
    'UPDATE news SET title=?, excerpt=?, body=?, category=?, image=? WHERE id=?'
  ).run(title, excerpt, body, category, image, req.params.id);

  res.json(db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id));
});

// DELETE /api/news/:id  (admin)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
