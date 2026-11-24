"use client";

import { ReactNode, useState } from "react";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { ASelect } from "@/components/form/ASelect";
import { ATextarea } from "@/components/form/ATextarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { packageSchema, PackageFormValues } from "@/validations/package.validation";
import { TPackage } from "@/interface/package.interface";
import { useCreatePackageMutation, useUpdatePackageMutation } from "@/redux/api/packageApi";
import handleMutation from "@/utils/handleMutation";

const billingCycleOptions = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "ANNUAL", label: "Annual" },
];

export default function PlanFormModal({ children, plan }: {
  children: ReactNode;
  plan?: TPackage;
}) {
  const [open, setOpen] = useState(false);
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const isSaving = isCreating || isUpdating;

  const onSubmit = (values: PackageFormValues) => {
    const payload = {
      title: values.title,
      billingCycle: values.billingCycle,
      revenueCatProductId: values.revenueCatProductId,
      entitlementId: values.entitlementId,
      description: values.description.split("\n").map((line) => line.trim()).filter(Boolean),
      price: Number(values.price),
    };
    if (plan) {
      handleMutation({ id: plan.id, ...payload }, updatePackage, "Updating package...", () => setOpen(false));
    } else {
      handleMutation(payload, createPackage, "Creating package...", () => setOpen(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit package" : "Create subscription package"}</DialogTitle>
          <DialogDescription>The product ID and entitlement must match the product in RevenueCat.</DialogDescription>
        </DialogHeader>
        {open && <AForm<PackageFormValues>
          schema={packageSchema}
          defaultValues={{
            title: plan?.title ?? "",
            billingCycle: plan?.billingCycle ?? "MONTHLY",
            revenueCatProductId: plan?.revenueCatProductId ?? "",
            entitlementId: plan?.entitlementId ?? "premium",
            description: plan?.description.join("\n") ?? "",
            price: plan ? Number(plan.price).toFixed(2) : "",
          }}
          onSubmit={onSubmit}
          className="mt-2"
        >
          <AInput name="title" label="Package name" placeholder="e.g. Premium Monthly" required />
          <ASelect name="billingCycle" label="Billing cycle" options={billingCycleOptions} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <AInput name="revenueCatProductId" label="RevenueCat product ID" placeholder="premium_monthly" required />
            <AInput name="entitlementId" label="Entitlement ID" placeholder="premium" required />
          </div>
          <ATextarea name="description" label="Features (one per line)" placeholder={"All trackers\nMorning digest"} />
          <div className="space-y-2">
            <AInput name="price" label={`Display price (${(plan?.currency || "gbp").toUpperCase()})`} placeholder="0.00" required />
            <p className="text-xs text-muted-foreground px-1">
              Shown in the app only. The App Store and Play Store charge the price set there.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : plan ? "Save changes" : "Create package"}
            </Button>
          </div>
        </AForm>}
      </DialogContent>
    </Dialog>
  );
}
