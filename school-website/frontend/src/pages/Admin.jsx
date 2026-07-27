import { useEffect, useState, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Crest } from '../components/Layout';
import { Spinner, ErrorBox, Empty, Badge, formatDate } from '../components/UI';

const TABS = [
  ['overview', 'Overview', '📊'],
  ['admissions', 'Applications', '📥'],
  ['news', 'News', '📰'],
  ['events', 'Events', '📅'],
  ['students', 'Students', '🎓'],
  ['staff', 'Staff', '👩‍🏫'],
  ['messages', 'Messages', '✉️'],
];

const input = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20';
const btn = 'rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60';

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [sidebar, setSidebar] = useState(false);

  if (authLoading) return <div className="py-32"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-900 text-white transition-transform lg:static lg:translate-x-0 ${sidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Crest className="h-9 w-9" />
          <div>
            <div className="font-display font-bold leading-tight">Admin Panel</div>
            <div className="text-[11px] text-navy-100/70">Bright Future College</div>
          </div>
        </div>

        <nav className="p-3">
          {TABS.map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSidebar(false); }}
              className={`mb-1 flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium transition ${
                tab === key ? 'bg-gold-500 text-navy-900' : 'text-navy-100/80 hover:bg-white/10'
              }`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4">
          <div className="mb-3 text-xs text-navy-100/70">
            Signed in as<br /><span className="font-semibold text-white">{user.name}</span>
          </div>
          <Link to="/" className="mb-2 block rounded-md bg-white/10 px-3 py-2 text-center text-xs hover:bg-white/20">
            View website
          </Link>
          <button onClick={logout} className="w-full rounded-md bg-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-700">
            Sign out
          </button>
        </div>
      </aside>

      {sidebar && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebar(false)} />}

      {/* Content */}
      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between bg-white px-5 py-4 shadow-sm">
          <button onClick={() => setSidebar(true)} className="text-navy-800 lg:hidden" aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <h1 className="font-display text-lg font-bold text-navy-800">
            {TABS.find((t) => t[0] === tab)[1]}
          </h1>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-GB', { dateStyle: 'medium' })}</span>
        </header>

        <div className="p-5 lg:p-8">
          {tab === 'overview'   && <Overview />}
          {tab === 'admissions' && <Admissions />}
          {tab === 'news'       && <News />}
          {tab === 'events'     && <Events />}
          {tab === 'students'   && <Students />}
          {tab === 'staff'      && <StaffAdmin />}
          {tab === 'messages'   && <Messages />}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- shared hook -------------------------- */
function useResource(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api.get(path, true));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  // NOTE: the effect body must not return the promise, otherwise React
  // treats it as a cleanup function and throws "destroy is not a function".
  useEffect(() => {
    reload();
  }, [reload]);
  return { data, error, loading, reload };
}

function Card({ children, className = '' }) {
  return <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

/* ----------------------------- OVERVIEW --------------------------- */
function Overview() {
  const { data, error, loading } = useResource('/stats');
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  const cards = [
    ['Students', data.students, '🎓', 'bg-blue-50 text-blue-700'],
    ['Staff', data.staff, '👩‍🏫', 'bg-purple-50 text-purple-700'],
    ['Pending applications', data.pendingAdmissions, '📥', 'bg-amber-50 text-amber-700'],
    ['Unread messages', data.unreadMessages, '✉️', 'bg-rose-50 text-rose-700'],
    ['Published articles', data.news, '📰', 'bg-emerald-50 text-emerald-700'],
    ['Upcoming events', data.events, '📅', 'bg-cyan-50 text-cyan-700'],
  ];
  const max = Math.max(...data.byClass.map((c) => c.value), 1);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, icon, tone]) => (
          <Card key={label} className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${tone}`}>{icon}</div>
            <div>
              <div className="font-display text-2xl font-bold text-navy-800">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-5 font-display text-lg font-bold text-navy-800">Enrolment by class</h3>
        <div className="flex h-52 items-end justify-around gap-3">
          {data.byClass.map((c) => (
            <div key={c.label} className="flex flex-1 flex-col items-center">
              <span className="mb-1 text-sm font-bold text-navy-800">{c.value}</span>
              <div className="w-full rounded-t bg-navy-600 transition-all"
                   style={{ height: `${(c.value / max) * 150}px` }} />
              <span className="mt-2 text-xs font-medium text-gray-600">{c.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------- ADMISSIONS -------------------------- */
function Admissions() {
  const { data, error, loading, reload } = useResource('/admissions');
  const [filter, setFilter] = useState('all');
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  const shown = filter === 'all' ? data : data.filter((a) => a.status === filter);
  const tone = { pending: 'gold', approved: 'green', rejected: 'red' };

  async function setStatus(id, status) {
    await api.patch(`/admissions/${id}`, { status });
    reload();
  }
  async function remove(id) {
    if (confirm('Delete this application permanently?')) {
      await api.delete(`/admissions/${id}`);
      reload();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                    filter === f ? 'bg-navy-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}>
            {f} ({f === 'all' ? data.length : data.filter((a) => a.status === f).length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? <Empty message="No applications here." /> : (
        <div className="space-y-4">
          {shown.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-bold text-navy-800">{a.student_name}</h3>
                    <Badge tone={tone[a.status]}>{a.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Applying for <strong>{a.class_applying}</strong> · {a.gender} · born {a.date_of_birth}
                  </p>
                  <div className="mt-3 grid gap-x-8 gap-y-1 text-sm text-gray-600 sm:grid-cols-2">
                    <span>👤 {a.parent_name}</span>
                    <span>✉️ {a.email}</span>
                    <span>📞 {a.phone}</span>
                    <span>🏫 {a.previous_school || '—'}</span>
                  </div>
                  {a.message && <p className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-600">{a.message}</p>}
                  <p className="mt-2 text-xs text-gray-400">
                    Ref ADM-{String(a.id).padStart(5, '0')} · received {formatDate(a.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {a.status !== 'approved' && (
                    <button onClick={() => setStatus(a.id, 'approved')}
                            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                      Approve
                    </button>
                  )}
                  {a.status !== 'rejected' && (
                    <button onClick={() => setStatus(a.id, 'rejected')}
                            className="rounded-md bg-gray-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-600">
                      Reject
                    </button>
                  )}
                  <button onClick={() => remove(a.id)}
                          className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- NEWS ----------------------------- */
function News() {
  const { data, error, loading, reload } = useResource('/news');
  const [form, setForm] = useState({ title: '', category: 'News', excerpt: '', body: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      await api.post('/news', form, true);
      setForm({ title: '', category: 'News', excerpt: '', body: '' });
      setMsg('Article published.');
      reload();
    } catch (err) { setMsg(err.message); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (confirm('Delete this article?')) { await api.delete(`/news/${id}`); reload(); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <h3 className="mb-4 font-display text-lg font-bold text-navy-800">Publish an article</h3>
        <form onSubmit={submit} className="space-y-3">
          {msg && <p className="rounded bg-navy-50 p-2 text-xs text-navy-700">{msg}</p>}
          <input required className={input} placeholder="Headline" value={form.title} onChange={set('title')} />
          <select className={input} value={form.category} onChange={set('category')}>
            {['News','Academics','Admissions','Sports','Facilities','Community'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea required rows="2" className={input} placeholder="Short summary" value={form.excerpt} onChange={set('excerpt')} />
          <textarea required rows="7" className={input} placeholder="Full article body" value={form.body} onChange={set('body')} />
          <button disabled={busy} className={`${btn} w-full`}>{busy ? 'Publishing…' : 'Publish'}</button>
        </form>
      </Card>

      <div className="space-y-3 lg:col-span-2">
        {data.map((n) => (
          <Card key={n.id} className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="gold">{n.category}</Badge>
              <h4 className="mt-1 font-display font-bold text-navy-800">{n.title}</h4>
              <p className="mt-1 line-clamp-3 text-sm text-gray-600">{n.excerpt}</p>
              <p className="mt-1 text-xs text-gray-400">{formatDate(n.created_at)} · {n.author}</p>
            </div>
            <button onClick={() => remove(n.id)}
                    className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ EVENTS ---------------------------- */
function Events() {
  const { data, error, loading, reload } = useResource('/events');
  const [form, setForm] = useState({ title: '', description: '', location: '', starts_at: '' });
  const [busy, setBusy] = useState(false);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/events', { ...form, starts_at: form.starts_at.replace('T', ' ') + ':00' }, true);
      setForm({ title: '', description: '', location: '', starts_at: '' });
      reload();
    } catch (err) { alert(err.message); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (confirm('Delete this event?')) { await api.delete(`/events/${id}`); reload(); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-navy-800">Add an event</h3>
        <form onSubmit={submit} className="space-y-3">
          <input required className={input} placeholder="Event title" value={form.title} onChange={set('title')} />
          <input required type="datetime-local" className={input} value={form.starts_at} onChange={set('starts_at')} />
          <input required className={input} placeholder="Location" value={form.location} onChange={set('location')} />
          <textarea required rows="4" className={input} placeholder="Description" value={form.description} onChange={set('description')} />
          <button disabled={busy} className={`${btn} w-full`}>{busy ? 'Saving…' : 'Add Event'}</button>
        </form>
      </Card>

      <div className="space-y-3 lg:col-span-2">
        {data.length === 0 ? <Empty message="No events yet." /> : data.map((e) => (
          <Card key={e.id} className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-navy-800">{e.title}</h4>
              <p className="text-sm text-gray-500">
                📅 {formatDate(e.starts_at)} · 📍 {e.location}
              </p>
              <p className="mt-1 text-sm text-gray-600">{e.description}</p>
            </div>
            <button onClick={() => remove(e.id)}
                    className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- STUDENTS --------------------------- */
function Students() {
  const [search, setSearch] = useState('');
  const [cls, setCls] = useState('All');
  const { data, error, loading, reload } = useResource(
    `/students?search=${encodeURIComponent(search)}&class_level=${cls}`
  );
  const [form, setForm] = useState({ admission_no: '', first_name: '', last_name: '', class_level: 'JSS1', gender: 'Female', guardian_name: '', guardian_phone: '' });
  const [show, setShow] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/students', form, true);
      setForm({ admission_no: '', first_name: '', last_name: '', class_level: 'JSS1', gender: 'Female', guardian_name: '', guardian_phone: '' });
      setShow(false);
      reload();
    } catch (err) { alert(err.message); }
  }

  async function remove(id) {
    if (confirm('Remove this student record?')) { await api.delete(`/students/${id}`); reload(); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input className={`${input} max-w-xs`} placeholder="Search name or admission no…"
               value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={`${input} max-w-[140px]`} value={cls} onChange={(e) => setCls(e.target.value)}>
          {['All','JSS1','JSS2','JSS3','SS1','SS2','SS3'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => setShow((v) => !v)} className={btn}>
          {show ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {show && (
        <Card>
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
            <input required className={input} placeholder="Admission no." value={form.admission_no} onChange={set('admission_no')} />
            <input required className={input} placeholder="First name" value={form.first_name} onChange={set('first_name')} />
            <input required className={input} placeholder="Last name" value={form.last_name} onChange={set('last_name')} />
            <select className={input} value={form.class_level} onChange={set('class_level')}>
              {['JSS1','JSS2','JSS3','SS1','SS2','SS3'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className={input} value={form.gender} onChange={set('gender')}>
              <option>Female</option><option>Male</option>
            </select>
            <input className={input} placeholder="Guardian name" value={form.guardian_name} onChange={set('guardian_name')} />
            <input className={input} placeholder="Guardian phone" value={form.guardian_phone} onChange={set('guardian_phone')} />
            <button className={btn}>Save Student</button>
          </form>
        </Card>
      )}

      {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Admission No.</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Guardian</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs">{s.admission_no}</td>
                  <td className="px-5 py-3 font-medium text-navy-800">{s.first_name} {s.last_name}</td>
                  <td className="px-5 py-3"><Badge>{s.class_level}</Badge></td>
                  <td className="px-5 py-3 text-gray-600">{s.gender}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {s.guardian_name}<br />
                    <span className="text-xs text-gray-400">{s.guardian_phone}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remove(s.id)} className="text-xs font-semibold text-red-600 hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <Empty message="No students match your search." />}
        </Card>
      )}
    </div>
  );
}

/* ------------------------------ STAFF ----------------------------- */
function StaffAdmin() {
  const { data, error, loading, reload } = useResource('/staff');
  const [form, setForm] = useState({ name: '', role: '', department: 'Administration', bio: '', email: '' });

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/staff', form, true);
      setForm({ name: '', role: '', department: 'Administration', bio: '', email: '' });
      reload();
    } catch (err) { alert(err.message); }
  }

  async function remove(id) {
    if (confirm('Remove this staff member?')) { await api.delete(`/staff/${id}`); reload(); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-navy-800">Add staff member</h3>
        <form onSubmit={submit} className="space-y-3">
          <input required className={input} placeholder="Full name" value={form.name} onChange={set('name')} />
          <input required className={input} placeholder="Role / title" value={form.role} onChange={set('role')} />
          <select className={input} value={form.department} onChange={set('department')}>
            {['Administration','Science','Mathematics','Languages','Humanities','ICT','Student Support','Sports'].map((d) => <option key={d}>{d}</option>)}
          </select>
          <input className={input} placeholder="Email (optional)" value={form.email} onChange={set('email')} />
          <textarea rows="4" className={input} placeholder="Short biography" value={form.bio} onChange={set('bio')} />
          <button className={`${btn} w-full`}>Add Staff</button>
        </form>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
        {data.map((s) => (
          <Card key={s.id} className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-display font-bold text-navy-800">{s.name}</h4>
              <p className="text-sm text-gold-600">{s.role}</p>
              <p className="text-xs uppercase tracking-wide text-gray-400">{s.department}</p>
            </div>
            <button onClick={() => remove(s.id)}
                    className="shrink-0 rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200">
              ✕
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- MESSAGES ---------------------------- */
function Messages() {
  const { data, error, loading, reload } = useResource('/messages');
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  async function markHandled(id) { await api.patch(`/messages/${id}`, {}); reload(); }
  async function remove(id) {
    if (confirm('Delete this message?')) { await api.delete(`/messages/${id}`); reload(); }
  }

  if (data.length === 0) return <Empty message="No messages received yet." />;

  return (
    <div className="space-y-4">
      {data.map((m) => (
        <Card key={m.id} className={m.handled ? 'opacity-60' : ''}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-display font-bold text-navy-800">{m.subject}</h3>
                {m.handled ? <Badge tone="green">handled</Badge> : <Badge tone="gold">new</Badge>}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                From <strong>{m.name}</strong> · {m.email} · {formatDate(m.created_at)}
              </p>
              <p className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700">{m.body}</p>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                 className="rounded-md bg-navy-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800">
                Reply
              </a>
              {!m.handled && (
                <button onClick={() => markHandled(m.id)}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                  Mark handled
                </button>
              )}
              <button onClick={() => remove(m.id)}
                      className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
                Delete
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
