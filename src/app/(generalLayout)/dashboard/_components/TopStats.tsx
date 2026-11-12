"use client";
import StatCard from "@/components/others/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStatsQuery } from "@/redux/api/dashboardApi";
import { TStats } from "@/interface/user.interface";
import { Crown, User, UserCheck } from "lucide-react";

const TopStats = () => {
  const { data, isLoading } = useGetStatsQuery("");
  const stats: TStats | undefined = data?.data;

  if (isLoading)
    return (
      <section className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-[150px] rounded-xl" />
        ))}
      </section>
    );

  return (
    <section>
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          icon={<User />}
          value={stats?.totalUsers || 0}
        />
        <StatCard
          title="Active Users"
          icon={<UserCheck />}
          value={stats?.activeUsers || 0}
        />
        <StatCard
          title="Active Subscribers"
          icon={<Crown />}
          value={stats?.activeSubscribers || 0}
        />
      </div>
    </section>
  );
};

export default TopStats;
