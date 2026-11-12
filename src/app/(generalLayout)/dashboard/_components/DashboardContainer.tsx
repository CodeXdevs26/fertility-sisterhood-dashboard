"use client";
import AContainer from "@/components/AContainer";
import PageTitle from "@/components/others/PageTitle";
import TopStats from "./TopStats";
import { UserOverview } from "./chart/UserOverview";
import NewUsers from "./newUsers/NewUsers";

const DashboardContainer = () => {
  return (
    <AContainer>
      <PageTitle
        title="Dashboard"
        subTitle="Get a snapshot of your platform's performance. Track key metrics, user activity, and recent updates to stay informed"
      />
      <div className="flex gap-8 mt-8 h-fit">
        <div className="w-[62%]">
          <TopStats />
          <UserOverview />
        </div>
        <div className="w-[38%] border-2 rounded-2xl p-4 py-6 h-fit">
          <NewUsers />
        </div>
      </div>
    </AContainer>
  );
};

export default DashboardContainer;
