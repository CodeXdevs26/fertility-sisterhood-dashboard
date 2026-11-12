import AContainer from "@/components/AContainer";
import { Metadata } from "next";
import PlanContainer from "./_components/PlanContainer";

export const metadata: Metadata = {
  title: "Subscription Packages",
};

const SubscriptionPlans = () => {
  return (
    <main>
      <AContainer>
        <PlanContainer />
      </AContainer>
    </main>
  );
};

export default SubscriptionPlans;
