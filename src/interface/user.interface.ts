import { TRole } from "./global.interface";

export type TUserStatus = "ACTIVE" | "BLOCKED";

export type TSubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED"
  | "UNPAID"
  | "TRIALING"
  | "PAUSED";

export interface TUser {
  id: string
  name: string
  email: string
  role: TRole
  status: TUserStatus
  // true when the subscription status is ACTIVE
  isPremium: boolean
  createdAt: string
}

export type TAuthProvider = "EMAIL" | "GOOGLE" | "FACEBOOK";

// consents the user gives in the app ("Your consent matters" screen)
export interface TUserConsent {
  healthData: boolean
  healthDataUpdatedAt: string | null
  marketing: boolean
  cookies: boolean
}

export interface TUserSubscription {
  status: TSubscriptionStatus
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string
  createdAt: string
}

export interface TUserDetails extends TUser {
  provider: TAuthProvider
  consent: TUserConsent | null
  subscription: TUserSubscription | null
}

export interface TProfile {
  id: string
  name: string
  email: string
  role: TRole
  status: TUserStatus
  createdAt: string
  updatedAt: string
}

export interface TUserOverviewItem {
  month: string
  count: number
}

export interface TStats {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  activeSubscribers: number
  newUsersThisMonth: number
  totalRevenue: number
  revenueThisMonth: number
  pendingSupports: number
}
