import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportDetailsModal } from "@/components/modal/SupportDetailsModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UserAvatar from "@/components/others/UserAvatar";
import StatusBadge from "@/components/others/StatusBadge";
import UserStatusAction from "@/components/others/UserStatusAction";
import { TSupport } from "@/interface/support.interface";
import { formatDate } from "@/utils/formatDate";
import SupportStatusAction from "./SupportStatusAction";

export function SupportCard({ support }: { support: TSupport }) {
  // auth can be null for old messages
  const sender = support.auth;

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border transition-colors">
      <div className="flex gap-2 min-w-0">
        <UserAvatar name={sender?.name} className="mr-3" />

        <div className="flex flex-col min-w-0">
          <h3 className="font-medium text-foreground truncate">
            {sender?.name || "Unknown user"}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {support.title}
          </p>
        </div>

        <div>
          <StatusBadge status={support.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <time dateTime={support.createdAt} className="text-sm text-muted-foreground mr-4 whitespace-nowrap">
          {formatDate(support.createdAt)}
        </time>
        <Tooltip>
          <SupportDetailsModal support={support}>
            <TooltipTrigger asChild>
              <Button className="w-9" aria-label={`View support message from ${sender?.name || "unknown user"}`}>
                <Eye />
              </Button>
            </TooltipTrigger>
          </SupportDetailsModal>
          <TooltipContent>View details</TooltipContent>
        </Tooltip>
        <SupportStatusAction support={support} />
        {sender && (
          <UserStatusAction userId={sender.id} name={sender.name} status={sender.status} />
        )}
      </div>
    </div>
  );
}
