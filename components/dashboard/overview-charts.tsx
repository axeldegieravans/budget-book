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

import { formatCurrency } from "@/lib/utils/format";
import type { CategoryInsightPoint, MonthlyInsightPoint } from "@/types/domain";

const CHART_MIN_HEIGHT = 320;
const INITIAL_CHART_DIMENSIONS = {
  width: 640,
  height: CHART_MIN_HEIGHT,
} as const;
type TooltipValue = number | string | ReadonlyArray<number | string>;
type TooltipName = number | string;
const tooltipLabelMap = {
  income: "Inkomsten",
  expenses: "Uitgaven",
  spent: "Besteed",
  budget: "Budget",
} as const;

function formatTooltipValue(value: TooltipValue | undefined, name: TooltipName | undefined) {
  return [
    formatCurrency(Number(value ?? 0)),
    tooltipLabelMap[String(name) as keyof typeof tooltipLabelMap] ?? String(name ?? ""),
  ] as const;
}

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
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Inkomsten vs uitgaven per maand">
        <div className="h-full w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={CHART_MIN_HEIGHT}
            initialDimension={INITIAL_CHART_DIMENSIONS}
          >
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={formatTooltipValue} />
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
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={CHART_MIN_HEIGHT}
            initialDimension={INITIAL_CHART_DIMENSIONS}
          >
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={formatTooltipValue} />
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
