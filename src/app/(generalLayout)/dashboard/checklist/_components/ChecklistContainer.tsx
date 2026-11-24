"use client";

import { useState } from "react";
import { ListChecks, Pencil, Plus } from "lucide-react";
import AContainer from "@/components/AContainer";
import PageTitle from "@/components/others/PageTitle";
import DeleteAction from "@/components/others/DeleteAction";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import {
  useDeleteChecklistTemplateMutation,
  useGetChecklistTemplatesQuery,
} from "@/redux/api/checklistApi";
import { TChecklistCategory, TChecklistTemplate } from "@/interface/checklist.interface";
import handleMutation from "@/utils/handleMutation";
import { checklistCategoryOptions } from "@/data/global.data";
import ChecklistFormModal from "./ChecklistFormModal";

function ChecklistItemCard({ item }: { item: TChecklistTemplate }) {
  const [deleteItem, { isLoading }] = useDeleteChecklistTemplateMutation();

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border">
      <div className="flex items-center gap-3 min-w-0">
        <ListChecks className="size-5 shrink-0 text-primary" />
        <p className="break-words">{item.title}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <ChecklistFormModal item={item}>
          <Button className="w-9" aria-label="Edit item"><Pencil /></Button>
        </ChecklistFormModal>
        <DeleteAction
          label="Delete item"
          description="New members will no longer get this item. Members who already have it keep it."
          disabled={isLoading}
          onDelete={() => handleMutation(item.id, deleteItem, "Deleting item...")}
        />
      </div>
    </div>
  );
}

export default function ChecklistContainer() {
  const [category, setCategory] = useState<TChecklistCategory>("MEDICAL");
  const { data, isLoading, isFetching, isError, error, refetch } = useGetChecklistTemplatesQuery({ category });
  const items: TChecklistTemplate[] = data?.data || [];

  return (
    <AContainer>
      <div className="flex items-end justify-between gap-4">
        <PageTitle
          title="IVF Checklist"
          subTitle="The default pre-treatment checklist every member starts with in the app's Planner."
        />
        <ChecklistFormModal defaultCategory={category}>
          <Button><Plus />Add item</Button>
        </ChecklistFormModal>
      </div>

      <Tabs value={category} onValueChange={(value) => setCategory(value as TChecklistCategory)} className="mt-6">
        <TabsList className="grid w-full grid-cols-6 bg-card h-12">
          {checklistCategoryOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-card"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <ASpinner size={120} className="py-32" />
      ) : isError ? (
        <AErrorMessage className="py-32" error={error} onRetry={refetch} />
      ) : (
        <div className={`space-y-3 mt-6 ${isFetching ? "opacity-60" : ""}`}>
          <p className="text-sm text-muted-foreground">{items.length} items</p>
          {items.map((item) => <ChecklistItemCard key={item.id} item={item} />)}
          {items.length === 0 && (
            <p className="py-8 text-center text-muted-foreground" role="status">No items in this category yet.</p>
          )}
        </div>
      )}
    </AContainer>
  );
}
