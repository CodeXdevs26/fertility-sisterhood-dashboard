"use client";
import { Trash2 } from "lucide-react";
import { AAlertDialog } from "@/components/modal/AAlertDialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Delete button with confirmation
const DeleteAction = ({
  label,
  description,
  disabled,
  onDelete,
}: {
  label: string;
  description: string;
  disabled?: boolean;
  onDelete: () => void;
}) => (
  <Tooltip>
    <AAlertDialog title={`${label}?`} description={description} actionText="Delete" onAction={onDelete}>
      <TooltipTrigger asChild>
        <Button className="w-9 bg-destructive hover:bg-destructive" disabled={disabled} aria-label={label}>
          <Trash2 />
        </Button>
      </TooltipTrigger>
    </AAlertDialog>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

export default DeleteAction;
