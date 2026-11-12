"use client";

import { Crown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TPlan } from "@/interface/plan.interface";
import { formatDate } from "@/utils/formatDate";
import PlanFormModal from "./PlanFormModal";

// Number() in case the backend serializes the price as a string
const formatPrice = (price: number | string) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(price));

export default function PlanCard({ plan }: { plan: TPlan }) {
  return (
    <article className="relative isolate flex h-full min-h-[340px] max-w-md flex-col overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-white via-[#fcfaf8] to-[#F2EAE0] p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white"><Crown className="size-6" /></div>
        <span className="rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-medium text-primary">Monthly</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground break-words">{plan.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words whitespace-pre-wrap">{plan.description}</p>
      <div className="my-6 flex flex-wrap items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-foreground break-all">{formatPrice(plan.price)}</span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      <p className="flex-1 text-xs text-muted-foreground">Last updated {formatDate(plan.updatedAt)}</p>
      <div className="mt-7">
        <PlanFormModal plan={plan}>
          <Button variant="outline" className="shadow-none h-11 w-full border-primary/25 bg-white/80 text-primary hover:bg-primary hover:text-white"><Pencil className="size-4" />Edit package</Button>
        </PlanFormModal>
      </div>
    </article>
  );
}
