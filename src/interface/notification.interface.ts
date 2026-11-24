export type TNotificationType =
  | "NEW_USER"
  | "NEW_SUBSCRIPTION"
  | "SUBSCRIPTION_CANCELED"
  | "PAYMENT_FAILED"
  | "NEW_SUPPORT";

// shape sent by the backend (field names are shared with the mobile app)
export interface TNotificationResponse {
  id: string
  message: string
  description: string | null
  modelType: TNotificationType
  // user id for NEW_USER / NEW_SUBSCRIPTION / SUBSCRIPTION_CANCELED,
  // payment id for PAYMENT_FAILED, support id for NEW_SUPPORT
  referenceId: string | null
  read: boolean
  createdAt: string
}

// shape used by the dashboard (mapped in notificationApi)
export interface TNotification {
  id: string
  type: TNotificationType
  title: string
  message: string | null
  referenceId: string | null
  isRead: boolean
  createdAt: string
}
