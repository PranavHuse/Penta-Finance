import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { TrendPoint } from "@/types";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3DD598" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3DD598" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0B429" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#F0B429" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2E37" vertical={false} />
        <XAxis
          dataKey="period"
          stroke="#6B7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: "#1B1E25",
            border: "1px solid #2A2E37",
            borderRadius: "0.75rem",
            color: "#F5F6F7",
          }}
          labelStyle={{ color: "#9CA3AF" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Income"
          stroke="#3DD598"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="Expenses"
          stroke="#F0B429"
          strokeWidth={2}
          fill="url(#expenseGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}