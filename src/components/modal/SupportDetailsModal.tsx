"use client";

import { ReactNode, useRef } from "react";
import { CheckCircle2, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { formatDate } from "@/utils/formatDate";
import { TSupport } from "@/interface/support.interface";
import UserAvatar from "@/components/others/UserAvatar";
import StatusBadge from "@/components/others/StatusBadge";
import { useChangeSupportStatusMutation } from "@/redux/api/supportApi";
import handleMutation from "@/utils/handleMutation";

export function SupportDetailsModal({
  children,
  support,
}: {
  children: ReactNode;
  support: TSupport;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [changeSupportStatus, { isLoading }] = useChangeSupportStatusMutation();
  const sender = support.auth;
  const isResolved = support.status === "RESOLVED";

  const copyEmail = async () => {
    if (!contentRef.current || !sender) return;
    try {
      await copyToClipboard(sender.email, contentRef.current);
      toast.success("Email copied");
    } catch {
      toast.error("Could not copy the email. Please copy it manually.");
    }
  };

  const handleChangeStatus = () => {
    handleMutation(
      { id: support.id, status: isResolved ? "PENDING" : "RESOLVED" },
      changeSupportStatus,
      isResolved ? "Reopening message..." : "Marking as resolved..."
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent ref={contentRef} className="bg-white border-border max-w-md p-6 rounded-lg max-h-[85vh] overflow-y-auto gap-5">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            Support message <StatusBadge status={support.status} />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Message from {sender?.name || "Unknown user"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <UserAvatar name={sender?.name} className="size-10" />
          <div className="min-w-0">
            <p className="font-medium text-foreground break-words">{sender?.name || "Unknown user"}</p>
            {sender && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground break-all select-text">{sender.email}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      aria-label="Copy sender email"
                      onClick={copyEmail}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy sender email</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
        <time dateTime={support.createdAt} className="text-xs text-muted-foreground">
          {formatDate(support.createdAt, true)}
        </time>
        <div className="border-t border-border pt-4 space-y-3">
          <h3 className="font-medium text-foreground break-words">{support.title}</h3>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">{support.description}</p>
        </div>
        <Button
          type="button"
          variant={isResolved ? "outline" : "default"}
          className="h-11 shadow-none"
          disabled={isLoading}
          onClick={handleChangeStatus}
        >
          {isResolved ? <RotateCcw /> : <CheckCircle2 />}
          {isResolved ? "Mark as pending" : "Mark as resolved"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
