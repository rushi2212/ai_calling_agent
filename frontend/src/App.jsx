import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Calls from "./pages/Calls";
import Analytics from "./pages/Analytics";
import {
  fetchConversation,
  fetchDashboardSummary,
  fetchHealth,
  fetchRecentCalls,
  makeOutboundCall,
} from "./services/api";

const emptySummary = {
  total_calls: 0,
  active_calls: 0,
  resolved_calls: 0,
  escalated_calls: 0,
  total_turns: 0,
  average_turns: 0,
  resolution_rate: 0,
  latest_activity: [],
};

function App() {
  const [summary, setSummary] = useState(emptySummary);
  const [calls, setCalls] = useState([]);
  const [selectedCallSid, setSelectedCallSid] = useState("");
  const [conversation, setConversation] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [lastUpdated, setLastUpdated] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callSubmitting, setCallSubmitting] = useState(false);
  const [callAlert, setCallAlert] = useState(null);

  const loadDashboard = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const [summaryResponse, callsResponse, healthResponse] =
        await Promise.all([
          fetchDashboardSummary(),
          fetchRecentCalls(),
          fetchHealth(),
        ]);

      const nextSummary = summaryResponse.data || emptySummary;
      const nextCalls = callsResponse.data || [];

      setSummary({
        ...emptySummary,
        ...nextSummary,
        latest_activity: nextSummary.latest_activity || [],
      });
      setCalls(nextCalls);
      setBackendStatus(healthResponse.data?.status || "online");
      setLastUpdated(new Date().toLocaleTimeString());

      if (nextCalls.length > 0) {
        setSelectedCallSid(
          (currentSelectedCallSid) =>
            currentSelectedCallSid || nextCalls[0].call_sid,
        );
      }
    } catch (error) {
      setBackendStatus("offline");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const intervalId = setInterval(() => {
      loadDashboard(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!selectedCallSid) {
      setConversation(null);
      return;
    }

    const loadConversation = async () => {
      try {
        const response = await fetchConversation(selectedCallSid);
        setConversation(response.data || null);
      } catch (error) {
        console.log(error);
      }
    };

    loadConversation();
  }, [selectedCallSid]);

  const selectedCall =
    calls.find((call) => call.call_sid === selectedCallSid) || null;

  const handleSelectCall = (callSid) => {
    setSelectedCallSid(callSid);
  };

  const handleMakeCall = async () => {
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!trimmedPhoneNumber) {
      setCallAlert({
        type: "error",
        message:
          "Enter a phone number in E.164 format, for example +919876543210.",
      });
      return;
    }

    setCallSubmitting(true);
    setCallAlert(null);

    try {
      const response = await makeOutboundCall(trimmedPhoneNumber);
      setCallAlert({
        type: "success",
        message: `Call initiated successfully for ${response.data?.phone_number || trimmedPhoneNumber}.`,
      });
      setPhoneNumber("");
      await loadDashboard(true);
    } catch (error) {
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error.message;
      setCallAlert({
        type: "error",
        message: detail || "Failed to initiate the call.",
      });
    } finally {
      setCallSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar
            summary={summary}
            status={backendStatus}
            lastUpdated={lastUpdated}
            onRefresh={() => loadDashboard(false)}
          />

          <main className="space-y-2 pb-10">
            {loading && (
              <div className="px-4 pt-6 text-sm text-slate-400 sm:px-6 lg:px-8">
                Loading live call data...
              </div>
            )}

            <Dashboard
              summary={summary}
              latestCalls={calls}
              selectedCall={selectedCall}
              conversation={conversation}
              onSelectCall={handleSelectCall}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={setPhoneNumber}
              onMakeCall={handleMakeCall}
              callSubmitting={callSubmitting}
              callAlert={callAlert}
            />

            <Calls
              calls={calls}
              onSelectCall={handleSelectCall}
              selectedCall={selectedCall}
              filter={filter}
              onFilterChange={setFilter}
            />

            <Analytics summary={summary} calls={calls} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
