import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHeader, SectionTitle, Spinner, ErrorBox, Empty } from '../components/UI';

const initials = (name) =>
  name.replace(/^(Mrs\.|Mr\.|Dr\.|Miss|Alhaji)\s*/i, '')
      .split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/staff')
      .then(setStaff)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const departments = ['All', ...new Set(staff.map((s) => s.department))];
  const shown = filter === 'All' ? staff : staff.filter((s) => s.department === filter);

  return (
    <>
      <PageHeader
        title="Our Staff"
        subtitle="Sixty-eight qualified teachers and support staff, many of whom have been with the school for over a decade."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Meet the team" title="The people behind the school" />

          {loading && <Spinner label="Loading staff…" />}
          {error && <ErrorBox message={error} />}

          {!loading && !error && (
            <>
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                {departments.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilter(d)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      filter === d ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {shown.length === 0 ? (
                <Empty message="No staff members in this department yet." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((s) => (
                    <div key={s.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900">
                        {s.photo ? (
                          <img src={s.photo} alt={s.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-display text-5xl font-bold text-gold-400">
                            {initials(s.name)}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-lg font-bold text-navy-800">{s.name}</h3>
                        <p className="text-sm font-semibold text-gold-600">{s.role}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{s.department}</p>
                        {s.bio && <p className="mt-3 text-sm leading-relaxed text-gray-600">{s.bio}</p>}
                        {s.email && (
                          <a href={`mailto:${s.email}`} className="mt-3 inline-block text-sm text-navy-600 hover:underline">
                            {s.email}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
