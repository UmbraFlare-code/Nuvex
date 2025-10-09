export type RequestStatus = "pending" | "accepted" | "rejected"

export type UIRequest = {
  id: string
  userId: string
  userName?: string
  productId: string
  productName?: string
  title: string
  reason?: string
  quantity: number
  status: RequestStatus
  created_at?: string
  updated_at?: string
}

export type UIRequestInput = {
  userId: string
  productId: string
  title: string
  reason?: string
  quantity: number
  status?: RequestStatus
}
