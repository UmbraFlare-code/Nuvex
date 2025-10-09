export type Dataset = "actions" | "requests"

export type ReportFilters = {
  dataset: Dataset
  userId?: string | "all"
  productId?: string | "all"
  dateFrom?: string // ISO (YYYY-MM-DD)
  dateTo?: string   // ISO (YYYY-MM-DD)
  // específicos por dataset
  actionType?: "entrada" | "salida" | "ajuste" | "uso" | "retorno" | "all"
  requestStatus?: "pending" | "accepted" | "rejected" | "all"
  q?: string
  mineOnly?: boolean
  currentUserId?: string
}

export type UIMovementRow = {
  id: string
  created_at?: string
  userId: string
  userName?: string
  productId: string
  productName?: string
  type: "entrada" | "salida" | "ajuste" | "uso" | "retorno"
  status: "completada" | "pendiente" | "cancelada"
  quantity: number
  reason: string
}

export type UIRequestRow = {
  id: string
  created_at?: string
  userId: string
  userName?: string
  productId: string
  productName?: string
  title: string
  reason?: string
  quantity: number
  status: "pending" | "accepted" | "rejected"
}

export type ReportData = {
  movements: UIMovementRow[]
  requests: UIRequestRow[]
  // agregados
  byActionType: Record<string, number>  // conteo por tipo
  byRequestStatus: Record<string, number> // conteo por estado
  totals: {
    movements: number
    requests: number
    quantitiesByType: Record<string, number> // suma quantity por tipo
  }
}

export type FilterOptions = {
  users: Array<{ id: string; name: string }>
  products: Array<{ id: string; name: string }>
}
