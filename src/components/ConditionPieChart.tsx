
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ConditionData {
  name: string;
  value: number;
}

interface ConditionPieChartProps {
  data: ConditionData[];
}

const COLORS = [
  'hsl(var(--modern-yellow))',
  'hsl(var(--modern-blue))',
  'hsl(var(--modern-blue-dark))',
  '#10B981',
  '#F59E0B',
  '#EF4444'
];

const chartConfig = {
  value: {
    label: "Assets",
  },
};

export function ConditionPieChart({ data }: ConditionPieChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
