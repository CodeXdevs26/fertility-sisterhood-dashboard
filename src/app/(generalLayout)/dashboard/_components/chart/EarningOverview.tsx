"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { yearOptions } from "@/data/global.data";
import { AFilterSelect } from "@/components/form/AFilterSelect";
import { useGetEarningOverviewQuery } from "@/redux/api/dashboardApi";
import { TEarningOverviewItem } from "@/interface/payment.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatCurrency";

const chartConfig = {
  amount: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function EarningOverview() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());

  const { data, isLoading } = useGetEarningOverviewQuery({ year });
  const chartData: TEarningOverviewItem[] = data?.data || [];

  return (
    <div className="bg-card rounded-xl p-6 px-8 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Earning Overview</h1>
        <AFilterSelect
          onChange={setYear}
          placeholder={currentYear.toString()}
          value={year}
          options={yearOptions}
          className="!w-[90px]"
        />
      </div>
      {isLoading ? (
        <Skeleton className="h-[320px] w-full mt-12 rounded-xl" />
      ) : (
        <ChartContainer config={chartConfig} className="h-[320px] w-full mt-12">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, left: 12, right: 12 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              tickFormatter={(value) => `£${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex items-center justify-between gap-2 w-full">
                      <p className="text-muted-foreground font-medium">Revenue: </p>
                      <p>{formatCurrency(Number(value))}</p>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
