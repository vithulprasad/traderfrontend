import React, { useEffect, useState } from "react";
import { getSignalDetails } from "../Api/apis";

interface SignalDetail {
  _id: string;
  direction: string;
  signalTime: string;
  price: number;
  strength: string;
}

interface Pagination {
  totalPages: number;
}

interface ApiResponse {
  data: SignalDetail[];
  pagination: Pagination;
}

interface Props {
  liveSignal?: SignalDetail;
}

const strengthColorMap: { [key: string]: string } = {
  strong: "text-green-400",
  medium: "text-yellow-400",
  weak: "text-red-400",
};

function SignalStrength({ liveSignal }: Props) {
  const [signals, setSignals] = useState<SignalDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // 🔹 Filters
  const [direction, setDirection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  const fetchSignals = async () => {
    setLoading(true);
    try {
      const res = await getSignalDetails({
        page,
        limit,
        direction,
        startDate,
        endDate,
      });

      const response: ApiResponse = res.data;

      setSignals(response.data);
      setTotalPages(response.pagination.totalPages);
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

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading signals...</div>;

  return (
    <div className="bg-slate-900 shadow-2xl rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          {/* ---------------- HEADER WITH FILTERS ---------------- */}
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3">
                <select
                  value={direction}
                  onChange={(e) => {
                    setPage(1);
                    setDirection(e.target.value);
                  }}
                  className="w-full bg-slate-700 border border-slate-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm"
                >
                  <option value="">All Directions</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setPage(1);
                    setStartDate(e.target.value);
                  }}
                  className="w-full bg-slate-700 border border-slate-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm"
                />
              </th>

              <th className="px-6 py-3">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setPage(1);
                    setEndDate(e.target.value);
                  }}
                  className="w-full bg-slate-700 border border-slate-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm"
                />
              </th>

              <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">
                Filters
              </th>
            </tr>

            <tr className="bg-slate-800/50 text-slate-200 uppercase text-xs leading-normal border-b border-slate-700">
              <th className="px-6 py-3 font-bold">Direction</th>
              <th className="px-6 py-3 font-bold">Time</th>
              <th className="px-6 py-3 font-bold">Price</th>
              <th className="px-6 py-3 font-bold">Strength</th>
            </tr>
          </thead>

          {/* ---------------- BODY ---------------- */}
          <tbody className="text-slate-300 text-sm font-light">
            {signals.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              signals.map((signal) => (
                <tr key={signal._id} className="border-b border-slate-700 hover:bg-slate-800 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      signal.direction === 'BUY' 
                        ? 'bg-green-900/30 text-green-400 border border-green-800' 
                        : 'bg-red-900/30 text-red-400 border border-red-800'
                    }`}>
                      {signal.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(signal.signalTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {signal.price}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${
                      strengthColorMap[signal.strength]
                    }`}
                  >
                    {signal.strength.toUpperCase()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-between items-center p-4 bg-slate-800 border-t border-slate-700">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 rounded-lg text-sm font-medium text-white shadow-lg hover:from-slate-600 hover:to-slate-700 active:shadow-inner active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Prev
        </button>

        <span className="text-sm text-slate-400">
          Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 rounded-lg text-sm font-medium text-white shadow-lg hover:from-slate-600 hover:to-slate-700 active:shadow-inner active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SignalStrength;
