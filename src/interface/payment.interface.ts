export type TPaymentStatus = "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface TPayment {
  id: string
  amount: number
  // > 0 on a partial refund (status stays SUCCEEDED); equals amount when REFUNDED
  amountRefunded: number
  currency: string
  status: TPaymentStatus
  // RevenueCat store (APP_STORE, PLAY_STORE...), TEST_API for test purchases, STRIPE for old records
  store: string | null
  productId: string | null
  // sandbox payments are excluded from revenue stats
  environment: "SANDBOX" | "PRODUCTION" | null
  createdAt: string
  auth: {
    id: string
    name: string
    email: string
  } | null
}

export interface TEarningOverviewItem {
  month: string
  amount: number
}
