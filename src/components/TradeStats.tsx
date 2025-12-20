import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface TradeStatsProps {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number | 0;
  most_buy_direction: string;
  most_sell_direction: string;
  pending_orders: PendingOrder;
  totalLose: number;
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

const TradeStats = ({
  totalTrades,
  winningTrades,
  losingTrades,
  winRate,
  most_buy_direction,
  most_sell_direction,
  pending_orders,
  totalLose,
}: TradeStatsProps) => {

  return (
    <div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Total Trades */}
      <div className="gradient-card border border-border rounded-lg p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">
            Total Trades
          </span>
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold font-mono text-foreground animate-count-up">
          {totalTrades}
        </p>
      </div>

      {/* Winning Trades */}
      <div
        className="gradient-profit border border-profit/20 rounded-lg p-6 glow-profit animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-profit/80 text-sm font-medium">
            Winning Trades
          </span>
          <TrendingUp className="w-5 h-5 text-profit" />
        </div>
        <p className="text-3xl font-bold font-mono text-profit animate-count-up">
          {winningTrades}
        </p>
      </div>

      {/* Losing Trades */}
      <div
        className="gradient-loss border border-loss/20 rounded-lg p-6 glow-loss animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-loss/80 text-sm font-medium">
            Losing Trades
          </span>
          <TrendingDown className="w-5 h-5 text-loss" />
        </div>
        <p className="text-3xl font-bold font-mono text-loss animate-count-up">
          {losingTrades}
        </p>
      </div>

      {/* Win Rate */}
      <div
        className="gradient-card border border-border rounded-lg p-6 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">
            Win Rate
          </span>
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">%</span>
          </div>
        </div>
        <p
          className={`text-3xl font-bold font-mono animate-count-up ${
            winRate >= 50 ? "text-profit" : "text-loss"
          }`}
        >
          {winRate}%
        </p>
      </div>
    </div>
 {/* ----------------------------------------------------------------------------- */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Total Trades */}
      <div className="gradient-card border border-border rounded-lg p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">
            Long Position Count
          </span>
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold font-mono text-foreground animate-count-up">
          {most_buy_direction}
        </p>
      </div>

      {/* Winning Trades */}
      <div
        className="gradient-profit border border-profit/20 rounded-lg p-6 glow-profit animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-profit/80 text-sm font-medium">
            Shot Position Count
          </span>
          <TrendingUp className="w-5 h-5 text-profit" />
        </div>
        <p className="text-3xl font-bold font-mono text-profit animate-count-up">
          {most_sell_direction}
        </p>
      </div>

      {/* Losing Trades */}
      <div
        className="gradient-loss border border-loss/20 rounded-lg p-6 glow-loss animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-loss/80 text-sm font-medium">
            Total Lose
          </span>
          <TrendingDown className="w-5 h-5 text-loss" />
        </div>
        <p className="text-3xl font-bold font-mono text-loss animate-count-up">
          {totalLose}
        </p>
      </div>

      {/* Win Rate */}
      {
        pending_orders ? 
            <div
        className="gradient-card border border-border rounded-lg p-6 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">
          Pending Order
          </span>
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">%</span>
          </div>
        </div>
        <div>
           Entry Price: {pending_orders?.entryPrice}
          <br />
          Exit Price: {pending_orders?.exitPrice}
          <br />
          Direction: {pending_orders?.direction}
          <br />
          Stop Loss: {pending_orders?.stopLoss}
          <br />
          Target: {pending_orders?.target}
          <br />
          Current Status: {pending_orders?.currentStatus}
          <br />
          Trade Status: {pending_orders?.tradeStatus}
          <br />
          Signal Type: {pending_orders?.signalType}
        </div>
      </div>:null
      }
  
    </div>
    </div>
    
  );
};

export default TradeStats;
