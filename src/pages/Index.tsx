import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Activity } from "lucide-react";
import TradeStats from "@/components/TradeStats";
import CandlestickChart from "@/components/CandlestickChart";
import SignalStrength from "@/components/SignalStrength";
import { broadcastTradeDetails } from "../Api/apis.js";
import VolumeChart from "@/components/VolumeChart";
import Trade from "@/components/Trade";
// --- Type Definitions ---
interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradeStatsData {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate?: number;
  most_buy_direction?: string;
  most_sell_direction?: string;
  pending_orders?: PendingOrder;
  totalLose?: number;
}
interface PendingOrder {
  entryPrice: number;
  exitPrice?: number;
  direction: "BUY" | "SELL";
  stopLoss: number;
  target: number;
  currentStatus: "PENDING" | "OPEN" | "CLOSED" | "CANCELLED";
  tradeStatus: "WIN" | "LOSS" | "RUNNING" | "BREAKEVEN";
  signalType: string; // EMA, RSI, MACD, etc.
  entryTime: string; // ISO string or timestamp
}

// This should match the structure of the data emitted from your server
interface SocketData {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate?: number;
  most_buy_direction?: string;
  most_sell_direction?: string;
  pending_orders?: PendingOrder;
  totalLose?: number;
}

const Index = () => {
  const [stats, setStats] = useState<TradeStatsData>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    most_buy_direction: "N/A",
    most_sell_direction: "N/A",
    pending_orders: null,
    totalLose: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [live_price, set_live_price] = useState(0);
  const storeLast10 = (data: ChartData) => {
    setChartData((prev) => [...prev.slice(-30), data]);
  };

  useEffect(() => {
    // Connect to your Socket.IO server
    // const socket = io("http://localhost:5000"); // <-- IMPORTANT: Change to your server URL
    const socket = io("https://tradebackend-rd9x.onrender.com"); // <-- IMPORTANT: Change to your server URL

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    // Listen for the data stream
    socket.on("tradeDetails", (data: SocketData) => {
      console.log(data, "this is the details---");
      setStats({
        totalTrades: data.totalTrades,
        winningTrades: data.winningTrades,
        losingTrades: data.losingTrades,
        winRate: data.winRate,
        most_buy_direction: data.most_buy_direction,
        most_sell_direction: data.most_sell_direction,
        pending_orders: data.pending_orders,
        totalLose: data.totalLose,
      });
      // setChartData(data.chartData);
    });
    socket.on("binance_kline", (data: ChartData) => {
      const formattedData: ChartData = {
        time: new Date(data.time).toISOString(), // convert timestamp
        open: Number(data.open),
        high: Number(data.high),
        low: Number(data.low),
        close: Number(data.close),
        volume: Number(data.volume),
      };

      storeLast10(formattedData);
    });

    socket.on("binance_price", (data: number) => {
      console.log("live price");
      set_live_price(data);
    });
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  const latestDataPoint =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const getLive = async () => {
    const res = await broadcastTradeDetails();
    const data = await res.json();

    setStats({
      totalTrades: data?.totalTrades ?? null,
      winningTrades: data?.winningTrades ?? null,
      losingTrades: data?.losingTrades ?? null,
      winRate: data?.winRate ?? null,
      most_buy_direction: data?.most_buy_direction ?? null,
      most_sell_direction: data?.most_sell_direction ?? null,
      pending_orders: data?.pending_orders ?? null,
      totalLose: data?.totalLose ?? null,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
<header className="bg-black border-b border-gray-800 px-4 py-3 sticky top-0 z-50">
  <div className="flex items-center justify-between">
    {/* Left: Logo & Brand */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => getLive()}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 
                 border border-blue-500/30 flex items-center justify-center
                 active:scale-95 transition-transform"
      >
        <img 
          width={20}
          height={20}
          className="rounded"
          src="https://i.pinimg.com/736x/1b/5b/9a/1b5b9a435c589b2147e0c4e1ce7759b0.jpg" 
          alt="Logo" 
        />
      </button>
      
      <div>
        <h1 className="text-lg font-bold text-white">VIDHUL TRADE</h1>
        <p className="text-xs text-gray-400">Live Trading</p>
      </div>
    </div>

    {/* Right: BTC Price */}
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <span className="text-xs font-bold text-yellow-400">₿</span>
        </div>
        <span className="text-sm text-gray-300">BTC</span>
      </div>
          <button
      onClick={() => getLive()}
      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refresh
    </button>

    </div>
  </div>


</header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 py-2">              
        {/* Trade Statistics */}
        <TradeStats
          totalTrades={stats.totalTrades}
          winningTrades={stats.winningTrades}
          losingTrades={stats.losingTrades}
          winRate={stats.winRate}
          most_buy_direction={stats.most_buy_direction}
          most_sell_direction={stats.most_sell_direction}
          pending_orders={stats.pending_orders}
          totalLose={stats.totalLose}
        />
        {/* Charts */}
        <div className="my-2">
          <SignalStrength />
        </div>

        <div className="my-2">
          <Trade />
        </div>
        {/* <div className="space-y-6">
          <CandlestickChart data={chartData} />
          <VolumeChart data={chartData} />
        </div> */}
      </main>
    </div>
  );
};

export default Index;
