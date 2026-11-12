"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/nav.data";
import { useLogout } from "@/hooks/useLogout";

export function NavMain() {
  const pathname = usePathname();
  const { handleLogout, isLoading } = useLogout();

  // Determine if a menu item is active based on the current pathname
  const isActive = (url: string) => pathname === url;

  return (
    <SidebarGroup className="mainNav">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild // Render the Link as the button content
              tooltip="Dashboard"
              className={`text-[15px] py-6 px-4 cursor-pointer min-w-8 duration-200 ease-linear ${
                isActive("/dashboard")
                  ? "bg-grad text-sidebar-accent-foreground hover:bg-grad"
                  : "hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 w-full"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild // Render the Link as the button content
                className={`text-[15px] py-6 px-4 cursor-pointer ${
                  isActive(item.url)
                    ? "bg-grad text-sidebar-accent-foreground hover:bg-grad"
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}
                tooltip={item.title}
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoading}
              tooltip="Logout"
              className="text-[15px] py-6 px-4 cursor-pointer text-destructive hover:bg-transparent hover:text-destructive active:bg-transparent active:text-destructive"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
