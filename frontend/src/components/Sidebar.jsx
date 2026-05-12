import { Activity, BarChart3, Brain, Phone, Radio } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col justify-between border-r border-white/10 bg-slate-950/85 p-6 backdrop-blur xl:flex">
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/20">
            <Radio size={20} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/60">
              Live Support Stack
            </p>
            <h2 className="text-xl font-semibold text-white">
              Buddy AI Calling Agent
            </h2>
          </div>
        </div>

        <nav className="space-y-3 text-sm">
          <a
            className="flex items-center gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/8 px-4 py-3 text-cyan-50 transition hover:border-cyan-300/40 hover:bg-cyan-400/12"
            href="#dashboard"
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </a>

          <a
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-white/20 hover:bg-white/8"
            href="#calls"
          >
            <Phone size={18} />
            <span>Live Calls</span>
          </a>

          <a
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-white/20 hover:bg-white/8"
            href="#analytics"
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </a>
        </nav>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <div className="mb-3 flex items-center gap-2 text-cyan-300">
          <Brain size={16} />
          <span className="font-medium">AI memory active</span>
        </div>
        <p className="leading-6 text-slate-300/90">
          Twilio speech turns, Groq responses, and MongoDB logs are synced into
          a single support timeline.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
