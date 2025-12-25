import React, { useEffect, useState } from "react";
import { getTradeDetails } from "../Api/apis";

interface Trade {
  _id: string;
  entryPrice: number;
  exitPrice: number | null;
  direction: string;
  stopLoss: number;
  target: number;
  tradedQuantity: number;
  currentStatus: string;
  tradeStatus: string;
  profitLoss: number;
  entryTime: string;
  exitTime: string | null;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
}

interface ApiResponse {
  data: Trade[];
  pagination: Pagination;
}

const statusColorMap: Record<string, string> = {
  WINNER: "text-[#00ff00]",
  LOSER: "text-[#ff3333]",
  OPEN: "text-[#ffff00]",
};

const statusBgMap: Record<string, string> = {
  WINNER: "bg-[#00ff00]/10 border-l-4 border-[#00ff00]",
  LOSER: "bg-[#ff3333]/10 border-l-4 border-[#ff3333]",
  OPEN: "bg-[#ffff00]/10 border-l-4 border-[#ffff00]",
};

function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Filters
  const [direction, setDirection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await getTradeDetails({
        page,
        limit,
        direction,
        startDate,
        endDate,
      });

      const response: ApiResponse = res.data;
      setTrades(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch trades", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [page, direction, startDate, endDate]);

  const resetFilters = () => {
    setDirection("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff3333] border-r-transparent"></div>
          <p className="mt-3 text-slate-400">Loading trades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-[#333] shadow-lg">
      {/* ---------------- HEADER ---------------- */}
      <div className="border-b border-[#333] bg-[#111] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Trade History</h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchTrades}
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
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
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
              <th className="text-left p-4 font-semibold">Entry Time</th>
              <th className="text-left p-4 font-semibold">Exit Time</th>
              <th className="text-left p-4 font-semibold">Entry</th>
              <th className="text-left p-4 font-semibold">Exit</th>
              <th className="text-left p-4 font-semibold">P/L</th>
              <th className="text-left p-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {trades.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <tr 
                  key={trade._id} 
                  className={`border-b border-[#222] hover:bg-[#111] transition-colors ${statusBgMap[trade.tradeStatus]}`}
                >
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 text-sm font-bold ${
                      trade.direction === 'LONG'
                        ? 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30'
                        : 'bg-[#ff3333]/20 text-[#ff3333] border border-[#ff3333]/30'
                    }`}>
                      {trade.direction}
                    </span>
                  </td>

                  <td className="p-4 text-slate-300 text-sm">
                    <div className="font-medium">
                      {new Date(trade.entryTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(trade.entryTime).toLocaleTimeString()}
                    </div>
                  </td>

                  <td className="p-4 text-slate-300 text-sm">
                    {trade.exitTime ? (
                      <>
                        <div className="font-medium">
                          {new Date(trade.exitTime).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(trade.exitTime).toLocaleTimeString()}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>

                  <td className="p-4 font-bold text-white">
                    {formatCurrency(trade.entryPrice)}
                  </td>

                  <td className="p-4 font-bold text-white">
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </td>

                  <td className={`p-4 font-bold ${trade.profitLoss >= 0 ? 'text-[#00ff00]' : 'text-[#ff3333]'}`}>
                    {trade.profitLoss ? (trade.profitLoss >= 0 ? '+' : '') + formatCurrency(trade.profitLoss) : '-'}
                  </td>

                  <td className="p-4">
                    <div className={`text-sm font-bold ${statusColorMap[trade.tradeStatus]}`}>
                      {trade.tradeStatus}
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
        <div className="text-sm text-slate-400">
          Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
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

export default TradeHistory;