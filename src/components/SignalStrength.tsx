import React, { useEffect, useState } from "react";
import { getSignalDetails } from "../Api/apis";

interface SignalDetail {
  _id: string;
  direction: string;
  signalTime: string;
  price: number;
  strength: string;
  signal: string;
}

interface Pagination {
  totalPages: number;
  totalRecords: number;
}

interface ApiResponse {
  data: SignalDetail[];
  pagination: Pagination;
}

interface Props {
  liveSignal?: SignalDetail;
}

const strengthColorMap: { [key: string]: string } = {
  strong: "text-[#00ff00]",
  medium: "text-[#ffff00]",
  weak: "text-[#ff3333]",
};

const strengthBgMap: { [key: string]: string } = {
  strong: "bg-[#00ff00]/10 border-l-4 border-[#00ff00]",
  medium: "bg-[#ffff00]/10 border-l-4 border-[#ffff00]",
  weak: "bg-[#ff3333]/10 border-l-4 border-[#ff3333]",
};

function SignalStrength({ liveSignal }: Props) {
  const [signals, setSignals] = useState<SignalDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count,setCount] = useState(0)
  const limit = 10;

  // 🔹 Filters
  const [direction, setDirection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  const fetchSignals = async () => {
    const strength = "";
    const price = 0;
    setLoading(true);
    try {
      const res = await getSignalDetails({
        startDate,
        endDate,
        strength,
        price,
        page,
        limit,
        direction
      });

      const response: ApiResponse = res.data;
      setSignals(response.data);
      setTotalPages(response.pagination.totalPages);
      setCount(response.pagination.totalRecords)
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [page, direction, startDate, endDate]);

  /* ---------------- LIVE SIGNAL PUSH ---------------- */
  useEffect(() => {
    if (liveSignal) {
      setSignals((prev) => [liveSignal, ...prev.slice(0, limit - 1)]);
    }
  }, [liveSignal]);

  const resetFilters = () => {
    setDirection("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff3333] border-r-transparent"></div>
          <p className="mt-3 text-slate-400">Loading signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent border border-[#333] shadow-lg">
      {/* ---------------- HEADER ---------------- */}
      <div className="border-b border-[#333] bg-[#111] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Signal Strength</h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchSignals}
              className="px-4 py-2 bg-[#222] text-white text-sm font-medium border border-[#333] hover:bg-[#2a2a2a] active:scale-95 transition-all"
            >
              Refresh
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#222] text-white text-sm font-medium border border-[#333] hover:bg-[#2a2a2a] active:scale-95 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ---------------- FILTERS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-xs text-slate-400 mb-2">Direction</label>
            <select
              value={direction}
              onChange={(e) => {
                setPage(1);
                setDirection(e.target.value);
              }}
              className="w-full bg-[#111] border border-[#333] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#ff3333]"
            >
              <option value="">All Directions</option>
              <option value="BUY">BUY</option>
              <option value="NEUTRAL">SELL</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setPage(1);
                setStartDate(e.target.value);
              }}
              className="w-[95%] bg-[#111] border border-[#333] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#00ff00]"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setPage(1);
                setEndDate(e.target.value);
              }}
              className="w-[95%] bg-[#111] border border-[#333] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#00ff00]"
            />
          </div>
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#111] border-b border-[#333]">
            <tr className="text-sm text-slate-400 uppercase tracking-wider">
              <th className="text-left p-4 font-semibold">Direction</th>
              <th className="text-left p-4 font-semibold">Time</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Strength</th>
            </tr>
          </thead>

          <tbody>
            {signals.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              signals.map((signal) => (
                <tr 
                  key={signal._id} 
                  className={`border-b border-[#222] hover:bg-[#111] transition-colors ${strengthBgMap[signal.strength]}`}
                >
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 text-sm font-bold ${
                      signal.signal === 'BUY' 
                        ? 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30' 
                        : 'bg-[#ff3333]/20 text-[#ff3333] border border-[#ff3333]/30'
                    }`}>
                      {signal.signal}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">
                    <div className="font-medium">
                      {new Date(signal.signalTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(signal.signalTime).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white text-lg">
                    {signal.price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className={`text-sm font-bold ${strengthColorMap[signal.strength]}`}>
                      {signal.strength.toUpperCase()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#111] border-t border-[#333]">
        <div className="text-sm text-slate-400 flex justify-between">
          <div>
  Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
          </div>
        <div>
            Total Records :<span className="font-bold text-white">{count}</span>
        </div>
        </div>
        
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-[#222] text-white text-sm font-medium border border-[#333] hover:bg-[#2a2a2a] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-[#222] text-white text-sm font-medium border border-[#333] hover:bg-[#2a2a2a] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 

export default SignalStrength;