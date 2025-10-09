export type RegistrationStatus = "pending" | "approved" | "rejected"

export type UIRegistrationRequest = {
  id: string
  name: string
  email: string
  role: "admin" | "employee"
  status: RegistrationStatus
  requested_at?: string
  updated_at?: string
}

export type UIRegistrationCreateUserInput = {
  name: string
  email: string
  password: string
  role: "admin" | "employee"
}
