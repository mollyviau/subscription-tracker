import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// EDIT THESE THREE VALUES
// ─────────────────────────────────────────────────────────────
const AUTHOR = {
  name: "Molly Viau",
  linkedin: "https://www.linkedin.com/in/mollyviau/",
  website: "https://mollyviau.com",
};
// ─────────────────────────────────────────────────────────────

const STACK = [
  { name: "React + Vite", role: "Frontend framework and build tooling" },
  { name: "Tailwind CSS", role: "Styling and responsive layout" },
  { name: "Supabase", role: "PostgreSQL, authentication, row-level security" },
  { name: "Vercel", role: "Hosting and continuous deployment" },
];

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-semibold tracking-widest text-purple-300 uppercase mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white px-4 sm:px-6 md:px-8 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-2">
        About
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Know what you're paying for.
      </h1>
      <p className="text-gray-400 text-lg mb-10">
        SubTrack is a privacy-first subscription tracker. No bank linking, no
        transaction scraping — you enter what you pay for, and the app tells you
        what it's actually worth to you.
      </p>

      <Section title="The problem">
        <p className="text-gray-300 leading-relaxed">
          Recurring digital subscriptions accumulate quietly. Most tools that
          promise to help require linking a bank account, which hands over far
          more financial data than the task needs. The alternative most people
          fall back on — a spreadsheet, or memory — catches the cost of a
          subscription but never its value.
        </p>
      </Section>

      <Section title="The approach">
        <p className="text-gray-300 leading-relaxed mb-4">
          SubTrack asks one question the other tools don't: how often do you
          actually use this? Combining reported usage with cost produces a
          utility score from 0 to 100, roughly a cost-per-use measure. A $10
          service used daily scores well. A $45 gym used rarely does not, and
          gets flagged for review.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Everything is entered manually and stored under row-level security, so
          your data stays yours and no third party ever sees your bank.
        </p>
      </Section>

      <Section title="Built with">
        <div className="flex flex-col gap-2">
          {STACK.map((item) => (
            <div
              key={item.name}
              className="bg-[#111118] border border-white/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <span className="font-semibold text-white">{item.name}</span>
              <span className="text-sm text-gray-400">{item.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Who built it">
        <div className="bg-[#111118] border border-white/5 rounded-2xl px-5 py-5">
          <p className="text-xl font-bold text-white mb-1">{AUTHOR.name}</p>
          <p className="text-sm text-gray-400 mb-4">
            Design and development — architecture, database schema, utility
            score algorithm, and full application build.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={AUTHOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-purple-300 hover:text-purple-200 border border-purple-500/40 hover:border-purple-500/70 transition-colors px-4 py-2 rounded-lg"
            >
              LinkedIn
            </a>
            <a
              href={AUTHOR.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 transition-colors px-4 py-2 rounded-lg"
            >
              Personal site
            </a>
          </div>
        </div>
      </Section>

      <Section title="Project context">
        <p className="text-gray-300 leading-relaxed">
          SubTrack was developed as a capstone project for STY-4040 Software
          Product Development, under the team name Scope Creep Defenders. The
          coursework covered the full product lifecycle — project charter,
          feasibility analysis, data modelling, forms and reports specification,
          and this working implementation.
        </p>
      </Section>

      <div className="border-t border-white/5 pt-6 flex flex-wrap gap-3">
        <Link
          to="/demo"
          className="text-sm font-semibold bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors px-4 py-2 rounded-lg"
        >
          Try the demo
        </Link>
        <Link
          to="/signup"
          className="text-sm font-semibold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 transition-colors px-4 py-2 rounded-lg"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;
