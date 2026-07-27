import { useState } from 'react';
import { api } from '../api';
import { PageHeader, SectionTitle, ErrorBox } from '../components/UI';

const STEPS = [
  ['1', 'Submit the online application', 'Complete the form on this page. You will receive a reference number immediately.'],
  ['2', 'Pay the application fee', 'A non-refundable fee of ₦5,000 at the Bursary or by bank transfer. Quote your reference number.'],
  ['3', 'Sit the entrance examination', 'Held Saturday, 13 September at 9:00am. Bring your examination slip and writing materials.'],
  ['4', 'Interview & interaction', 'Shortlisted candidates and their parents meet the Principal and admissions panel.'],
  ['5', 'Offer of admission', 'Results are released on 27 September. Successful candidates receive an offer letter and fee schedule.'],
];

const REQUIREMENTS = [
  'Completed online application form',
  'Birth certificate or sworn declaration of age',
  'Two recent passport photographs',
  'Last two terminal reports from the previous school',
  'Transfer certificate (for students joining above JSS1)',
  'Immunisation record (JSS1 applicants)',
];

const FEES = [
  ['JSS1 – JSS3 (Day)', '₦185,000', 'per term'],
  ['SS1 – SS3 (Day)', '₦215,000', 'per term'],
  ['Boarding supplement', '₦140,000', 'per term'],
  ['One-off development levy', '₦75,000', 'new students only'],
];

const FAQS = [
  ['What is the age requirement for JSS1?', 'Applicants into JSS1 should be between 9 and 11 years old as at September of the year of entry.'],
  ['Do you offer boarding?', 'Yes. Boarding is available from JSS2 upward, in supervised single-sex hostels with a resident house parent and matron.'],
  ['Is there a scholarship scheme?', 'Yes. We offer merit scholarships covering up to 50% of tuition to the top three candidates in the entrance examination, and a small number of needs-based bursaries.'],
  ['Can a student join mid-session?', 'Mid-session transfers are considered on a case-by-case basis where space exists, subject to a placement test.'],
  ['Does the school provide transport?', 'Yes. School buses cover the Awka Road, GRA, Nkpor and Fegge routes for an additional termly fee.'],
];

const CLASSES = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

const EMPTY = {
  student_name: '', date_of_birth: '', gender: '', class_applying: '',
  parent_name: '', email: '', phone: '', address: '', previous_school: '', message: '',
};

export default function Admissions() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle' });
  const [openFaq, setOpenFaq] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: 'sending' });
    try {
      const res = await api.post('/admissions', form);
      setStatus({ state: 'done', reference: res.reference, message: res.message });
      setForm(EMPTY);
      window.scrollTo({ top: document.getElementById('apply').offsetTop - 80, behavior: 'smooth' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  }

  const field = 'w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20';
  const label = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <>
      <PageHeader
        title="Admissions"
        subtitle="Applications into JSS1 and SS1 for the 2025/2026 academic session are now open. Entrance examination: Saturday, 13 September."
      />

      {/* Process */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="How to Apply" title="Five steps to joining us" />
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {STEPS.map(([n, title, text]) => (
              <div key={n} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy-700 font-bold text-white">
                  {n}
                </div>
                <h3 className="mb-2 font-display font-bold text-navy-800">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + fees */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h3 className="mb-5 font-display text-2xl font-bold text-navy-800">Entry Requirements</h3>
            <ul className="space-y-3">
              {REQUIREMENTS.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 text-gold-600">✔</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h3 className="mb-5 font-display text-2xl font-bold text-navy-800">Schedule of Fees</h3>
            <div className="divide-y divide-gray-100">
              {FEES.map(([item, amount, note]) => (
                <div key={item} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item}</div>
                    <div className="text-xs text-gray-500">{note}</div>
                  </div>
                  <div className="font-display font-bold text-navy-800">{amount}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Fees cover tuition, textbooks, laboratory materials and examinations. Uniforms and
              transport are billed separately.
            </p>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionTitle eyebrow="Application Form" title="Start your child's application" />

          {status.state === 'done' ? (
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-10 text-center">
              <div className="mb-3 text-5xl">✅</div>
              <h3 className="font-display text-2xl font-bold text-green-800">Application received</h3>
              <p className="mt-2 text-green-700">{status.message}</p>
              <p className="mt-4 text-sm text-green-800">
                Your reference number is{' '}
                <span className="rounded bg-white px-2 py-1 font-mono font-bold">{status.reference}</span>
              </p>
              <p className="mt-2 text-xs text-green-700">
                Please quote this when paying the application fee.
              </p>
              <button
                onClick={() => setStatus({ state: 'idle' })}
                className="mt-6 rounded-md bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              {status.state === 'error' && <ErrorBox message={status.message} />}

              <h4 className="font-display text-lg font-bold text-navy-800">Student details</h4>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label}>Full name of student *</label>
                  <input required className={field} value={form.student_name} onChange={set('student_name')} placeholder="e.g. Chidera Obi" />
                </div>
                <div>
                  <label className={label}>Date of birth *</label>
                  <input required type="date" className={field} value={form.date_of_birth} onChange={set('date_of_birth')} />
                </div>
                <div>
                  <label className={label}>Gender *</label>
                  <select required className={field} value={form.gender} onChange={set('gender')}>
                    <option value="">Select…</option>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Class applying for *</label>
                  <select required className={field} value={form.class_applying} onChange={set('class_applying')}>
                    <option value="">Select…</option>
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label}>Previous school</label>
                  <input className={field} value={form.previous_school} onChange={set('previous_school')} placeholder="Name of last school attended" />
                </div>
              </div>

              <h4 className="pt-2 font-display text-lg font-bold text-navy-800">Parent / guardian details</h4>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label}>Parent / guardian name *</label>
                  <input required className={field} value={form.parent_name} onChange={set('parent_name')} />
                </div>
                <div>
                  <label className={label}>Email address *</label>
                  <input required type="email" className={field} value={form.email} onChange={set('email')} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={label}>Phone number *</label>
                  <input required className={field} value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Home address</label>
                  <input className={field} value={form.address} onChange={set('address')} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Anything else we should know?</label>
                  <textarea rows="4" className={field} value={form.message} onChange={set('message')} placeholder="Medical conditions, special needs, questions…" />
                </div>
              </div>

              <button
                type="submit"
                disabled={status.state === 'sending'}
                className="w-full rounded-md bg-gold-500 py-3.5 font-semibold text-navy-900 transition hover:bg-gold-400 disabled:opacity-60"
              >
                {status.state === 'sending' ? 'Submitting…' : 'Submit Application'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Fields marked * are required. We will contact you within three working days.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionTitle eyebrow="FAQs" title="Questions parents often ask" />
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => (
              <div key={q} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-navy-800"
                  aria-expanded={openFaq === i}
                >
                  {q}
                  <span className="ml-4 text-gold-600">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">{a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
