import CallCard from "../components/CallCard";
import {
  ArrowRight,
  Bot,
  Database,
  PhoneCall,
  Sparkles,
  Waypoints,
  Phone,
} from "lucide-react";

const metricCardStyles = {
  total_calls: "from-cyan-400/20 to-cyan-400/5",
  active_calls: "from-emerald-400/20 to-emerald-400/5",
  resolved_calls: "from-amber-400/20 to-amber-400/5",
  escalated_calls: "from-rose-400/20 to-rose-400/5",
};

const Dashboard = ({
  summary,
  phoneNumber,
  onPhoneNumberChange,
  onMakeCall,
  callSubmitting,
  callAlert,
  latestCalls,
  selectedCall,
  conversation,
  onSelectCall,
}) => {
  const timeline = conversation?.logs?.length
    ? conversation.logs
    : latestCalls.slice(0, 4);

  return (
    <section id="dashboard" className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-100">
              <Sparkles size={14} />
              Live orchestration
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Waypoints size={14} />
              Customer {">"} Twilio {">"} FastAPI {">"} Groq {">"} MongoDB {">"}{" "}
              React
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/60">
                Support command center
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Real-time AI calling agent for customer support
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Twilio speech turns are captured by FastAPI, passed through Groq
                with call memory, stored in MongoDB, and pushed into this
                dashboard with live polling.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-cyan-400/15 bg-cyan-400/8 p-5">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Phone size={16} />
                  <p className="font-medium">Make outbound call</p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) =>
                      onPhoneNumberChange(event.target.value)
                    }
                    placeholder="+919876543210"
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-400/20"
                  />

                  <button
                    type="button"
                    onClick={onMakeCall}
                    disabled={callSubmitting}
                    className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {callSubmitting ? "Calling..." : "Call Customer"}
                  </button>
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-400">
                  Use E.164 format, for example +919876543210. Twilio must be
                  configured with a valid outbound number and public webhook
                  URL.
                </p>

                {callAlert && (
                  <div
                    className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${callAlert.type === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100" : "border-rose-400/20 bg-rose-400/10 text-rose-100"}`}
                  >
                    {callAlert.message}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-200">
                  <PhoneCall size={15} className="text-cyan-300" />
                  Voice webhook ready
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-200">
                  <Bot size={15} className="text-emerald-300" />
                  AI conversation memory
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-200">
                  <Database size={15} className="text-amber-300" />
                  Mongo call archive
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Workflow
              </p>
              <div className="mt-4 space-y-3">
                {[
                  [
                    "Customer speaks",
                    "Twilio speech recognition captures the question.",
                  ],
                  [
                    "FastAPI webhook",
                    "The backend receives the transcript and call metadata.",
                  ],
                  [
                    "Groq response",
                    "The AI produces a concise support answer.",
                  ],
                  [
                    "Dashboard sync",
                    "MongoDB and React refresh the live timeline.",
                  ],
                ].map(([title, description], index) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-sm text-cyan-200">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {[
            {
              key: "total_calls",
              label: "Total calls",
              value: summary?.total_calls ?? 0,
              tone: "text-cyan-200",
            },
            {
              key: "active_calls",
              label: "Active calls",
              value: summary?.active_calls ?? 0,
              tone: "text-emerald-200",
            },
            {
              key: "resolved_calls",
              label: "Resolved",
              value: summary?.resolved_calls ?? 0,
              tone: "text-amber-200",
            },
            {
              key: "escalated_calls",
              label: "Escalated",
              value: summary?.escalated_calls ?? 0,
              tone: "text-rose-200",
            },
          ].map((metric) => (
            <div
              key={metric.key}
              className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${metricCardStyles[metric.key]} p-5 shadow-lg shadow-slate-950/20`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
                {metric.label}
              </p>
              <p className={`mt-4 text-4xl font-semibold ${metric.tone}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Live call stream
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Most recent voice turns
              </h3>
            </div>
            <ArrowRight className="text-slate-500" />
          </div>

          <div className="mt-5 space-y-4">
            {(latestCalls?.length ? latestCalls : [])
              .slice(0, 6)
              .map((call) => (
                <CallCard
                  key={`${call.call_sid}-${call.created_at}`}
                  call={call}
                  compact
                  active={selectedCall?.call_sid === call.call_sid}
                  onClick={() => onSelectCall(call.call_sid)}
                />
              ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Conversation memory
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {selectedCall?.customer_number || "Select a call to inspect"}
          </h3>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Memory summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {conversation?.memory?.summary ||
                "The conversation memory will appear here once a call is selected."}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {(timeline || []).slice(-4).map((turn, index) => (
              <div
                key={`${turn.created_at || index}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span>Turn {index + 1}</span>
                  <span>
                    {turn.created_at
                      ? new Date(turn.created_at).toLocaleTimeString()
                      : "--"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  <span className="text-slate-400">Customer:</span>{" "}
                  {turn.customer_message || turn.user || "—"}
                </p>
                <p className="mt-2 text-sm leading-6 text-cyan-100">
                  <span className="text-slate-400">Buddy AI:</span>{" "}
                  {turn.ai_response || turn.assistant || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
