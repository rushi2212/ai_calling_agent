const statusStyles = {
  resolved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  escalated: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  "in-progress": "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
};

const CallCard = ({ call, onClick, active = false, compact = false }) => {
  const shortCallSid = call?.call_sid ? call.call_sid.slice(-8) : "unknown";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-5 text-left transition duration-200 ${active ? "border-cyan-300/50 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Call {shortCallSid}
          </p>
          <h3 className="mt-2 text-base font-semibold text-white">
            {call.customer_number || "Unknown customer"}
          </h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[call.status] || statusStyles["in-progress"]}`}
        >
          {call.status || "in-progress"}
        </span>
      </div>

      <div
        className={
          compact
            ? "mt-3 space-y-3 text-sm text-slate-200"
            : "mt-4 space-y-4 text-sm text-slate-200"
        }
      >
        <p className="leading-6 text-slate-300">
          <span className="font-medium text-slate-100">Customer:</span>{" "}
          {call.customer_message || "Waiting for the first spoken turn."}
        </p>
        <p className="leading-6 text-slate-300">
          <span className="font-medium text-cyan-200">Buddy AI:</span>{" "}
          {call.ai_response ||
            "AI response will appear here after the first turn."}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="rounded-full border border-white/10 px-2.5 py-1">
          Turn {call.turns ?? 1}
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-1">
          {call.created_at
            ? new Date(call.created_at).toLocaleTimeString()
            : "--"}
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-1">
          {call.event_type || "turn"}
        </span>
      </div>
    </button>
  );
};

export default CallCard;
