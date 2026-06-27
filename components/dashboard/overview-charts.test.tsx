import { render, screen } from "@testing-library/react";

import { OverviewCharts } from "@/components/dashboard/overview-charts";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => <div>Grid</div>,
  Legend: () => <div>Legend</div>,
  Tooltip: () => <div>Tooltip</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Line: ({ dataKey }: { dataKey: string }) => <div>Line {dataKey}</div>,
  Bar: ({ dataKey }: { dataKey: string }) => <div>Bar {dataKey}</div>,
}));

describe("OverviewCharts", () => {
  it("rendert beide grafiekblokken met datasets", () => {
    render(
      <OverviewCharts
        monthlyData={[{ month: "jun 26", expenses: 120, income: 400 }]}
        categoryData={[{ name: "Boodschappen", spent: 80, budget: 150 }]}
      />,
    );

    expect(screen.getByText("Inkomsten vs uitgaven per maand")).toBeInTheDocument();
    expect(screen.getByText("Uitgaven per categorie")).toBeInTheDocument();
    expect(screen.getByText("Line income")).toBeInTheDocument();
    expect(screen.getByText("Line expenses")).toBeInTheDocument();
    expect(screen.getByText("Bar spent")).toBeInTheDocument();
    expect(screen.getByText("Bar budget")).toBeInTheDocument();
  });
});
