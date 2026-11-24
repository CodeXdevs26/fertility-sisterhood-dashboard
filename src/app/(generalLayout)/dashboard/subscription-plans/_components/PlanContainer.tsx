"use client";

import { Crown, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AErrorMessage from "@/components/AErrorMessage";
import { useGetPackagesQuery } from "@/redux/api/packageApi";
import { TPackage } from "@/interface/package.interface";
import PlanFormModal from "./PlanFormModal";
import PlanCard from "./PlanCard";

export default function PlanContainer() {
  const { data, isLoading, isError, error, refetch } = useGetPackagesQuery("");
  const packages: TPackage[] = data?.data ?? [];

  return (
    <section className="space-y-8">
      <div className="relative isolate flex flex-wrap items-end justify-between gap-4 overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-r from-[#F2EAE0] via-[#fcfaf8] to-white p-6 sm:p-8">
        <Sparkles aria-hidden="true" className="absolute right-8 top-6 -z-10 size-32 rotate-12 text-primary/5" />
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-primary"><Crown className="size-3.5" />Sisterhood membership</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Subscription Packages</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Manage the packages members can buy in the app: name, billing cycle, features, and display price.</p>
        </div>
        {packages.length > 0 && (
          <PlanFormModal><Button className="shadow-none"><Plus />Add package</Button></PlanFormModal>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-[340px] max-w-md rounded-3xl" />
      ) : isError ? (
        <AErrorMessage className="py-20" error={error} onRetry={refetch} />
      ) : packages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary/30 bg-card px-6 py-16 text-center">
          <Crown className="mx-auto mb-4 size-10 text-primary" />
          <h3 className="text-xl font-semibold">No packages yet</h3>
          <p className="mt-2 mb-5 text-sm text-muted-foreground">Add the packages members can subscribe to.</p>
          <PlanFormModal><Button className="shadow-none"><Plus />Create package</Button></PlanFormModal>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
      )}
    </section>
  );
}
