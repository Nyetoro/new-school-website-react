import { Link } from 'react-router-dom';

/** Page banner used at the top of every inner page */
export function PageHeader({ title, subtitle, crumb }) {
  return (
    <section className="relative overflow-hidden bg-navy-800 py-16 text-white sm:py-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4">
        <nav className="mb-3 text-sm text-navy-100/80">
          <Link to="/" className="hover:text-gold-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gold-400">{crumb || title}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-navy-100/90">{subtitle}</p>}
      </div>
    </section>
  );
}

/** Centred section heading */
export function SectionTitle({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-gold-600">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-2xl font-bold text-navy-800 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-gray-600 ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="h-9 w-9 animate-spin rounded-full border-3 border-gray-200 border-t-navy-600"
           style={{ borderWidth: 3 }} />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export function Empty({ message }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 py-14 text-center text-gray-500">
      {message}
    </div>
  );
}

export function Badge({ children, tone = 'navy' }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    gold: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export const formatDate = (s) =>
  new Date(String(s).replace(' ', 'T')).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
