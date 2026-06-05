export default function App() {
  const weeks = [
    { num: "W1", title: "Foundation & setup", desc: "Scaffold app, configure Supabase, DB table, env vars", status: "← here", active: true },
    { num: "W2", title: "Auth + CRUD", desc: "Login/signup pages, subscription form, add & delete", status: "up next", active: false },
    { num: "W3", title: "Dashboard + UI", desc: "Monthly total, edit modal, polish Tailwind styles", status: "soon™", active: false },
    { num: "W4", title: "Deploy + docs", desc: "Live on Vercel, final docs, submit", status: "finish line", active: false },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="flex gap-2 mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-50 text-pink-700 uppercase tracking-wide">🚧 In progress</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">Week 1 of 4</span>
        </div>

        <h1 className="text-4xl font-black leading-tight">Subscription<br />Fatigue Tracker</h1>
        <p className="text-gray-500 font-semibold mt-2">A web app to log, track & tame your recurring subscriptions — built by yours truly 👋</p>

        <hr className="my-6 border-gray-100" />

        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">Overall progress</p>
        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-1">
          <span>Week 1 — Foundation</span>
          <span className="text-teal-600 font-bold">25%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
        </div>

        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mt-6 mb-3">4-week plan</p>
        <div className="flex flex-col gap-3">
          {weeks.map((w) => (
            <div key={w.num} className={`flex items-start gap-3 p-4 rounded-xl border ${w.active ? "border-teal-500 border-2" : "border-gray-100"} bg-white`}>
              <span className="font-mono text-xs font-bold text-gray-400 pt-0.5 w-8 shrink-0">{w.num}</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800 mb-0.5">{w.title}</p>
                <p className="text-xs text-gray-500">{w.desc}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${w.active ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-500"}`}>{w.status}</span>
            </div>
          ))}
        </div>

        <hr className="my-6 border-gray-100" />

        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Built with</p>
        <div className="flex flex-wrap gap-2">
          {["React + Vite", "Tailwind CSS", "Supabase", "Vercel"].map((t) => (
            <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-700">{t}</span>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 font-semibold mt-6">Check back soon — this thing is getting built! 🔧</p>
      </div>
    </div>
  );
}

