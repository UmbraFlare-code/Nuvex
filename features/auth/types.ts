// features/auth/types.ts
export type Role = "admin" | "employee"
export type UserStatus = "active" | "inactive"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  created_at?: string
}
