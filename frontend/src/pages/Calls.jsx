import { Filter, Search } from "lucide-react";
import CallCard from "../components/CallCard";

const statusFilters = ["all", "in-progress", "resolved", "escalated"];

const Calls = ({
  calls,
  onSelectCall,
  selectedCall,
  filter,
  onFilterChange,
}) => {
  const visibleCalls =
    filter === "all" ? calls : calls.filter((call) => call.status === filter);

  return (
    <section id="calls" className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Call history
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Recent support conversation turns
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-400">
              <Search size={16} />
              <span>{visibleCalls.length} logs visible</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-400">
              <Filter size={16} />
              <span>Filter by status</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {statusFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onFilterChange(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${filter === item ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8"}`}
            >
              {item === "all" ? "All logs" : item}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {visibleCalls.length ? (
            visibleCalls.map((call) => (
              <CallCard
                key={`${call.call_sid}-${call.created_at}`}
                call={call}
                active={selectedCall?.call_sid === call.call_sid}
                onClick={() => onSelectCall(call.call_sid)}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-slate-400">
              No logs match the current filter yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Calls;
