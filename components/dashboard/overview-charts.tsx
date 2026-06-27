"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategoryInsightPoint, MonthlyInsightPoint } from "@/types/domain";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/60 bg-white/90 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-6 h-80">{children}</div>
    </article>
  );
}

export function OverviewCharts({
  monthlyData,
  categoryData,
}: {
  monthlyData: MonthlyInsightPoint[];
  categoryData: CategoryInsightPoint[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Inkomsten vs uitgaven per maand">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#0f766e" strokeWidth={3} />
            <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Uitgaven per categorie">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="spent" fill="#10b981" radius={[10, 10, 0, 0]} />
            <Bar dataKey="budget" fill="#cbd5e1" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
