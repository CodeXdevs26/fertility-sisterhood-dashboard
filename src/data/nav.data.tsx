import {
  Bell,
  CircleAlert,
  Crown,
  ListChecks,
  Quote,
  ReceiptText,
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
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: <ReceiptText />,
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
    title: "Daily Quotes",
    url: "/dashboard/quotes",
    icon: <Quote />,
  },
  {
    title: "IVF Checklist",
    url: "/dashboard/checklist",
    icon: <ListChecks />,
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
