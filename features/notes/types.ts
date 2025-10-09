export type UINote = {
  id: string
  userId: string
  userName?: string
  userRole?: "admin" | "employee"
  title: string
  description: string
  isPinned: boolean
  created_at?: string
  updated_at?: string
}

export type UINoteInput = {
  userId: string
  title: string
  description: string
  isPinned?: boolean
}
