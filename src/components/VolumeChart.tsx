import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

interface VolumeChartProps {
  data: OHLCData[];
}

const VolumeChart = ({ data }: VolumeChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    isUp: item.close >= item.open,
    formattedTime: format(new Date(item.time), "HH:mm"),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="gradient-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-muted-foreground text-xs font-mono mb-1">
            {format(new Date(item.time), "MMM dd, HH:mm")}
          </p>
          <p className="text-foreground font-mono font-medium">
            Volume: {item.volume.toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="gradient-card border border-border rounded-lg p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <h2 className="text-xl font-semibold text-foreground mb-6">Volume</h2>
      
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(217, 33%, 15%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="formattedTime" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickFormatter={(value) => value.toFixed(2)}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
