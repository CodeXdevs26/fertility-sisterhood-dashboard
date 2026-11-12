"use client";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChangeSupportStatusMutation } from "@/redux/api/supportApi";
import handleMutation from "@/utils/handleMutation";
import { TSupport } from "@/interface/support.interface";

// Toggles a support message between PENDING and RESOLVED
const SupportStatusAction = ({ support }: { support: TSupport }) => {
  const [changeSupportStatus, { isLoading }] = useChangeSupportStatusMutation();
  const isResolved = support.status === "RESOLVED";
  const label = isResolved ? "Mark as pending" : "Mark as resolved";

  const handleChangeStatus = () => {
    handleMutation(
      { id: support.id, status: isResolved ? "PENDING" : "RESOLVED" },
      changeSupportStatus,
      isResolved ? "Reopening message..." : "Marking as resolved..."
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isLoading}
          onClick={handleChangeStatus}
          className={
            isResolved
              ? "w-9 bg-secondary text-foreground hover:bg-secondary/80"
              : "w-9 bg-green-600 hover:bg-green-700"
          }
          aria-label={label}
        >
          {isResolved ? <RotateCcw /> : <CheckCircle2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default SupportStatusAction;
