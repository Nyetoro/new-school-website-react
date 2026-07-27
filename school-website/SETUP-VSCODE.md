# Opening this project in VS Code

## Step 1 — Unzip

Download `school-website.zip` and extract it somewhere sensible, **not** inside Downloads:

- **Windows:** right-click → *Extract All…* → e.g. `C:\Users\YourName\Projects\school-website`
- **macOS:** double-click the zip, then move the folder to `~/Projects/`

> ⚠️ On Windows, extract the zip *before* opening it. Double-clicking a zip only previews it —
> VS Code cannot run code from inside a zip preview.

## Step 2 — Open the folder in VS Code

Launch VS Code → **File → Open Folder…** → select the `school-website` folder itself
(the one containing `backend`, `frontend` and `README.md`).

You should see this in the Explorer sidebar:

```
school-website/
├── .vscode/
├── backend/
├── frontend/
└── README.md
```

VS Code will ask *"Do you trust the authors of the files in this folder?"* → click **Yes, I trust the authors**
(otherwise the terminal is disabled).

It will also offer to install the recommended extensions — click **Install**. The useful ones are
Tailwind CSS IntelliSense, ESLint, Prettier and SQLite Viewer.

## Step 3 — Install dependencies

Open a terminal inside VS Code with **Ctrl + `** (backtick) — on macOS **Cmd + `**.

Then run:

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

`npm install` recreates the `node_modules` folders. They were deliberately left out of the zip
(they're ~150 MB and platform-specific), so this step is required — it takes 1–3 minutes.

## Step 4 — Create your .env file

```bash
cd backend
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```

Open `backend/.env` and set a long random `JWT_SECRET`.

## Step 5 — Seed the database

Still in `backend/`:

```bash
npm run seed
```

This creates `backend/data/school.db` with the demo students, staff, news and events.

## Step 6 — Run both servers

You need **two terminals**. In VS Code, click the **+** icon in the terminal panel to open a second one
(or use the split-terminal button).

**Terminal 1 — backend:**
```bash
cd backend
npm run dev
```
→ `✅ School API running on http://localhost:5000`

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
→ `Local: http://localhost:5173/`

Ctrl-click the `http://localhost:5173/` link to open the site.

### Shortcut: start both at once

Press **Ctrl+Shift+P** → type *Run Task* → choose **▶ Start Website (both servers)**.
That launches both dev servers in parallel using the included `.vscode/tasks.json`.

Or from the project root:

```bash
npm run setup    # installs everything + seeds, one time only
npm start        # runs both servers together
```

## Step 7 — Log into the admin panel

| | |
|---|---|
| Site | http://localhost:5173 |
| Admin | http://localhost:5173/login |
| Email | `admin@brightfuture.edu.ng` |
| Password | `admin123` |

---

## Putting it on GitHub

A `.gitignore` is already included (it excludes `node_modules`, `.env` and the database file).

```bash
git init
git add .
git commit -m "Initial commit: school website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/school-website.git
git push -u origin main
```

In VS Code you can do the same from the **Source Control** panel (the branch icon in the sidebar) —
click *Initialize Repository*, then *Publish to GitHub*.

---

## Troubleshooting

**`npm: command not found`** — Node.js isn't installed or VS Code needs restarting.
Install the LTS build from [nodejs.org](https://nodejs.org), then fully quit and reopen VS Code.

**`'cp' is not recognized`** (Windows PowerShell) — use `copy .env.example .env` instead.

**`EADDRINUSE: port 5000 already in use`** — something else is on that port.
Change `PORT=5001` in `backend/.env`, and update the proxy target in `frontend/vite.config.js` to match.
On macOS, port 5000 is often taken by AirPlay Receiver (System Settings → General → AirDrop & Handoff).

**Blank page / "Failed to fetch"** — the backend isn't running. Both terminals must stay open at
the same time. Check `http://localhost:5000/api/health` returns `{"status":"ok"}`.

**`better-sqlite3` build errors on install** — it compiles a native module. On Windows install the
[VS Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ workload); on macOS
run `xcode-select --install`. Then delete `backend/node_modules` and run `npm install` again.

**PowerShell blocks npm scripts** — run once as Administrator:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
