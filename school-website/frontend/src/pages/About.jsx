import { PageHeader, SectionTitle } from '../components/UI';
import { SCHOOL } from '../config';

const VALUES = [
  { icon: '🎯', title: 'Excellence', text: 'We set a high bar and give every student the support needed to reach it.' },
  { icon: '🤝', title: 'Integrity', text: 'Honesty in examinations, in sport and in daily conduct is non-negotiable.' },
  { icon: '💡', title: 'Curiosity', text: 'We reward the child who asks the extra question, not only the one who memorises.' },
  { icon: '❤️', title: 'Compassion', text: 'A community where older students look after younger ones as a matter of course.' },
  { icon: '🌍', title: 'Service', text: 'Regular community projects that connect the school to the wider Onitsha community.' },
  { icon: '⚖️', title: 'Discipline', text: 'Clear, fair and consistently applied expectations of behaviour.' },
];

const MILESTONES = [
  ['1998', 'Founded with 42 students in three rented classrooms on Awka Road.'],
  ['2004', 'First WASSCE cohort graduates with a 100% pass rate.'],
  ['2009', 'Permanent campus commissioned, including the junior secondary block.'],
  ['2015', 'Science laboratory complex opened; practical science becomes compulsory.'],
  ['2021', 'Named among the top ten secondary schools in Anambra State.'],
  ['2025', 'Digital Library and ICT Centre commissioned; campus-wide fibre internet.'],
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Our School"
        subtitle={`Founded in ${SCHOOL.founded}, ${SCHOOL.name} has grown from three rented classrooms into one of the most respected secondary schools in Anambra State.`}
      />

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <SectionTitle center={false} eyebrow="Our Story" title="Twenty-seven years of quiet, stubborn work" />
            <div className="space-y-4 text-gray-600">
              <p>
                The school opened in {SCHOOL.founded} with 42 students, four teachers and a
                conviction that children in Onitsha deserved an education as good as any available
                elsewhere in the country.
              </p>
              <p>
                Today we serve over 1,200 students across JSS1 to SS3 on a purpose-built campus,
                with 68 qualified teachers and facilities that include four science laboratories,
                an ICT centre and a 120-seat digital library.
              </p>
              <p>
                What has not changed is the founding principle: small classes, teachers who know
                every child by name, and a refusal to let any student coast.
              </p>
            </div>
          </div>
          <img src="/images/library.jpg" alt="Our library" className="h-80 w-full rounded-xl object-cover shadow-lg lg:h-96" />
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div className="rounded-xl border-t-4 border-navy-700 bg-white p-8 shadow-sm">
            <h3 className="mb-3 font-display text-2xl font-bold text-navy-800">Our Mission</h3>
            <p className="leading-relaxed text-gray-600">
              To provide a rigorous, well-rounded secondary education that equips every student with
              the knowledge, character and confidence to contribute meaningfully to Nigeria and the
              wider world.
            </p>
          </div>
          <div className="rounded-xl border-t-4 border-gold-500 bg-white p-8 shadow-sm">
            <h3 className="mb-3 font-display text-2xl font-bold text-navy-800">Our Vision</h3>
            <p className="leading-relaxed text-gray-600">
              To be recognised as the leading secondary school in South-East Nigeria — known not
              only for examination results, but for producing young people of integrity, curiosity
              and service.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Our Values" title="What we stand for" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h4 className="mb-2 font-display text-lg font-bold text-navy-800">{v.title}</h4>
                <p className="text-sm text-gray-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-navy-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-400">Milestones</span>
            <h2 className="mt-2 font-display text-3xl font-bold">Our journey so far</h2>
          </div>
          <ol className="relative border-l-2 border-white/20 pl-8">
            {MILESTONES.map(([year, text]) => (
              <li key={year} className="mb-9 last:mb-0">
                <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 ring-4 ring-navy-900" />
                <div className="font-display text-xl font-bold text-gold-400">{year}</div>
                <p className="mt-1 text-navy-100/85">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Principal */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-10 rounded-2xl bg-gray-50 p-8 sm:p-12 lg:grid-cols-3">
            <div className="flex justify-center lg:justify-start">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-navy-700 font-display text-5xl font-bold text-gold-400">
                NO
              </div>
            </div>
            <div className="lg:col-span-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
                From the Principal
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-navy-800">Mrs. Ngozi Okeke</h3>
              <p className="mt-4 leading-relaxed text-gray-600">
                "Parents entrust us with something irreplaceable — their children's most formative
                years. We take that seriously. Every teacher here is expected to know not just what
                a student scored, but how that student is doing. Come and visit us; you will see
                the difference in the way our children carry themselves."
              </p>
              <p className="mt-3 text-sm text-gray-500">M.Ed Educational Administration, UNN · Principal since 2016</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
