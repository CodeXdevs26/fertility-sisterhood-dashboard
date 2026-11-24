"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CreditCard, Crown, Trash2, UserPlus, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserDetailsModal } from "@/components/modal/UserDetailsModal";
import { TNotification, TNotificationType } from "@/interface/notification.interface";
import {
  useDeleteNotificationMutation,
  useMarkNotificationReadMutation,
} from "@/redux/api/notificationApi";
import handleMutation from "@/utils/handleMutation";
import { formatDate } from "@/utils/formatDate";

const icons: Record<TNotificationType, React.ReactNode> = {
  NEW_USER: <UserPlus className="size-5" />,
  NEW_SUBSCRIPTION: <Crown className="size-5" />,
  SUBSCRIPTION_CANCELED: <UserX className="size-5" />,
  PAYMENT_FAILED: <CreditCard className="size-5" />,
  NEW_SUPPORT: <CircleAlert className="size-5" />,
};

// notifications whose referenceId is a user id
const USER_TYPES: TNotificationType[] = ["NEW_USER", "NEW_SUBSCRIPTION", "SUBSCRIPTION_CANCELED"];

// pages for notifications that point to a list rather than a user
const PAGES: Partial<Record<TNotificationType, string>> = {
  NEW_SUPPORT: "/dashboard/supports",
  PAYMENT_FAILED: "/dashboard/transactions",
};

export function NotificationCard({ notification }: { notification: TNotification }) {
  const router = useRouter();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const userId = USER_TYPES.includes(notification.type) ? notification.referenceId : null;

  const handleOpen = () => {
    if (!notification.isRead) markRead(notification.id);
    if (userId) {
      setIsUserOpen(true);
    } else if (PAGES[notification.type]) {
      router.push(PAGES[notification.type]!);
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-lg border transition-colors ${
        notification.isRead ? "border-border" : "border-primary/40 bg-primary/5"
      }`}
    >
      <button
        type="button"
        className="flex gap-3 min-w-0 flex-1 text-left cursor-pointer"
        onClick={handleOpen}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icons[notification.type] ?? <CircleAlert className="size-5" />}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="font-medium flex items-center gap-2">
            {notification.title}
            {!notification.isRead && (
              <span className="size-2 rounded-full bg-primary" aria-label="Unread" />
            )}
          </span>
          {notification.message && <p className="text-sm break-words">{notification.message}</p>}
          <time dateTime={notification.createdAt} className="text-sm text-muted-foreground mt-1">
            {formatDate(notification.createdAt, true)}
          </time>
        </div>
      </button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="w-9 shrink-0"
            disabled={isDeleting}
            aria-label="Delete notification"
            onClick={() => handleMutation(notification.id, deleteNotification, "Deleting...")}
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>

      {userId && <UserDetailsModal userId={userId} open={isUserOpen} onOpenChange={setIsUserOpen} />}
    </div>
  );
}
