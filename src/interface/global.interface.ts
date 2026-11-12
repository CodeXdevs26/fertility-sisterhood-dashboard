export type TRole = "ADMIN" | "USER";

export type TDecodedUser = {
  id: string
  email: string
  role: TRole
  iat: number
  exp: number
}

export type TMeta = {
  page: number
  limit: number
  total: number
}
