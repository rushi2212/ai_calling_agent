import {
  CheckCircle2,
  Gauge,
  GitCompareArrows,
  TrendingUp,
} from "lucide-react";

const Analytics = ({ summary, calls }) => {
  const pipeline = [
    {
      label: "Voice turns",
      value: summary?.total_turns ?? 0,
      icon: TrendingUp,
      color: "text-cyan-200",
    },
    {
      label: "Resolution rate",
      value: `${summary?.resolution_rate ?? 0}%`,
      icon: CheckCircle2,
      color: "text-emerald-200",
    },
    {
      label: "Average turns",
      value: summary?.average_turns ?? 0,
      icon: Gauge,
      color: "text-amber-200",
    },
    {
      label: "Escalations",
      value: summary?.escalated_calls ?? 0,
      icon: GitCompareArrows,
      color: "text-rose-200",
    },
  ];

  return (
    <section id="analytics" className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Analytics
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Operational performance snapshot
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pipeline.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span className="text-xs uppercase tracking-[0.28em]">
                    {item.label}
                  </span>
                  <Icon size={16} className={item.color} />
                </div>
                <p className={`mt-4 text-3xl font-semibold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Call status mix
            </p>
            <div className="mt-5 space-y-4">
              {[
                ["in-progress", summary?.active_calls ?? 0, "bg-cyan-400/80"],
                ["resolved", summary?.resolved_calls ?? 0, "bg-emerald-400/80"],
                ["escalated", summary?.escalated_calls ?? 0, "bg-amber-400/80"],
              ].map(([label, value, bar]) => {
                const total = calls?.length || 1;
                const width = `${Math.max(8, Math.min(100, Math.round((Number(value) / total) * 100)))}%`;

                return (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                      <span className="capitalize">{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className={`h-3 rounded-full ${bar}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Conversation flow
            </p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <p>
                1. Twilio collects the caller's speech and sends the transcript
                to FastAPI.
              </p>
              <p>
                2. Groq uses the last turns and memory summary to shape the next
                response.
              </p>
              <p>
                3. MongoDB stores the transcript, AI reply, and call status for
                review.
              </p>
              <p>
                4. React polls the backend, so the dashboard stays current
                without a manual refresh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
