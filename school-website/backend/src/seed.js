/**
 * Populates the database with realistic starter content.
 * Run with:  npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

(async () => {
  await db.ready;

  const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

console.log('Seeding database…');

db.exec('DELETE FROM users; DELETE FROM news; DELETE FROM events; DELETE FROM staff; DELETE FROM students; DELETE FROM admissions; DELETE FROM messages; DELETE FROM gallery;');

/* ---------------------------- ADMIN USER ---------------------------- */
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@brightfuture.edu.ng').toLowerCase();
const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
  .run('Mrs. Ngozi Okeke', adminEmail, bcrypt.hashSync(adminPass, 10), 'admin');
console.log(`  • admin user: ${adminEmail} / ${adminPass}`);

/* ------------------------------- NEWS ------------------------------- */
const news = [
  ['Bright Future Emerges Overall Winner at State Science Fair', 'Academics',
   'Our Senior Secondary science team took first place in the Anambra State Science & Innovation Fair with a solar-powered water purifier.',
   'For the third consecutive year, Bright Future International College has brought home the top prize at the Anambra State Science & Innovation Fair.\n\nThe winning team — Chidera Obi (SS2), Amaka Nwosu (SS3) and Tobenna Eze (SS2) — designed a low-cost solar-powered water purification unit capable of treating 40 litres of borehole water per hour without any grid electricity.\n\n"What impressed the judges was not just the engineering, but that the students tested it in a real community," said the panel chair.\n\nThe team now proceeds to the national finals in Abuja this November. The school will host a fundraising open day to support their travel.'],
  ['2025/2026 Admission Applications Now Open', 'Admissions',
   'Applications into JSS1 and SS1 for the 2025/2026 academic session are now open. Entrance examination holds Saturday, 13 September.',
   'The Admissions Office is pleased to announce that applications into JSS1 and SS1 for the 2025/2026 academic session are now open.\n\nKey dates:\n• Application closes: 5 September 2025\n• Entrance examination: Saturday, 13 September 2025, 9:00am\n• Interview & interaction with parents: 20 September 2025\n• Release of results: 27 September 2025\n\nApplication forms can be completed online through the Admissions page of this website. A non-refundable application fee applies and is payable at the Bursary or by bank transfer.\n\nFor enquiries, call the Admissions Office on +234 803 123 4567.'],
  ['New Digital Library and ICT Centre Commissioned', 'Facilities',
   'A 120-seat digital library with 60 workstations and campus-wide fibre internet was commissioned by the Board of Governors last Friday.',
   'The Board of Governors formally commissioned our new Digital Library and ICT Centre on Friday.\n\nThe two-storey facility houses a 120-seat reading hall, 60 networked workstations, a digital archive of past examination materials, and a quiet research annex for senior students preparing for WAEC and JAMB.\n\nThe entire campus is now covered by fibre internet, and every student from JSS2 upward receives a personal library account.\n\n"A school library is the heart of a school," the Chairman of the Board said at the ceremony. "We have given our children a heart that beats with the modern world."'],
  ['Inter-House Sports 2025: Green House Retains the Trophy', 'Sports',
   'Green House retained the Principal\'s Cup after a thrilling day of athletics, with two school records broken in the 4x100m relay.',
   'Our annual Inter-House Sports Festival brought parents, alumni and the wider community to the school field last Saturday.\n\nGreen House retained the Principal\'s Cup with 187 points, ahead of Blue House (164), Red House (151) and Yellow House (139).\n\nTwo school records fell on the day: the senior boys\' 4x100m relay and the junior girls\' long jump, where Kelechi Anyanwu (JSS3) cleared 4.82m.\n\nThe Principal thanked parents for their attendance and reminded the community that sport remains a core part of the school\'s character-building philosophy.'],
  ['Career Day: Alumni Return to Mentor Senior Students', 'Community',
   'Twelve alumni working in medicine, law, software engineering and agribusiness spent the day mentoring SS2 and SS3 students.',
   'The Guidance & Counselling Unit hosted the 2025 Career Day, welcoming twelve alumni back to campus.\n\nStudents rotated through breakout sessions on medicine, law, software engineering, accountancy, agribusiness and the creative industries. Each session covered required subject combinations, realistic entry routes, and what a typical working week actually looks like.\n\nThe day closed with a panel on university applications, both within Nigeria and abroad, and a practical workshop on writing a personal statement.'],
  ['WAEC 2025: 96% of Candidates Earn Five Credits Including Maths and English', 'Academics',
   'Our 2025 WASSCE cohort recorded a 96% pass rate at five credits and above, including Mathematics and English Language.',
   'The 2025 West African Senior School Certificate Examination results are out, and our candidates have again performed strongly.\n\n96% of our 78 candidates obtained five credits or better including Mathematics and English Language — the benchmark for university admission. 41% obtained eight or nine distinctions.\n\nThe Principal commended the teaching staff, the Saturday revision programme, and above all the discipline of the students themselves.\n\n"These results belong to the children," she said. "We simply refused to let them settle for less than their best."'],
];
const newsStmt = db.prepare(
  'INSERT INTO news (title, slug, excerpt, body, category, author, created_at) VALUES (?,?,?,?,?,?,?)'
);
news.forEach(([title, category, excerpt, body], i) => {
  const d = new Date(Date.now() - (i * 9 + 2) * 86400000).toISOString().slice(0, 19).replace('T', ' ');
  newsStmt.run(title, slugify(title).slice(0, 80), excerpt, body, category, 'School Admin', d);
});
console.log(`  • ${news.length} news articles`);

/* ------------------------------ EVENTS ------------------------------ */
const future = (days) => {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().slice(0, 10) + ' 09:00:00';
};
const events = [
  ['Entrance Examination (JSS1 & SS1)', 'Written entrance examination for all applicants into JSS1 and SS1. Candidates should arrive by 8:15am with their examination slip.', 'Main Examination Hall', future(14)],
  ['Parent–Teacher Association Meeting', 'First term PTA general meeting. Agenda includes the academic calendar, security review and the new bus route.', 'School Auditorium', future(26)],
  ['Founder\'s Day & Prize Giving', 'Annual Founder\'s Day celebration with prize-giving for academic and character awards. Parents of award recipients will be notified.', 'School Field', future(45)],
  ['Cultural Day Festival', 'Students showcase Nigerian cultures through dance, dress, language and cuisine. Parents are warmly invited.', 'School Field', future(62)],
  ['JSS3 BECE Mock Examination', 'Mock Basic Education Certificate Examination for all JSS3 students. Timetable available from the Exams Office.', 'Junior Block', future(78)],
];
const evStmt = db.prepare('INSERT INTO events (title, description, location, starts_at) VALUES (?,?,?,?)');
events.forEach((e) => evStmt.run(...e));
console.log(`  • ${events.length} events`);

/* ------------------------------- STAFF ------------------------------ */
const staff = [
  ['Mrs. Ngozi Okeke', 'Principal', 'Administration', 'M.Ed Educational Administration, University of Nigeria Nsukka. Over 24 years in secondary education and nine years leading Bright Future.', 'principal@brightfuture.edu.ng'],
  ['Mr. Emeka Aniweta', 'Vice Principal (Academics)', 'Administration', 'M.Sc Mathematics. Oversees curriculum delivery, examinations and the Saturday revision programme.', 'vp.academics@brightfuture.edu.ng'],
  ['Mrs. Bisi Adeyemi', 'Vice Principal (Student Affairs)', 'Administration', 'B.Ed Guidance & Counselling. Responsible for discipline, welfare and the house system.', 'vp.students@brightfuture.edu.ng'],
  ['Dr. Ifeanyi Nwachukwu', 'Head of Science', 'Science', 'Ph.D Chemistry. Leads the science faculty and coaches the school\'s Science Fair team.', null],
  ['Mrs. Chioma Eze', 'Head of Mathematics', 'Mathematics', 'B.Sc Mathematics, M.Ed. Fifteen years preparing candidates for WAEC and JAMB mathematics.', null],
  ['Mr. Samuel Ogunleye', 'Head of Languages', 'Languages', 'M.A English Literature. Coordinates English, Literature, French and Igbo.', null],
  ['Mrs. Grace Uche', 'Head of Humanities', 'Humanities', 'B.A History & International Studies. Teaches Government and Civic Education.', null],
  ['Mr. Tunde Bakare', 'ICT Coordinator', 'ICT', 'B.Sc Computer Science. Runs the ICT centre, coding club and the school\'s digital systems.', null],
  ['Mrs. Halima Yusuf', 'School Counsellor', 'Student Support', 'M.Sc Educational Psychology. Provides academic guidance, career counselling and pastoral care.', null],
  ['Mr. Peter Okonkwo', 'Director of Sports', 'Sports', 'NIS-certified coach. Manages athletics, football, basketball and the inter-house sports festival.', null],
  ['Mrs. Adaeze Nnamdi', 'School Nurse', 'Student Support', 'RN, RM. Staffs the campus clinic and coordinates the annual health screening.', null],
  ['Mr. Joseph Adamu', 'Bursar', 'Administration', 'ICAN-chartered accountant managing school fees, payroll and procurement.', 'bursar@brightfuture.edu.ng'],
];
const stStmt = db.prepare('INSERT INTO staff (name, role, department, bio, email) VALUES (?,?,?,?,?)');
staff.forEach((s) => stStmt.run(...s));
console.log(`  • ${staff.length} staff members`);

/* ------------------------------ STUDENTS ---------------------------- */
const first = ['Chidera','Amaka','Tobenna','Kelechi','Ifeoma','Obinna','Nkiru','Uche','Adaeze','Emeka','Chinelo','Somto','Zainab','Daniel','Blessing','Victor','Chiamaka','Ikenna','Ruth','Samuel','Precious','Kingsley','Ngozi','Oluwaseun'];
const last = ['Obi','Nwosu','Eze','Anyanwu','Okafor','Udeh','Nnaji','Okeke','Ibe','Chukwu','Mbah','Agu','Balogun','Adeyemi','Onyeka','Ezenwa'];
const classes = ['JSS1','JSS2','JSS3','SS1','SS2','SS3'];
const stuStmt = db.prepare(
  `INSERT INTO students (admission_no, first_name, last_name, class_level, gender, guardian_name, guardian_phone)
   VALUES (?,?,?,?,?,?,?)`
);
let n = 0;
for (let i = 0; i < 60; i++) {
  const f = first[i % first.length];
  const l = last[(i * 7) % last.length];
  const cls = classes[i % classes.length];
  const gender = i % 2 === 0 ? 'Female' : 'Male';
  const adm = `BFC/${2020 + (i % 6)}/${String(1001 + i)}`;
  try {
    stuStmt.run(adm, f, l, cls, gender, `Mr. & Mrs. ${l}`, `+234 80${(3 + (i % 6))} ${String(1000000 + i * 7919).slice(0, 7)}`);
    n++;
  } catch { /* skip duplicate admission numbers */ }
}
console.log(`  • ${n} students`);

/* ----------------------------- ADMISSIONS --------------------------- */
const apps = [
  ['Chinaza Okoro', '2013-04-11', 'Female', 'JSS1', 'Mr. Paul Okoro', 'paul.okoro@example.com', '+234 802 445 1122', 'approved'],
  ['Ebube Nwankwo', '2012-11-02', 'Male', 'JSS2', 'Mrs. Rita Nwankwo', 'rita.n@example.com', '+234 706 998 2211', 'pending'],
  ['Fatima Bello', '2010-06-25', 'Female', 'SS1', 'Alhaji Musa Bello', 'm.bello@example.com', '+234 803 771 5566', 'pending'],
  ['Daniel Achebe', '2013-01-19', 'Male', 'JSS1', 'Dr. Ken Achebe', 'ken.achebe@example.com', '+234 809 223 8890', 'pending'],
];
const apStmt = db.prepare(
  `INSERT INTO admissions (student_name, date_of_birth, gender, class_applying, parent_name, email, phone, address, previous_school, status)
   VALUES (?,?,?,?,?,?,?,?,?,?)`
);
apps.forEach((a) => apStmt.run(a[0], a[1], a[2], a[3], a[4], a[5], a[6], 'Onitsha, Anambra State', 'Trinity Primary School', a[7]));
console.log(`  • ${apps.length} admission applications`);

/* ------------------------------ MESSAGES ---------------------------- */
const msgs = [
  ['Mrs. Chidinma Alozie', 'chidinma.a@example.com', 'Enquiry about boarding facilities', 'Good day. I would like to know whether boarding is available for JSS1 students and what the termly boarding fee covers. Thank you.'],
  ['Mr. Yusuf Ibrahim', 'yusuf.ibrahim@example.com', 'School bus route to GRA', 'Please does the school bus cover the GRA axis? We are relocating to Onitsha in September.'],
  ['Ada Umeh (Alumna, 2014)', 'ada.umeh@example.com', 'Alumni association', 'I would like to reconnect with the alumni association and support the science team travelling to Abuja.'],
];
const mStmt = db.prepare('INSERT INTO messages (name, email, subject, body) VALUES (?,?,?,?)');
msgs.forEach((m) => mStmt.run(...m));
console.log(`  • ${msgs.length} contact messages`);

/* ------------------------------ GALLERY ----------------------------- */
const gallery = [
  ['Main administrative block', 'Campus'], ['Senior secondary science laboratory', 'Facilities'],
  ['The new digital library', 'Facilities'], ['Inter-house sports opening parade', 'Sports'],
  ['Cultural day dance performance', 'Events'], ['Students in the ICT centre', 'Facilities'],
  ['Junior secondary classroom block', 'Campus'], ['Graduation ceremony, Class of 2025', 'Events'],
];
const gStmt = db.prepare('INSERT INTO gallery (caption, category, image) VALUES (?,?,?)');
gallery.forEach(([caption, category], i) => gStmt.run(caption, category, `/images/gallery-${i + 1}.jpg`));
console.log(`  • ${gallery.length} gallery items`);

console.log('\n✅ Seed complete.\n');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
