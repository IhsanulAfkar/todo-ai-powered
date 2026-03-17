"use client";

import { PieChart, Pie, Cell } from "recharts";

type Props = {
  value: number; // percentage (0–100)
  color: string;
  label: string;
};

export function CircularChart({ value, color, label }: Props) {
  const data = [
    { name: "value", value },
    { name: "rest", value: 100 - value },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[120px] h-[120px]">
        <PieChart width={120} height={120}>
          <Pie
            data={data}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius={40}
            outerRadius={55}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e5e5e5" />
          </Pie>
        </PieChart>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
          {value}%
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </div>
    </div>
  );
}