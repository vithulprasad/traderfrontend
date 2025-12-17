import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Activity } from "lucide-react";
import TradeStats from "@/components/TradeStats";
import CandlestickChart from "@/components/CandlestickChart";
import VolumeChart from "@/components/VolumeChart";

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
  entryTime: string;  // ISO string or timestamp
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

    socket.on("tradeUpdate", (data: SocketData) => {
      setStats({
        totalTrades: data.totalTrades,
        winningTrades: data.winningTrades,
        losingTrades: data.losingTrades,
      });
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Trading Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time market analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">BTC/USD</span>
            {latestDataPoint && (
              <span className="font-mono text-lg font-semibold text-profit">
                ${latestDataPoint.close.toLocaleString()}
              </span>
            )}
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
        <div className="space-y-6">
          <CandlestickChart data={chartData} />
          <VolumeChart data={chartData} />
        </div>
      </main>
    </div>
  );
};

export default Index;
