import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SCHOOL } from '../config';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/staff', label: 'Our Staff' },
  { to: '/news', label: 'News & Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export function Crest({ className = 'h-11 w-11' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 2 6 12v22c0 15 11 25 26 28 15-3 26-13 26-28V12L32 2Z" fill="#1e3a8a" />
      <path d="M32 7 11 15v19c0 12.5 9 21 21 23.7C44 55 53 46.5 53 34V15L32 7Z" fill="#f4c257" />
      <path d="M32 12 16 18v16c0 10 7 16.8 16 19 9-2.2 16-9 16-19V18l-16-6Z" fill="#1e3a8a" />
      <path d="M22 26h20v3H22zm0 7h20v3H22zm0 7h13v3H22z" fill="#f4c257" />
    </svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy-900 text-navy-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex gap-5">
            <span>📞 {SCHOOL.phone}</span>
            <span>✉️ {SCHOOL.email}</span>
          </div>
          <div className="flex gap-5">
            <span>🕗 Mon–Fri, 7:30am – 4:00pm</span>
            <Link to="/login" className="font-semibold text-gold-400 hover:text-gold-500">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      <div className={`bg-white transition-shadow ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Crest />
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-navy-800 sm:text-xl">
                {SCHOOL.shortName}
              </div>
              <div className="text-[11px] tracking-wide text-gray-500">{SCHOOL.motto}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-navy-50 text-navy-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-navy-700'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/admissions"
              className="ml-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-gold-400"
            >
              Apply Now
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-navy-800 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="border-t bg-white px-4 pb-4 lg:hidden">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-3 text-sm font-medium ${
                    isActive ? 'bg-navy-50 text-navy-700' : 'text-gray-700'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/admissions"
              className="mt-2 block rounded-md bg-gold-500 px-3 py-3 text-center text-sm font-semibold text-navy-900"
            >
              Apply Now
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Crest className="h-10 w-10" />
            <span className="font-display text-lg font-bold text-white">{SCHOOL.shortName}</span>
          </div>
          <p className="text-sm leading-relaxed text-navy-100/80">
            A co-educational secondary school in {SCHOOL.city} committed to academic excellence,
            character and service since {SCHOOL.founded}.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {NAV.slice(1, 6).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-navy-100/80 transition hover:text-gold-400">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-navy-100/80">
            <li>{SCHOOL.address}</li>
            <li>{SCHOOL.phone}</li>
            <li>{SCHOOL.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">School Hours</h4>
          <ul className="space-y-2 text-sm text-navy-100/80">
            <li>Monday – Friday: 7:30am – 4:00pm</li>
            <li>Saturday (revision): 9:00am – 1:00pm</li>
            <li>Sunday: Closed</li>
          </ul>
          <Link
            to="/admissions"
            className="mt-4 inline-block rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-400"
          >
            Apply for Admission
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-navy-100/60">
        © {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
