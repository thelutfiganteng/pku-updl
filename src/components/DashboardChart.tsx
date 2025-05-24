
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartArea } from "lucide-react";

// Example demo data
const demoData = [
  { name: "Jan", stock: 100 },
  { name: "Feb", stock: 150 },
  { name: "Mar", stock: 110 },
  { name: "Apr", stock: 170 },
  { name: "May", stock: 140 },
  { name: "Jun", stock: 200 },
];

const chartConfig = {
  stock: {
    label: "Stock",
    icon: ChartArea,
    color: "hsl(var(--modern-yellow))",
  },
};

export default function DashboardChart() {
  return (
    <Card className="w-full h-full bg-white/90 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-modern-blue">
          <ChartArea className="text-modern-yellow" />
          Inventory Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ChartContainer config={chartConfig} className="w-full h-72">
          <AreaChart data={demoData}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="hsl(var(--modern-yellow))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--modern-yellow-accent))" stopOpacity={0.25}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-modern-blue/10" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--modern-blue))" }}/>
            <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--modern-blue))" }}/>
            <Area
              type="monotone"
              dataKey="stock"
              stroke="hsl(var(--modern-blue))"
              strokeWidth={2}
              fill="url(#stockGradient)"
              activeDot={{ r: 6 }}
              className="drop-shadow"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent labelClassName="text-modern-blue-dark" />
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
