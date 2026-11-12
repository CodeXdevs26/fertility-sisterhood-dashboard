import { TUserStatus } from "./user.interface";

export type TSupportStatus = "PENDING" | "RESOLVED";

export interface TSupport {
  id: string
  title: string
  description: string
  status: TSupportStatus
  createdAt: string
  auth: {
    id: string
    name: string
    email: string
    status: TUserStatus
  } | null
}
