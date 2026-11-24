export type TChecklistCategory =
  | "MEDICAL"
  | "FINANCIAL"
  | "LIFESTYLE"
  | "WELLBEING"
  | "PARTNER"
  | "LOGISTIC";

export interface TChecklistTemplate {
  id: string
  category: TChecklistCategory
  title: string
  order: number
  createdAt: string
}
