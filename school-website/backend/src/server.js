require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const admissionRoutes = require('./routes/admissions');
const miscRoutes = require('./routes/misc');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'school-api', time: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api', miscRoutes);

// Serve the built React app in production (npm run build in /frontend)
const clientDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(clientDist));
app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => (err ? next() : null));
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

if (require.main === module) {
  db.ready.then(() => {
    app.listen(PORT, () => console.log(`✅ School API running on http://localhost:${PORT}`));
  });
}

module.exports = app;
