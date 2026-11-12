import {
  Bell,
  CircleAlert,
  Crown,
  Settings,
  UserRoundCog,
} from "lucide-react";

type TNavMain = {
  title: string;
  url: string;
  icon: React.ReactNode;
}[];

export const navItems: TNavMain = [
  {
    title: "User Management",
    url: "/dashboard/user-management",
    icon: <UserRoundCog />,
  },
  {
    title: "Supports",
    url: "/dashboard/supports",
    icon: <CircleAlert />,
  },
  {
    title: "Subscriptions",
    url: "/dashboard/subscription-plans",
    icon: <Crown />,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: <Bell />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings />,
  },
];
