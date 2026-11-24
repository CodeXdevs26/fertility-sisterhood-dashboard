"use client";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell } from "lucide-react";
import ProfileDropdown from "@/app/(generalLayout)/sections/dashboard/ProfileDropdown";
import { useGetNotificationsQuery } from "@/redux/api/notificationApi";

const Header = () => {
  // only the unread count is needed here; refreshed every minute
  const { data } = useGetNotificationsQuery({ page: 1, limit: 1 }, { pollingInterval: 60000 });
  const unreadCount: number = data?.data?.meta?.unreadCount || 0;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 right-0 z-50 bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1 !text-foreground hover:!text-sidebar" />
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/notifications"}
            className="relative bg-secondary p-2 rounded-full flex items-center"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          >
            <Bell size={28} className="text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-white text-xs font-semibold flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
