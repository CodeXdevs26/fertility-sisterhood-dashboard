"use client";

import { ReactNode, useState } from "react";
import AForm from "@/components/form/AForm";
import { ASelect } from "@/components/form/ASelect";
import { ATextarea } from "@/components/form/ATextarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { checklistTemplateSchema, ChecklistTemplateFormValues } from "@/validations/content.validation";
import { TChecklistCategory, TChecklistTemplate } from "@/interface/checklist.interface";
import {
  useCreateChecklistTemplateMutation,
  useUpdateChecklistTemplateMutation,
} from "@/redux/api/checklistApi";
import handleMutation from "@/utils/handleMutation";
import { checklistCategoryOptions } from "@/data/global.data";

export default function ChecklistFormModal({
  children,
  item,
  defaultCategory,
}: {
  children: ReactNode;
  item?: TChecklistTemplate;
  defaultCategory?: TChecklistCategory;
}) {
  const [open, setOpen] = useState(false);
  const [createItem, { isLoading: isCreating }] = useCreateChecklistTemplateMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateChecklistTemplateMutation();
  const isSaving = isCreating || isUpdating;

  const onSubmit = (values: ChecklistTemplateFormValues) => {
    if (item) {
      handleMutation({ id: item.id, ...values }, updateItem, "Updating item...", () => setOpen(false));
    } else {
      handleMutation(values, createItem, "Adding item...", () => setOpen(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit checklist item" : "Add checklist item"}</DialogTitle>
          <DialogDescription>Every member gets this item in their pre-treatment IVF checklist.</DialogDescription>
        </DialogHeader>
        {open && (
          <AForm<ChecklistTemplateFormValues>
            schema={checklistTemplateSchema}
            defaultValues={{
              category: item?.category ?? defaultCategory ?? "",
              title: item?.title ?? "",
            }}
            onSubmit={onSubmit}
            className="mt-2"
          >
            <ASelect name="category" label="Category" options={checklistCategoryOptions} placeholder="Select a category" required />
            <ATextarea name="title" label="Item" placeholder="e.g. Schedule initial consultation with fertility clinic" required />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : item ? "Save changes" : "Add item"}
              </Button>
            </div>
          </AForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
