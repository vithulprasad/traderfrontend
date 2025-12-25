import { TrendingUp, TrendingDown, Activity, Target, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, DollarSign, BarChart3, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "lucide-react";
import './st.css'

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

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="text-white p-2">
      {/* First Row - Always 3 cards per row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Total Trades Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-[10px] font-medium">
              Total
            </span>
            <div className="p-1.5 bg-blue-500/20 rounded">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold font-mono text-white">
              {totalTrades}
            </p>
            <div className="flex items-center text-[10px]">
              <span className="text-green-500 mr-0.5">↗</span>
              <span className="text-gray-400">All</span>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-gray-800/80">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Active</span>
              <span className="text-white">{totalTrades - (winningTrades + losingTrades)}</span>
            </div>
          </div>
        </div>

        {/* Winning Trades Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-green-900/40 rounded-lg p-3 hover:border-green-500/60 transition-all duration-300 hover:scale-[1.02] glow-green">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 text-[10px] font-medium">
              Wins
            </span>
            <div className="p-1.5 bg-green-500/20 rounded">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold font-mono text-green-400">
              {winningTrades}
            </p>
            <div className="flex items-center text-[10px]">
              <span className="text-green-500 mr-0.5">↑</span>
              <span className="text-green-400">{winRate}%</span>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-green-900/40">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Ratio</span>
              <span className="text-green-400">1:{((winningTrades / totalTrades) * 100).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Losing Trades Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-red-900/40 rounded-lg p-3 hover:border-red-500/60 transition-all duration-300 hover:scale-[1.02] glow-red">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-400 text-[10px] font-medium">
              Losses
            </span>
            <div className="p-1.5 bg-red-500/20 rounded">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold font-mono text-red-400">
              {losingTrades}
            </p>
            <div className="flex items-center text-[10px]">
              <span className="text-red-500 mr-0.5">↓</span>
              <span className="text-red-400">{((losingTrades / totalTrades) * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-red-900/40">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Amount</span>
              <span className="text-red-400">{formatCurrency(totalLose)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Always 3 cards per row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Win Rate Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-amber-900/40 rounded-lg p-3 hover:border-amber-500/60 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400 text-[10px] font-medium">
              Win Rate
            </span>
            <div className="p-1.5 bg-amber-500/20 rounded">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/30 flex items-center justify-center">
                <span className="text-[10px] font-bold text-amber-400">%</span>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className={`text-lg font-bold font-mono ${winRate >= 50 ? "text-green-400" : winRate >= 30 ? "text-amber-400" : "text-red-400"}`}>
              {winRate}%
            </p>
            <div className="flex items-center text-[10px]">
              <div className={`w-1.5 h-1.5 rounded-full mr-0.5 ${winRate >= 50 ? "bg-green-500" : winRate >= 30 ? "bg-amber-500" : "bg-red-500"}`}></div>
              <span className={`${winRate >= 50 ? "text-green-400" : winRate >= 30 ? "text-amber-400" : "text-red-400"}`}>
                {winRate >= 50 ? "Good" : winRate >= 30 ? "Avg" : "Poor"}
              </span>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-amber-900/40">
            <div className="w-full bg-gray-800/80 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${winRate >= 50 ? "bg-green-500" : winRate >= 30 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(winRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Long Positions Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-green-900/40 rounded-lg p-3 hover:border-green-500/60 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 text-[10px] font-medium">
              Long
            </span>
            <div className="p-1.5 bg-green-500/20 rounded">
              <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold font-mono text-green-400">
              {most_buy_direction}
            </p>
            <div className="flex items-center text-[10px]">
              <div className="w-6 h-4 bg-green-500/30 rounded flex items-center justify-center">
                <span className="text-green-400 text-[9px] font-bold">BUY</span>
              </div>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-green-900/40">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Bias</span>
              <span className="text-green-400">Bull</span>
            </div>
          </div>
        </div>

        {/* Short Positions Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-red-900/40 rounded-lg p-3 hover:border-red-500/60 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-400 text-[10px] font-medium">
              Short
            </span>
            <div className="p-1.5 bg-red-500/20 rounded">
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold font-mono text-red-400">
              {most_sell_direction}
            </p>
            <div className="flex items-center text-[10px]">
              <div className="w-6 h-4 bg-red-500/30 rounded flex items-center justify-center">
                <span className="text-red-400 text-[9px] font-bold">SELL</span>
              </div>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-red-900/40">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Bias</span>
              <span className="text-red-400">Bear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Always 3 cards per row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Total Loss Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-red-900/40 rounded-lg p-3 hover:border-red-500/60 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-400 text-[10px] font-medium">
              Loss $
            </span>
            <div className="p-1.5 bg-red-500/20 rounded">
              <DollarSign className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold font-mono text-red-400">
              {formatCurrency(totalLose)}
            </p>
            <div className="flex items-center text-[10px]">
              <AlertTriangle className="w-2.5 h-2.5 text-red-500 mr-0.5" />
              <span className="text-red-400">Risk</span>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-red-900/40">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Avg/Trade</span>
              <span className="text-red-400">
                {losingTrades > 0 ? formatCurrency(totalLose / losingTrades).split('.')[0] : '$0'}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        {pending_orders ? (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-amber-900/40 rounded-lg p-3 hover:border-amber-500/60 transition-all duration-300 hover:scale-[1.02] glow-amber col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 text-[10px] font-medium">
                Pending Order
              </span>
              <div className="p-1.5 bg-amber-500/20 rounded">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Left Column */}
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-gray-400">Entry</span>
                  <p className="text-sm font-mono text-white">{pending_orders.entryPrice}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">Target</span>
                  <p className="text-sm font-mono text-green-400">{pending_orders.target}</p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-gray-400">Stop Loss</span>
                  <p className="text-sm font-mono text-red-400">{pending_orders.stopLoss}</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400">Dir</span>
                    <div className={`mt-0.5 px-2 py-1 rounded text-[10px] font-bold ${pending_orders.direction === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'}`}>
                      {pending_orders.direction}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Signal</span>
                    <p className="text-[10px] font-mono text-blue-400 mt-0.5">{pending_orders.signalType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Empty card 1 */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3 flex flex-col items-center justify-center hover:border-gray-700/60 transition-all duration-300">
              <div className="p-2 bg-gray-800/80 rounded mb-1">
                <BarChart3 className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-gray-500 text-xs font-medium text-center">No Pending</p>
              <p className="text-gray-600 text-[10px] mt-0.5 text-center">Settled</p>
            </div>
            
            {/* Empty card 2 */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3 flex flex-col items-center justify-center hover:border-gray-700/60 transition-all duration-300">
              <div className="p-2 bg-gray-800/80 rounded mb-1">
                <Target className="w-4 h-4 text-blue-500/60" />
              </div>
              <p className="text-gray-500 text-xs font-medium text-center">Strategy</p>
              <p className="text-gray-600 text-[10px] mt-0.5 text-center">Active</p>
            </div>
          </>
        )}
      </div>

      {/* Stats Summary Row - Always 3 cards per row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Market Sentiment Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-[10px] font-medium">
              Sentiment
            </span>
            <div className="flex items-center">
              <TrendingUpIcon className="w-3 h-3 text-green-400 mr-0.5" />
              <TrendingDownIcon className="w-3 h-3 text-red-400" />
            </div>
          </div>
          <div className="relative w-full bg-gray-800/80 rounded-full h-1.5 mb-1">
            <div 
              className="absolute left-0 bg-green-500 h-1.5 rounded-full"
              style={{ width: `${(parseInt(most_buy_direction) / (parseInt(most_buy_direction) + parseInt(most_sell_direction)) * 100)}%` }}
            ></div>
            <div 
              className="absolute right-0 bg-red-500 h-1.5 rounded-full"
              style={{ width: `${(parseInt(most_sell_direction) / (parseInt(most_buy_direction) + parseInt(most_sell_direction)) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-green-400">{most_buy_direction} L</span>
            <span className="text-red-400">{most_sell_direction} S</span>
          </div>
        </div>

        {/* Active Trades Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-blue-900/40 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 text-[10px] font-medium">
              Active
            </span>
            <div className="p-1.5 bg-blue-500/20 rounded">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <p className="text-lg font-bold font-mono text-blue-400">
            {totalTrades - (winningTrades + losingTrades)}
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-blue-900/40">
            <div className="flex justify-between text-[9px]">
              <span className="text-gray-400">Running</span>
              <span className="text-blue-400">Live</span>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-amber-900/40 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400 text-[10px] font-medium">
              Perf.
            </span>
            <div className="p-1.5 bg-amber-500/20 rounded">
              <Target className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p className="text-xs font-mono text-green-400">+42.5%</p>
              <span className="text-[9px] text-gray-400">Best</span>
            </div>
            <div>
              <p className="text-xs font-mono text-red-400">-18.3%</p>
              <span className="text-[9px] text-gray-400">Worst</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeStats;