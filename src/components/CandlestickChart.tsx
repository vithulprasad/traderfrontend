import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: OHLCData[];
}

const CandlestickChart = ({ data }: CandlestickChartProps) => {
  // Transform data for candlestick visualization
  const chartData = data.map((item) => {
    const isUp = item.close >= item.open;
    return {
      ...item,
      isUp,
      // For the body of the candle
      bodyLow: Math.min(item.open, item.close),
      bodyHigh: Math.max(item.open, item.close),
      // Height of the body
      bodyHeight: Math.abs(item.close - item.open),
      // Wick positions
      wickTop: item.high - Math.max(item.open, item.close),
      wickBottom: Math.min(item.open, item.close) - item.low,
      formattedTime: format(new Date(item.time), "HH:mm"),
    };
  });

  const minPrice = Math.min(...data.map((d) => d.low)) * 0.9999;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.0001;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="gradient-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-muted-foreground text-xs mb-2 font-mono">
            {format(new Date(item.time), "MMM dd, yyyy HH:mm")}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            <div>
              <span className="text-muted-foreground">Open:</span>
              <span className="ml-2 text-foreground">${item.open.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">High:</span>
              <span className="ml-2 text-profit">${item.high.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Low:</span>
              <span className="ml-2 text-loss">${item.low.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Close:</span>
              <span className={`ml-2 ${item.isUp ? 'text-profit' : 'text-loss'}`}>
                ${item.close.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-muted-foreground text-xs">Volume:</span>
            <span className="ml-2 text-foreground font-mono text-xs">
              {item.volume.toFixed(4)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom candlestick shape
  const CandlestickShape = (props: any) => {
    const { x, y, width, payload } = props;
    if (!payload) return null;

    const isUp = payload.close >= payload.open;
    const color = isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)";
    
    const priceRange = maxPrice - minPrice;
    const chartHeight = 350;
    
    const candleWidth = Math.max(width * 0.6, 4);
    const wickWidth = 2;
    
    const highY = ((maxPrice - payload.high) / priceRange) * chartHeight + 50;
    const lowY = ((maxPrice - payload.low) / priceRange) * chartHeight + 50;
    const openY = ((maxPrice - payload.open) / priceRange) * chartHeight + 50;
    const closeY = ((maxPrice - payload.close) / priceRange) * chartHeight + 50;
    
    const bodyTop = Math.min(openY, closeY);
    const bodyBottom = Math.max(openY, closeY);
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

    const centerX = x + width / 2;

    return (
      <g>
        {/* Upper wick */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={bodyTop}
          stroke={color}
          strokeWidth={wickWidth}
        />
        {/* Lower wick */}
        <line
          x1={centerX}
          y1={bodyBottom}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={wickWidth}
        />
        {/* Body */}
        <rect
          x={centerX - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={bodyHeight}
          fill={isUp ? color : color}
          stroke={color}
          strokeWidth={1}
          rx={1}
        />
      </g>
    );
  };

  return (
    <div className="gradient-card border border-border rounded-lg p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Price Chart</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-profit" />
            <span className="text-muted-foreground">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-loss" />
            <span className="text-muted-foreground">Bearish</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(217, 33%, 15%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="formattedTime" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12, fontFamily: "JetBrains Mono" }}
              dy={10}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12, fontFamily: "JetBrains Mono" }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              dx={-10}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="high" 
              shape={<CandlestickShape />}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;
