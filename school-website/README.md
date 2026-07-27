# Bright Future International College — Full-Stack School Website

A complete, production-ready school website: a **React 19 + Vite + Tailwind CSS 4** frontend and an
**Express 5 + SQLite** REST API with JWT authentication and a full admin dashboard.

Everything here has been built and tested end to end — the forms really save to a database, and the
admin panel really manages that data.

---

## Quick start (2 terminals)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit JWT_SECRET
npm run seed             # creates the database + demo content
npm run dev              # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Open **http://localhost:5173**.

### Admin login
| | |
|---|---|
| URL | http://localhost:5173/login |
| Email | `admin@brightfuture.edu.ng` |
| Password | `admin123` |

> Change these in `backend/.env` and re-run `npm run seed` before going live.

---

## What's included

### Public website (8 pages)
| Page | Route | Highlights |
|---|---|---|
| Home | `/` | Hero, stats, features, latest news, event calendar, CTA |
| About | `/about` | Story, mission/vision, values, history timeline, principal's message |
| Academics | `/academics` | Tabbed JSS/SSS curriculum, streams, results bars, term calendar |
| Admissions | `/admissions` | 5-step process, requirements, fees, **live application form**, FAQ accordion |
| Our Staff | `/staff` | Staff directory with department filtering (from the API) |
| News & Events | `/news`, `/news/:slug` | Category filter, article pages, upcoming events sidebar |
| Gallery | `/gallery` | Category filter + keyboard-accessible lightbox |
| Contact | `/contact` | **Working contact form**, map, directions |

### Admin dashboard (`/admin`)
- **Overview** — six live stat cards and an enrolment-by-class bar chart
- **Applications** — review admission applications, approve/reject/delete, filter by status
- **News** — publish and delete articles (auto-generated slugs)
- **Events** — add and remove calendar events
- **Students** — searchable, class-filterable register with add/remove
- **Staff** — add and remove staff members
- **Messages** — read contact enquiries, reply by email, mark handled

---

## API reference

Base URL `http://localhost:5000/api` · Protected routes need `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | — | Service check |
| POST | `/auth/login` | — | Sign in, returns JWT |
| GET | `/auth/me` | ✔ | Current user |
| GET | `/news` `?limit=&category=` | — | List articles |
| GET | `/news/:slug` | — | Single article |
| POST/PUT/DELETE | `/news`, `/news/:id` | ✔ | Manage articles |
| POST | `/admissions` | — | Submit an application (rate-limited) |
| GET/PATCH/DELETE | `/admissions` | ✔ | Manage applications |
| GET | `/staff` `?department=` | — | Staff directory |
| GET | `/events` `?upcoming=1` | — | Events |
| GET | `/gallery` | — | Gallery items |
| POST | `/messages` | — | Contact form (rate-limited) |
| GET | `/students` `?search=&class_level=` | ✔ | Student register |
| GET | `/stats` | ✔ | Dashboard statistics |

---

## Project structure

```
school-website/
├── backend/
│   ├── src/
│   │   ├── server.js          Express app + static SPA serving
│   │   ├── db.js              SQLite connection + 8-table schema
│   │   ├── seed.js            Demo data seeder
│   │   ├── middleware/auth.js JWT verification + role guards
│   │   └── routes/            auth, news, admissions, misc
│   ├── data/school.db         Created by the seeder
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx            Routes
    │   ├── api.js             Fetch wrapper
    │   ├── config.js          ← school name, address, phone (edit to rebrand)
    │   ├── context/           Auth provider
    │   ├── components/        Layout, crest, shared UI
    │   └── pages/             All 10 pages
    └── public/images/
```

---

## Making it your own

1. **Name, address, phone** → `frontend/src/config.js`
2. **Colours** → the `@theme` block in `frontend/src/index.css` (navy + gold)
3. **Photos** → drop your own into `frontend/public/images/` using the same filenames
4. **Content** → homepage stats/features are arrays at the top of each page file
5. **Logo** → the `Crest` component in `frontend/src/components/Layout.jsx`

---

## Security before you deploy

- [ ] Set a long random `JWT_SECRET` in `.env`
- [ ] Change the admin password
- [ ] Serve over HTTPS
- [ ] Set `CLIENT_URL` to your real domain to lock down CORS
- [ ] Consider PostgreSQL for higher traffic (see below)

## Deploying

**Single server (simplest)**
```bash
cd frontend && npm run build     # outputs frontend/dist
cd ../backend && npm start       # Express serves the API *and* the built site on :5000
```
Point Nginx or Caddy at port 5000. Render, Railway and Fly.io all work with no changes.

**Split hosting** — deploy `frontend/dist` to Vercel/Netlify and the backend separately, then set
`VITE_API_URL` to your API domain at build time.

**Moving to PostgreSQL** — the SQL is standard. Replace `backend/src/db.js` with a `pg` or Prisma
client and adjust `datetime('now')` to `NOW()`. Route files need no other changes.

---

## Tech stack

React 19 · React Router 7 · Vite 7 · Tailwind CSS 4 · Express 5 · better-sqlite3 · JWT · bcryptjs · express-rate-limit
