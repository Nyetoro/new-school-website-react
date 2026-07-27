import { useState } from 'react';
import { api } from '../api';
import { PageHeader, SectionTitle, ErrorBox } from '../components/UI';
import { SCHOOL } from '../config';

const EMPTY = { name: '', email: '', subject: '', body: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: 'sending' });
    try {
      const res = await api.post('/messages', form);
      setStatus({ state: 'done', message: res.message });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  }

  const field = 'w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20';
  const label = 'mb-1.5 block text-sm font-medium text-gray-700';

  const CARDS = [
    { icon: '📍', title: 'Visit Us', lines: [SCHOOL.address] },
    { icon: '📞', title: 'Call Us', lines: [SCHOOL.phone, '+234 806 555 9090 (Admissions)'] },
    { icon: '✉️', title: 'Email Us', lines: [SCHOOL.email, 'admissions@brightfuture.edu.ng'] },
    { icon: '🕗', title: 'Office Hours', lines: ['Mon – Fri: 7:30am – 4:00pm', 'Sat: 9:00am – 1:00pm'] },
  ];

  return (
    <>
      <PageHeader title="Contact Us" subtitle="We are happy to answer questions, arrange a campus tour, or discuss your child's needs." />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => (
              <div key={c.title} className="rounded-xl border border-gray-100 bg-white p-7 text-center shadow-sm">
                <div className="mb-3 text-3xl">{c.icon}</div>
                <h3 className="mb-2 font-display font-bold text-navy-800">{c.title}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="text-sm text-gray-600">{l}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              <SectionTitle center={false} eyebrow="Send a Message" title="We would love to hear from you" />

              {status.state === 'done' ? (
                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-10 text-center">
                  <div className="mb-3 text-5xl">✅</div>
                  <h3 className="font-display text-xl font-bold text-green-800">Message sent</h3>
                  <p className="mt-2 text-sm text-green-700">{status.message}</p>
                  <button
                    onClick={() => setStatus({ state: 'idle' })}
                    className="mt-6 rounded-md bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
                  {status.state === 'error' && <ErrorBox message={status.message} />}
                  <div>
                    <label className={label}>Your name *</label>
                    <input required className={field} value={form.name} onChange={set('name')} />
                  </div>
                  <div>
                    <label className={label}>Email address *</label>
                    <input required type="email" className={field} value={form.email} onChange={set('email')} />
                  </div>
                  <div>
                    <label className={label}>Subject *</label>
                    <input required className={field} value={form.subject} onChange={set('subject')} placeholder="e.g. Enquiry about boarding" />
                  </div>
                  <div>
                    <label className={label}>Message *</label>
                    <textarea required rows="6" className={field} value={form.body} onChange={set('body')} />
                  </div>
                  <button
                    type="submit"
                    disabled={status.state === 'sending'}
                    className="w-full rounded-md bg-navy-700 py-3.5 font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
                  >
                    {status.state === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Map + directions */}
            <div>
              <SectionTitle center={false} eyebrow="Find Us" title="Our campus in Onitsha" />
              <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                <iframe
                  title="School location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=6.76%2C6.12%2C6.82%2C6.18&layer=mapnik"
                  className="h-80 w-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="mt-6 rounded-xl bg-gray-50 p-6">
                <h4 className="mb-3 font-display font-bold text-navy-800">Getting here</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Five minutes from Upper Iweka along Awka Road.</li>
                  <li>• School buses serve the Awka Road, GRA, Nkpor and Fegge routes.</li>
                  <li>• Visitor parking is available inside the main gate.</li>
                  <li>• All visitors must sign in at the security post.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
