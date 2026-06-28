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
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { formatCurrency } from "@/lib/utils/format";
import type { CategoryInsightPoint, MonthlyInsightPoint } from "@/types/domain";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="min-w-0 rounded-[1.75rem] border border-white/60 bg-white/90 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-6 h-80 min-h-80 min-w-0">{children}</div>
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
  const labelMap = {
    income: "Inkomsten",
    expenses: "Uitgaven",
    spent: "Besteed",
    budget: "Budget",
  } as const;

  function formatTooltipValue(value: ValueType | undefined, name: NameType | undefined) {
    return [
      formatCurrency(Number(value ?? 0)),
      labelMap[String(name) as keyof typeof labelMap] ?? String(name ?? ""),
    ] as const;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Inkomsten vs uitgaven per maand">
        <div className="h-full w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={formatTooltipValue}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Inkomsten"
                stroke="#0f766e"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Uitgaven"
                stroke="#dc2626"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <ChartCard title="Uitgaven per categorie">
        <div className="h-full w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={formatTooltipValue}
              />
              <Legend />
              <Bar dataKey="spent" name="Besteed" fill="#10b981" radius={[10, 10, 0, 0]} />
              <Bar dataKey="budget" name="Budget" fill="#cbd5e1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
