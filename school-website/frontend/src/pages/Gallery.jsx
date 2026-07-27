import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHeader, SectionTitle, Spinner, Empty } from '../components/UI';

// Local fallback images used when a gallery row has no uploaded file yet
const POOL = ['/images/hero.jpg','/images/lab.jpg','/images/library.jpg','/images/sports.jpg','/images/classroom.jpg'];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gallery')
      .then((d) => setItems(d.map((g, i) => ({ ...g, src: POOL[i % POOL.length] }))))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // Close the lightbox with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const categories = ['All', ...new Set(items.map((i) => i.category))];
  const shown = cat === 'All' ? items : items.filter((i) => i.category === cat);

  return (
    <>
      <PageHeader title="Gallery" subtitle="Life at Bright Future — our campus, laboratories, sports and celebrations." />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Photo Gallery" title="A look around our school" />

          {loading ? <Spinner label="Loading gallery…" /> : shown.length === 0 ? (
            <Empty message="No photos have been uploaded yet." />
          ) : (
            <>
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      cat === c ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setLightbox(g)}
                    className="group relative h-60 overflow-hidden rounded-xl bg-navy-100 text-left shadow-sm"
                  >
                    <img src={g.src} alt={g.caption}
                         className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />
                    <div className="absolute bottom-0 p-5 text-white">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-400">
                        {g.category}
                      </span>
                      <p className="text-sm font-medium leading-snug">{g.caption}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-5 top-5 text-4xl leading-none text-white/80 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl">
            <img src={lightbox.src} alt={lightbox.caption} className="max-h-[75vh] w-full rounded-lg object-contain" />
            <figcaption className="mt-4 text-center text-white">
              <span className="block text-xs uppercase tracking-wider text-gold-400">{lightbox.category}</span>
              {lightbox.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
