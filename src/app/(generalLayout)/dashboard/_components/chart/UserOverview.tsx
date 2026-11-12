"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { userTypeOptions, yearOptions } from "@/data/global.data";
import { AFilterSelect } from "@/components/form/AFilterSelect";
import { useGetUserOverviewQuery } from "@/redux/api/dashboardApi";
import { TUserOverviewItem } from "@/interface/user.interface";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  count: {
    label: "New users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function UserOverview() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [userType, setUserType] = useState<string>("all");

  const { data, isLoading } = useGetUserOverviewQuery({
    year,
    status: userType,
  });
  const chartData: TUserOverviewItem[] = data?.data || [];

  return (
    <div className="bg-card rounded-xl p-6 px-8 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          User Overview
        </h1>
        <div className="flex items-center gap-4">
          <AFilterSelect
            onChange={setUserType}
            placeholder={"user type"}
            value={userType}
            options={userTypeOptions}
            className="!w-[110px]"
          />
          <AFilterSelect
            onChange={setYear}
            placeholder={currentYear.toString()}
            value={year}
            options={yearOptions}
            className="!w-[90px]"
          />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-[320px] w-full mt-12 rounded-xl" />
      ) : (
        <ChartContainer config={chartConfig} className="h-[320px] w-full mt-12">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              allowDecimals={false}
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex items-center justify-between gap-2 w-full">
                      <p className="text-muted-foreground font-medium">New users: </p>
                      <p>{value}</p>
                    </div>
                  )}
                />
              }
            />
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillUsers)"
              fillOpacity={0.6}
              stroke="var(--chart-3)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
