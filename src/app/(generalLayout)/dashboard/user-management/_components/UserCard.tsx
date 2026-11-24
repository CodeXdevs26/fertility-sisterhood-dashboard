"use client";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TUser } from "@/interface/user.interface";
import UserAvatar from "@/components/others/UserAvatar";
import StatusBadge from "@/components/others/StatusBadge";
import UserStatusAction from "@/components/others/UserStatusAction";
import { UserDetailsModal } from "@/components/modal/UserDetailsModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function UserCard({ user }: { user: TUser }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border transition-colors">
      <button
        type="button"
        onClick={() => setIsDetailsOpen(true)}
        className="flex gap-2 min-w-0 text-left cursor-pointer"
      >
        <UserAvatar name={user.name} className="mr-3" />

        <div className="flex flex-col min-w-0">
          <span className="truncate">{user.name}</span>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>

        <div className="flex items-start gap-1.5">
          <StatusBadge status={user.status} />
          {user.isPremium && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
              Premium
            </span>
          )}
        </div>
      </button>

      <div className="flex items-center gap-2 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-9"
              aria-label={`View ${user.name}`}
              onClick={() => setIsDetailsOpen(true)}
            >
              <Eye />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View details</TooltipContent>
        </Tooltip>
        <UserStatusAction userId={user.id} name={user.name} status={user.status} />
      </div>

      <UserDetailsModal
        userId={user.id}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
