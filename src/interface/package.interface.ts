export type TBillingCycle = "MONTHLY" | "ANNUAL";

export interface TPackage {
  id: string
  title: string
  billingCycle: TBillingCycle
  // must match the store product id in RevenueCat
  revenueCatProductId: string
  entitlementId: string
  description: string[]
  // display price; the store sets the real price
  price: number
  currency: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
