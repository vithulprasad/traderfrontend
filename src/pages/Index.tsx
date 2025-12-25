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
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                getLive();
              }}
              className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.00024 13.0225C8.18522 12.2429 11.7559 15.8146 10.9774 20.9996M3.00024 8.03784C10.938 7.25824 16.7417 13.0619 15.9621 20.9997M3.00024 3.05212C13.6919 2.27364 21.7264 10.3082 20.948 20.9998M5 21C3.89566 21 3 20.1043 3 19C3 17.8957 3.89566 17 5 17C6.10434 17 7 17.8957 7 19C7 20.1043 6.10434 21 5 21Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Vidhul TRADE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">BTC</span>

            <span className="font-mono text-lg font-semibold text-profit">
              ${live_price}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
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
