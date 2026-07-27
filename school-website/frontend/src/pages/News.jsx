import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { PageHeader, SectionTitle, Spinner, ErrorBox, Empty, Badge, formatDate } from '../components/UI';

/* ------------------------- NEWS LISTING ------------------------- */
export function NewsList() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/news'), api.get('/events?upcoming=1')])
      .then(([n, e]) => { setNews(n); setEvents(e); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(news.map((n) => n.category))];
  const shown = cat === 'All' ? news : news.filter((n) => n.category === cat);

  return (
    <>
      <PageHeader title="News & Events" subtitle="Announcements, achievements and what is coming up on the school calendar." />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          {loading && <Spinner label="Loading news…" />}
          {error && <ErrorBox message={error} />}

          {!loading && !error && (
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Articles */}
              <div className="lg:col-span-2">
                <div className="mb-8 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        cat === c ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {shown.length === 0 ? (
                  <Empty message="No articles in this category yet." />
                ) : (
                  <div className="space-y-8">
                    {shown.map((n) => (
                      <article key={n.id} className="group grid gap-5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg sm:grid-cols-3">
                        <div className="h-44 overflow-hidden bg-navy-100 sm:h-full">
                          <img src={n.image || '/images/classroom.jpg'} alt=""
                               className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-6 sm:col-span-2">
                          <div className="mb-2 flex items-center gap-3">
                            <Badge tone="gold">{n.category}</Badge>
                            <span className="text-xs text-gray-400">{formatDate(n.created_at)}</span>
                          </div>
                          <h2 className="font-display text-xl font-bold leading-snug text-navy-800">
                            <Link to={`/news/${n.slug}`} className="hover:text-navy-600">{n.title}</Link>
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed text-gray-600">{n.excerpt}</p>
                          <Link to={`/news/${n.slug}`} className="mt-3 inline-block text-sm font-semibold text-navy-600 hover:underline">
                            Read more →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Events sidebar */}
              <aside>
                <h3 className="mb-5 font-display text-xl font-bold text-navy-800">Upcoming Events</h3>
                {events.length === 0 ? (
                  <Empty message="No upcoming events." />
                ) : (
                  <div className="space-y-4">
                    {events.map((e) => {
                      const d = new Date(String(e.starts_at).replace(' ', 'T'));
                      return (
                        <div key={e.id} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                          <div className="flex gap-4">
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
                          <p className="mt-3 text-sm text-gray-600">{e.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------- SINGLE ARTICLE ------------------------ */
export function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [more, setMore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/news/${slug}`)
      .then((a) => {
        setArticle(a);
        return api.get('/news?limit=4');
      })
      .then((list) => setMore(list.filter((n) => n.slug !== slug).slice(0, 3)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="py-32"><Spinner label="Loading article…" /></div>;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <ErrorBox message={error} />
        <Link to="/news" className="mt-6 inline-block rounded-md bg-navy-700 px-6 py-2.5 font-semibold text-white">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={article.title} crumb="News" />

      <article className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <Badge tone="gold">{article.category}</Badge>
            <span className="text-sm text-gray-500">
              {formatDate(article.created_at)} · by {article.author}
            </span>
          </div>

          <img
            src={article.image || '/images/library.jpg'}
            alt=""
            className="mb-8 h-64 w-full rounded-xl object-cover shadow sm:h-80"
          />

          <p className="mb-6 border-l-4 border-gold-500 pl-4 text-lg font-medium text-navy-800">
            {article.excerpt}
          </p>

          <div className="space-y-4 leading-relaxed text-gray-700">
            {article.body.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <Link to="/news" className="mt-10 inline-block rounded-md border-2 border-navy-700 px-6 py-2.5 font-semibold text-navy-700 transition hover:bg-navy-700 hover:text-white">
            ← Back to all news
          </Link>
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <SectionTitle title="More from the school" />
            <div className="grid gap-6 sm:grid-cols-3">
              {more.map((n) => (
                <Link key={n.id} to={`/news/${n.slug}`}
                      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <Badge tone="gold">{n.category}</Badge>
                  <h3 className="mt-2 font-display font-bold leading-snug text-navy-800">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{n.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
