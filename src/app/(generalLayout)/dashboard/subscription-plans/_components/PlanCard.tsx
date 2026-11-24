"use client";

import { Check, Crown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteAction from "@/components/others/DeleteAction";
import { TPackage } from "@/interface/package.interface";
import { useDeletePackageMutation } from "@/redux/api/packageApi";
import handleMutation from "@/utils/handleMutation";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import PlanFormModal from "./PlanFormModal";

export default function PlanCard({ plan }: { plan: TPackage }) {
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();
  const isAnnual = plan.billingCycle === "ANNUAL";

  return (
    <article className="relative isolate flex h-full min-h-[340px] flex-col overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-white via-[#fcfaf8] to-[#F2EAE0] p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white"><Crown className="size-6" /></div>
        <span className="rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-medium text-primary">{isAnnual ? "Annual" : "Monthly"}</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground break-words">{plan.title}</h2>
      <div className="my-5 flex flex-wrap items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-foreground break-all">{formatCurrency(plan.price, plan.currency)}</span>
        <span className="text-sm text-muted-foreground">/ {isAnnual ? "year" : "month"}</span>
      </div>
      <ul className="flex-1 space-y-2 text-sm">
        {plan.description.map((feature, index) => (
          <li key={index} className="flex gap-2 break-words"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{feature}</li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted-foreground break-all">
        Product <code>{plan.revenueCatProductId}</code> · Entitlement <code>{plan.entitlementId}</code>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Last updated {formatDate(plan.updatedAt)}</p>
      <div className="mt-6 flex gap-2">
        <PlanFormModal plan={plan}>
          <Button variant="outline" className="shadow-none h-11 flex-1 border-primary/25 bg-white/80 text-primary hover:bg-primary hover:text-white"><Pencil className="size-4" />Edit package</Button>
        </PlanFormModal>
        <DeleteAction
          label="Delete package"
          description="It will be hidden from the app. Members already subscribed keep it."
          disabled={isDeleting}
          onDelete={() => handleMutation(plan.id, deletePackage, "Deleting package...")}
        />
      </div>
    </article>
  );
}
