import { RefreshCcw, ShieldCheck, Waves } from "lucide-react";

const Navbar = ({ summary, status, lastUpdated, onRefresh }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
            <Waves size={14} />
            Real-time support operations
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            AI customer support calling agent
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Twilio voice calls are processed by FastAPI, answered by Groq, and
            written to MongoDB for live dashboard tracking.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Backend
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm text-white">
              <ShieldCheck size={16} className="text-emerald-300" />
              <span>{status || "Checking"}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Live calls
            </p>
            <p className="mt-2 text-lg font-semibold text-cyan-300">
              {summary?.active_calls ?? 0}
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/15 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/20"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
          Total calls: {summary?.total_calls ?? 0}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
          Resolution rate: {summary?.resolution_rate ?? 0}%
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
          Last refresh: {lastUpdated || "--"}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
