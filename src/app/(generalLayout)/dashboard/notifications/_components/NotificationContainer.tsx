"use client";

import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AAlertDialog } from "@/components/modal/AAlertDialog";
import { APagination } from "@/components/ui/APagination";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useDeleteAllNotificationsMutation,
} from "@/redux/api/notificationApi";
import { TNotification } from "@/interface/notification.interface";
import handleMutation from "@/utils/handleMutation";
import { NotificationCard } from "./NotificationCard";

const NotificationContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, isError, error, refetch } = useGetNotificationsQuery({
    page: currentPage,
    limit,
  });
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation();
  const [deleteAll, { isLoading: isClearing }] = useDeleteAllNotificationsMutation();
  const notifications: TNotification[] = data?.data?.notifications || [];
  const total: number = data?.data?.meta?.total || 0;
  const unreadCount: number = data?.data?.meta?.unreadCount || 0;

  return (
    <div className="min-h-screen bg-background p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-foreground text-2xl font-bold">
          Notifications {unreadCount > 0 && <span className="text-primary">({unreadCount})</span>}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={!unreadCount || isMarking}
            onClick={() => handleMutation({}, markAllRead, "Marking all as read...")}
          >
            <CheckCheck />
            Mark all as read
          </Button>
          <AAlertDialog
            title="Clear all notifications?"
            description="All your notifications will be deleted. This cannot be undone."
            actionText="Clear all"
            onAction={() =>
              handleMutation({}, deleteAll, "Clearing notifications...", () => setCurrentPage(1))
            }
          >
            <Button variant="outline" disabled={!total || isClearing}>
              <Trash2 />
              Clear all
            </Button>
          </AAlertDialog>
        </div>
      </div>

      {isLoading ? (
        <ASpinner size={120} className="py-32" />
      ) : isError ? (
        <AErrorMessage className="py-32" error={error} onRetry={refetch} />
      ) : (
        <div className={`space-y-3 ${isFetching ? "opacity-60" : ""}`}>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
          {notifications.length === 0 && (
            <p className="py-8 text-center text-muted-foreground" role="status">
              No notifications yet.
            </p>
          )}
        </div>
      )}

      {!!total && (
        <APagination
          totalItems={total}
          itemsPerPage={limit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default NotificationContainer;
