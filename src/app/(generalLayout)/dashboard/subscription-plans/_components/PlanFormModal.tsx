"use client";

import { ReactNode, useState } from "react";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { ATextarea } from "@/components/form/ATextarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { planSchema, PlanFormValues } from "@/validations/plan.validation";
import { TPlan } from "@/interface/plan.interface";
import { useUpdatePlanMutation } from "@/redux/api/subscriptionPlanApi";
import handleMutation from "@/utils/handleMutation";

export default function PlanFormModal({ children, plan }: {
  children: ReactNode;
  plan?: TPlan | null;
}) {
  const [open, setOpen] = useState(false);
  const [updatePlan, { isLoading }] = useUpdatePlanMutation();

  const onSubmit = (values: PlanFormValues) => {
    // all three fields are required on every save, price must be a number
    const payload = {
      title: values.title,
      description: values.description,
      price: Number(values.price),
    };
    handleMutation(payload, updatePlan, plan ? "Updating package..." : "Creating package...", () => setOpen(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit package" : "Create subscription package"}</DialogTitle>
          <DialogDescription>Set the package name, description, and monthly price.</DialogDescription>
        </DialogHeader>
        {open && <AForm<PlanFormValues>
          schema={planSchema}
          defaultValues={{
            title: plan?.title ?? "",
            description: plan?.description ?? "",
            price: plan ? Number(plan.price).toFixed(2) : "",
          }}
          onSubmit={onSubmit}
          className="mt-2"
        >
          <AInput name="title" label="Package name" placeholder="e.g. Sisterhood Membership" required />
          <ATextarea name="description" label="Description" placeholder="What does this package offer?" required />
          <div className="space-y-2">
            <AInput name="price" label="Price (EUR / month)" placeholder="0.00" required />
            <p className="text-xs text-muted-foreground px-1">
              A price change only applies to new subscribers. Existing subscribers keep their current price.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : plan ? "Save changes" : "Create package"}
            </Button>
          </div>
        </AForm>}
      </DialogContent>
    </Dialog>
  );
}
