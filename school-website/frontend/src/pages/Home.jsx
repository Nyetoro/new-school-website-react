import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { SectionTitle, formatDate, Spinner } from '../components/UI';
import { SCHOOL } from '../config';

const STATS = [
  { value: '1,240+', label: 'Students Enrolled' },
  { value: '96%',    label: 'WAEC Credit Pass Rate' },
  { value: '68',     label: 'Qualified Teachers' },
  { value: '27',     label: 'Years of Excellence' },
];

const FEATURES = [
  { icon: '🎓', title: 'Academic Excellence', text: 'A rigorous curriculum with consistently strong WAEC, NECO and JAMB results, backed by a Saturday revision programme.' },
  { icon: '🔬', title: 'Modern Laboratories', text: 'Fully equipped Physics, Chemistry, Biology and ICT laboratories where every student does practical work, not just theory.' },
  { icon: '📚', title: 'Digital Library', text: 'A 120-seat library and research centre with 60 workstations and campus-wide fibre internet.' },
  { icon: '⚽', title: 'Sports & Wellbeing', text: 'Athletics, football, basketball and an active house system that builds teamwork and resilience.' },
  { icon: '🎭', title: 'Arts & Culture', text: 'Music, drama, debate and our annual Cultural Day festival celebrating Nigeria\'s heritage.' },
  { icon: '🧭', title: 'Guidance & Counselling', text: 'Dedicated counsellors supporting subject choice, university applications and pastoral care.' },
];

export default function Home() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/news?limit=3').catch(() => []),
      api.get('/events?upcoming=1').catch(() => []),
    ])
      .then(([n, e]) => { setNews(n); setEvents(e.slice(0, 4)); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ---------------------------- HERO ---------------------------- */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/40" />

        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center px-4 py-20">
          <div className="max-w-2xl animate-fade-up text-white">
            <span className="mb-4 inline-block rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-semibold text-gold-400 ring-1 ring-gold-500/40">
              Admissions open for 2025/2026
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Building Minds.<br />
              <span className="text-gold-400">Shaping Character.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-navy-100/90">
              {SCHOOL.name} is a co-educational secondary school in {SCHOOL.city},
              where academic rigour meets genuine care for every child.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/admissions" className="rounded-md bg-gold-500 px-7 py-3.5 font-semibold text-navy-900 shadow-lg transition hover:bg-gold-400">
                Apply for Admission
              </Link>
              <Link to="/about" className="rounded-md border-2 border-white/70 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-navy-800">
                Discover Our School
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- STATS --------------------------- */}
      <section className="bg-navy-800 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gold-400 sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-navy-100/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- WELCOME -------------------------- */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/classroom.jpg" alt="Students in class" className="h-56 w-full rounded-xl object-cover shadow-md sm:h-72" />
            <img src="/images/lab.jpg" alt="Science laboratory" className="mt-8 h-56 w-full rounded-xl object-cover shadow-md sm:h-72" />
          </div>
          <div>
            <SectionTitle
              center={false}
              eyebrow="Welcome"
              title="A school where every child is known by name"
            />
            <div className="space-y-4 text-gray-600">
              <p>
                Since {SCHOOL.founded}, we have offered families in {SCHOOL.city} an education that
                takes both the mind and the character seriously. Our classes are deliberately kept
                small so that no student disappears into the crowd.
              </p>
              <p>
                We follow the Nigerian national curriculum, enriched with ICT, entrepreneurship and
                a strong practical science programme. Ninety-six per cent of our 2025 WASSCE
                candidates earned five credits or better including Mathematics and English.
              </p>
              <p className="border-l-4 border-gold-500 pl-4 italic text-navy-800">
                "We refuse to let any child settle for less than their best."
                <span className="mt-1 block text-sm not-italic text-gray-500">
                  — Mrs. Ngozi Okeke, Principal
                </span>
              </p>
            </div>
            <Link to="/about" className="mt-6 inline-block rounded-md bg-navy-700 px-6 py-3 font-semibold text-white transition hover:bg-navy-800">
              More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------- FEATURES ------------------------- */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="An education that goes beyond the classroom"
            subtitle="Everything a growing student needs to thrive academically, socially and personally."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-navy-800">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ NEWS & EVENTS ----------------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Latest" title="News & Upcoming Events" />
          {loading ? <Spinner /> : (
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {news.map((n) => (
                    <Link key={n.id} to={`/news/${n.slug}`}
                          className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
                      <div className="h-40 overflow-hidden bg-navy-100">
                        <img src={n.image || '/images/library.jpg'} alt=""
                             className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                          {n.category}
                        </span>
                        <h3 className="mt-1 font-display font-bold leading-snug text-navy-800 group-hover:text-navy-600">
                          {n.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{n.excerpt}</p>
                        <span className="mt-3 block text-xs text-gray-400">{formatDate(n.created_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/news" className="mt-8 inline-block rounded-md border-2 border-navy-700 px-6 py-2.5 font-semibold text-navy-700 transition hover:bg-navy-700 hover:text-white">
                  View All News
                </Link>
              </div>

              <aside>
                <h3 className="mb-4 font-display text-xl font-bold text-navy-800">School Calendar</h3>
                <div className="space-y-4">
                  {events.map((e) => {
                    const d = new Date(String(e.starts_at).replace(' ', 'T'));
                    return (
                      <div key={e.id} className="flex gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-navy-700 text-white">
                          <span className="text-lg font-bold leading-none">{d.getDate()}</span>
                          <span className="text-[10px] uppercase">
                            {d.toLocaleDateString('en-GB', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold leading-snug text-navy-800">{e.title}</h4>
                          <p className="mt-1 text-xs text-gray-500">📍 {e.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------- CTA ---------------------------- */}
      <section className="relative overflow-hidden bg-navy-800 py-20">
        <img src="/images/sports.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Give your child a bright future
          </h2>
          <p className="mt-4 text-navy-100/90">
            Applications into JSS1 and SS1 for the 2025/2026 session are now open.
            Entrance examination holds Saturday, 13 September.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/admissions" className="rounded-md bg-gold-500 px-7 py-3.5 font-semibold text-navy-900 transition hover:bg-gold-400">
              Start an Application
            </Link>
            <Link to="/contact" className="rounded-md border-2 border-white/70 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-navy-800">
              Book a Campus Tour
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
