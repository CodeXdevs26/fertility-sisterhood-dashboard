"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useGetProfileQuery } from "@/redux/api/profileApi";
import UserAvatar from "@/components/others/UserAvatar";
import { useLogout } from "@/hooks/useLogout";

const ProfileDropdown = () => {
  const { data } = useGetProfileQuery("");
  const profile = data?.data;
  const { handleLogout } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full cursor-pointer" aria-label="Open account menu">
        <UserAvatar name={profile?.name} className="size-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card text-foreground">
        <DropdownMenuLabel>
          {profile?.name || "My Account"}
          {profile?.email && (
            <p className="text-xs font-normal text-muted-foreground">{profile.email}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col px-2 gap-3 py-2">
          <Link className="hover:text-foreground" href={"/dashboard/profile"}>
            Profile
          </Link>
          <Link
            className="hover:text-foreground"
            href={"/dashboard/notifications"}
          >
            Notifications
          </Link>
          <Link className="hover:text-foreground" href={"/dashboard/settings"}>
            Settings
          </Link>{" "}
        </div>
        <DropdownMenuSeparator />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive cursor-pointer p-[6px] px-3"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
