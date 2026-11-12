"use client";

import { Crown, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AErrorMessage from "@/components/AErrorMessage";
import { useGetPlanQuery } from "@/redux/api/subscriptionPlanApi";
import { TPlan } from "@/interface/plan.interface";
import PlanFormModal from "./PlanFormModal";
import PlanCard from "./PlanCard";

export default function PlanContainer() {
  const { data, isLoading, isError, error, refetch } = useGetPlanQuery("");
  // data is null until the plan is created for the first time
  const plan: TPlan | null = data?.data ?? null;

  return (
    <section className="space-y-8">
      <div className="relative isolate overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-r from-[#F2EAE0] via-[#fcfaf8] to-white p-6 sm:p-8">
        <Sparkles aria-hidden="true" className="absolute right-8 top-6 -z-10 size-32 rotate-12 text-primary/5" />
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-primary"><Crown className="size-3.5" />Sisterhood membership</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Subscription Package</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Manage the monthly membership package your members subscribe to: its name, description, and price.</p>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-[340px] max-w-md rounded-3xl" />
      ) : isError ? (
        <AErrorMessage className="py-20" error={error} onRetry={refetch} />
      ) : !plan ? (
        <div className="rounded-3xl border border-dashed border-primary/30 bg-card px-6 py-16 text-center">
          <Crown className="mx-auto mb-4 size-10 text-primary" />
          <h3 className="text-xl font-semibold">No package yet</h3>
          <p className="mt-2 mb-5 text-sm text-muted-foreground">Set up the monthly membership package for your members.</p>
          <PlanFormModal plan={null}><Button className="shadow-none"><Plus />Create package</Button></PlanFormModal>
        </div>
      ) : (
        <PlanCard plan={plan} />
      )}
    </section>
  );
}
