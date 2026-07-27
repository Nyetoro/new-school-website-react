import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, SectionTitle } from '../components/UI';

const LEVELS = {
  Junior: {
    label: 'Junior Secondary (JSS1 – JSS3)',
    intro:
      'The junior school follows the Universal Basic Education curriculum and prepares students for the Basic Education Certificate Examination (BECE) at the end of JSS3.',
    subjects: ['English Language','Mathematics','Basic Science','Basic Technology','Social Studies','Civic Education','Business Studies','Computer Studies / ICT','Agricultural Science','Home Economics','Cultural & Creative Arts','French','Igbo Language','Christian/Islamic Religious Studies','Physical & Health Education'],
  },
  Senior: {
    label: 'Senior Secondary (SS1 – SS3)',
    intro:
      'Senior students choose a subject stream and are prepared for both WASSCE (WAEC) and NECO, alongside JAMB/UTME preparation from SS2.',
    subjects: ['English Language','Mathematics','Civic Education','Physics','Chemistry','Biology','Further Mathematics','Agricultural Science','Economics','Government','Literature-in-English','Christian Religious Studies','Geography','History','Financial Accounting','Commerce','Computer Studies','Technical Drawing','Visual Arts'],
  },
};

const STREAMS = [
  { icon: '🔬', name: 'Science', text: 'Physics, Chemistry, Biology and Further Mathematics — for medicine, engineering, computing and the pure sciences.' },
  { icon: '📊', name: 'Commercial', text: 'Financial Accounting, Commerce, Economics and Business Studies — for accountancy, finance and business.' },
  { icon: '📖', name: 'Arts & Humanities', text: 'Literature, Government, History, CRS and Geography — for law, mass communication, education and the social sciences.' },
];

const CALENDAR = [
  ['First Term', 'September – December', 'Resumption, mid-term break, first term examinations, Founder\'s Day.'],
  ['Second Term', 'January – April', 'Mock examinations for exit classes, Inter-House Sports, Cultural Day.'],
  ['Third Term', 'April – July', 'WASSCE/NECO/BECE, promotion examinations, Speech & Prize Giving Day.'],
];

const SUPPORT = [
  { icon: '📝', title: 'Saturday Revision', text: 'Free Saturday revision classes for SS3 and JSS3 in the two terms before external examinations.' },
  { icon: '👩‍🏫', title: 'Small Class Sizes', text: 'A maximum of 28 students per class, so teachers can give individual attention.' },
  { icon: '🧭', title: 'Career Guidance', text: 'Structured subject-choice counselling in SS1 and university application support in SS3.' },
  { icon: '📈', title: 'Continuous Assessment', text: 'Termly reports combining tests, assignments, practicals and examinations — shared with parents.' },
];

export default function Academics() {
  const [tab, setTab] = useState('Junior');
  const level = LEVELS[tab];

  return (
    <>
      <PageHeader
        title="Academics"
        subtitle="A rigorous, well-structured curriculum from JSS1 through SS3, taught by specialists and measured by results."
      />

      {/* Curriculum tabs */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Curriculum" title="What our students study" />

          <div className="mb-8 flex justify-center gap-3">
            {Object.keys(LEVELS).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`rounded-md px-6 py-2.5 text-sm font-semibold transition ${
                  tab === k ? 'bg-navy-700 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {k} School
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl font-bold text-navy-800">{level.label}</h3>
            <p className="mt-2 max-w-3xl text-gray-600">{level.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {level.subjects.map((s) => (
                <span key={s} className="rounded-md bg-navy-50 px-3 py-1.5 text-sm text-navy-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Streams */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle
            eyebrow="Senior School"
            title="Choose a stream in SS1"
            subtitle="Students select a stream at the start of SS1 after subject-choice counselling with our guidance unit."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {STREAMS.map((s) => (
              <div key={s.name} className="rounded-xl border-t-4 border-gold-500 bg-white p-7 shadow-sm">
                <div className="mb-3 text-3xl">{s.icon}</div>
                <h3 className="mb-2 font-display text-lg font-bold text-navy-800">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <img src="/images/lab.jpg" alt="Practical science" className="h-80 w-full rounded-xl object-cover shadow-lg" />
          <div>
            <SectionTitle center={false} eyebrow="Results" title="Performance that speaks for itself" />
            <div className="space-y-4">
              {[
                ['WASSCE — 5 credits inc. Maths & English', '96%'],
                ['BECE — passed to senior secondary', '100%'],
                ['JAMB — scored 200 and above', '81%'],
                ['Students in tertiary institutions within a year', '89%'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-bold text-navy-800">{value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gold-500" style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Figures from the 2025 examination cycle.</p>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="bg-navy-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-400">Academic Year</span>
            <h2 className="mt-2 font-display text-3xl font-bold">Three terms, one clear plan</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {CALENDAR.map(([term, months, detail]) => (
              <div key={term} className="rounded-xl bg-white/5 p-7 ring-1 ring-white/10">
                <h3 className="font-display text-xl font-bold text-gold-400">{term}</h3>
                <p className="mt-1 text-sm font-semibold text-white">{months}</p>
                <p className="mt-3 text-sm text-navy-100/80">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Academic Support" title="How we help students succeed" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT.map((s) => (
              <div key={s.title} className="rounded-xl bg-gray-50 p-7">
                <div className="mb-3 text-3xl">{s.icon}</div>
                <h4 className="mb-2 font-display font-bold text-navy-800">{s.title}</h4>
                <p className="text-sm text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/admissions" className="rounded-md bg-navy-700 px-8 py-3.5 font-semibold text-white transition hover:bg-navy-800">
              Apply for Admission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
