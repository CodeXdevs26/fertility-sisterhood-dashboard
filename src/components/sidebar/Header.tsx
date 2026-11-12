"use client";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell } from "lucide-react";
import ProfileDropdown from "@/app/(generalLayout)/sections/dashboard/ProfileDropdown";

// Notifications are dummy UI for now (no notification API / socket)
const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 right-0 z-50 bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1 !text-foreground hover:!text-sidebar" />
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/notifications"}
            className="bg-secondary p-2 rounded-full flex items-center"
            aria-label="Notifications"
          >
            <Bell size={28} className="text-primary" />
          </Link>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
