"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import Loadingx from "@/shared/commponents/Loading"

// ----------------------------
// Tipos
// ----------------------------
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "employee"
  status: "active" | "inactive"
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface RegistrationRequest {
  id: string
  name: string
  email: string
  password: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected"
}

export interface Note {
  id: string
  userId: string
  title: string
  description: string
  isPinned: boolean
  createdAt: Date
}

export interface Request {
  id: string
  userId: string
  productId: string
  title: string
  reason: string
  quantity: number
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

export interface Action {
  id: string
  type: "entrada" | "salida" | "ajuste" | "uso" | "retorno"
  productId: string
  userId: string
  quantity: number
  reason: string
  status: "completada" | "pendiente" | "cancelada"
  createdAt: Date
  updatedAt: Date
  productName?: string
  userName?: string
}

// ----------------------------
// Context type
// ----------------------------
interface GlobalContextType {
  loading: boolean
  users: User[]
  products: Product[]
  registrationRequests: RegistrationRequest[]
  notes: Note[]
  requests: Request[]
  actions: Action[]
  currentUser: User | null
  setCurrentUser: (user: User | null) => void 

  // Users
  addUser: (user: Omit<User, "id">) => Promise<void>
  updateUserStatus: (userId: string, status: "active" | "inactive") => Promise<void>
  deleteUser: (userId: string) => Promise<void>

  // Auth
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  requestRegistration: (name: string, email: string, password: string) => Promise<boolean>

  // Products
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getCategories: () => string[]
  getLowStockProducts: () => Product[]
  getTotalValue: () => number

  // Registration requests
  approveRegistration: (id: string) => Promise<void>
  rejectRegistration: (id: string) => Promise<void>

  // Notes
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  // Requests
  addRequest: (req: Omit<Request, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>
  deleteRequest: (id: string) => Promise<void>

  // Actions
  addAction: (action: Omit<Action, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateAction: (id: string, updates: Partial<Action>) => Promise<void>
  deleteAction: (id: string) => Promise<void>
}

// ----------------------------
// Crear contexto
// ----------------------------
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

// ----------------------------
// Provider
// ----------------------------
export function GlobalProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const setCurrentUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
    setCurrentUserState(user)
  }

  // ----------------------------
  // Load inicial de datos
  // ----------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUserState(JSON.parse(savedUser))
    }


    const fetchData = async () => {
      setLoading(true) // 🟢 NUEVO: empieza carga
      try {
        // Users
        const { data: usersData } = await supabase.from("users").select("*")
        if (usersData) setUsers(usersData)

        // Products
        const { data: productsData } = await supabase.from("products").select("*")
        if (productsData) {
          setProducts(productsData.map((p) => ({
            ...p,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
          })))
        }

        // Registration requests
        const { data: requestsData } = await supabase.from("registration_requests").select("*")
        if (requestsData) {
          setRegistrationRequests(requestsData.map((r) => ({
            ...r,
            requestedAt: new Date(r.requested_at),
          })))
        }

        // Notes
        const { data: notesData } = await supabase.from("notes").select("*")
        if (notesData) {
          setNotes(notesData.map((n) => ({
            id: n.id,
            userId: n.user_id,
            title: n.title,
            description: n.description,
            isPinned: n.is_pinned,
            createdAt: new Date(n.created_at),
          })))
        }

        // Requests
        const { data: reqData } = await supabase.from("requests").select("*")
        if (reqData) {
          setRequests(reqData.map((r) => ({
            id: r.id,
            userId: r.user_id,
            productId: r.product_id,
            title: r.title,
            reason: r.reason,
            quantity: r.quantity,
            status: r.status,
            createdAt: new Date(r.created_at),
            updatedAt: new Date(r.updated_at),
          })))
        }

        // Actions
        const { data: actionsData } = await supabase.from("actions").select("*")
        if (actionsData) {
          setActions(actionsData.map((a) => ({
            id: a.id,
            type: a.type,
            productId: a.product_id,
            userId: a.user_id,
            quantity: a.quantity,
            reason: a.reason,
            status: a.status,
            createdAt: new Date(a.created_at),
            updatedAt: new Date(a.updated_at),
          })))
        }
      } finally {
        setLoading(false) // 🟢 NUEVO: termina carga
      }
    }

    fetchData()
  }, [])
  // ----------------------------
  // Auth
  // ----------------------------
  const login = async (email: string, password: string): Promise<User | null> => {
    const { data } = await supabase.from("users").select("*").eq("email", email).single()
    if (data) {
      setCurrentUser(data as User)   // 🟢 usa el nuevo setter
      return data as User
    }
    return null
  }

  const logout = () => {
    setCurrentUser(null)  // 🟢 borra también de localStorage
  }

  // ----------------------------
  // Users
  // ----------------------------
  const addUser = async (user: Omit<User, "id">) => {
    const { data, error } = await supabase.from("users").insert([user]).select().single()
    if (!error && data) setUsers((prev) => [...prev, data])
  }

  const updateUserStatus = async (userId: string, status: "active" | "inactive") => {
    const { data, error } = await supabase.from("users").update({ status }).eq("id", userId).select().single()
    if (!error && data) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)))
    }
  }

  const deleteUser = async (userId: string) => {
    const { error } = await supabase.from("users").delete().eq("id", userId)
    if (!error) setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  // ----------------------------
  // Registration requests
  // ----------------------------
  const requestRegistration = async (name: string, email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.from("registration_requests").insert([{
      name, email, password, status: "pending", requested_at: new Date().toISOString()
    }])
    if (error) return false
    setRegistrationRequests((prev) => [
      ...prev,
      { id: Date.now().toString(), name, email, password, status: "pending", requestedAt: new Date() }
    ])
    return true
  }

  const approveRegistration = async (id: string) => {
    const request = registrationRequests.find((r) => r.id === id)
    if (!request) return
    const { data, error } = await supabase.from("users").insert([{
      name: request.name, email: request.email, role: "employee", status: "active"
    }])
    if (!error && data) {
      setUsers((prev) => [...prev, data[0]])
      setRegistrationRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)))
    }
  }

  const rejectRegistration = async (id: string) => {
    await supabase.from("registration_requests").update({ status: "rejected" }).eq("id", id)
    setRegistrationRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)))
  }

  // ----------------------------
  // Products
  // ----------------------------
  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const { data, error } = await supabase.from("products").insert([productData]).select().single()
    if (!error && data) {
      setProducts((prev) => [...prev, {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }])
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()
    if (!error && data) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...data, createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) } : p
        )
      )
    }
  }

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const getCategories = () => Array.from(new Set(products.map((p) => p.category)))
  const getLowStockProducts = () => products.filter((p) => p.stock <= p.minStock)
  const getTotalValue = () => products.reduce((acc, p) => acc + p.stock * p.price, 0)

  // ----------------------------
  // Notes
  // ----------------------------
  const addNote = async (note: Omit<Note, "id" | "createdAt">) => {
    const { data, error } = await supabase.from("notes").insert([{
      user_id: note.userId,
      title: note.title,
      description: note.description,
      is_pinned: note.isPinned,
      created_at: new Date().toISOString()
    }]).select().single()

    if (!error && data) {
      setNotes((prev) => [...prev, {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        isPinned: data.is_pinned,
        createdAt: new Date(data.created_at)
      }])
    }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const { data, error } = await supabase.from("notes")
      .update({
        title: updates.title,
        description: updates.description,
        is_pinned: updates.isPinned
      })
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                id: data.id,
                userId: data.user_id,
                title: data.title,
                description: data.description,
                isPinned: data.is_pinned,
                createdAt: new Date(data.created_at)
              }
            : n
        )
      )
    }
  }

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id)
    if (!error) setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  // ----------------------------
  // Requests
  // ----------------------------
  const addRequest = async (req: Omit<Request, "id" | "createdAt" | "updatedAt">) => {
    const { data, error } = await supabase.from("requests").insert([{
      user_id: req.userId,
      product_id: req.productId,
      title: req.title,
      reason: req.reason,
      quantity: req.quantity,
      status: req.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]).select().single()

    if (!error && data) {
      setRequests((prev) => [...prev, {
        id: data.id,
        userId: data.user_id,
        productId: data.product_id,
        title: data.title,
        reason: data.reason,
        quantity: data.quantity,
        status: data.status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }])
    }
  }

  const updateRequest = async (id: string, updates: Partial<Request>) => {
    const { data, error } = await supabase.from("requests").update({
      ...updates,
      updated_at: new Date().toISOString()
    }).eq("id", id).select().single()

    if (!error && data) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? {
            id: data.id,
            userId: data.user_id,
            productId: data.product_id,
            title: data.title,
            reason: data.reason,
            quantity: data.quantity,
            status: data.status,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          } : r
        )
      )
    }
  }

  const deleteRequest = async (id: string) => {
    const { error } = await supabase.from("requests").delete().eq("id", id)
    if (!error) setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  // ----------------------------
  // Actions
  // ----------------------------
  const addAction = async (action: Omit<Action, "id" | "createdAt" | "updatedAt">) => {
    const { data, error } = await supabase
      .from("actions")
      .insert([{
        type: action.type,
        product_id: action.productId,
        user_id: action.userId,
        quantity: action.quantity,
        reason: action.reason,
        status: action.status,
      }])
      .select("*, users(name), products(name)")
      .single()

    if (!error && data) {
      setActions((prev) => [...prev, {
        id: data.id,
        type: data.type,
        productId: data.product_id,
        userId: data.user_id,
        quantity: data.quantity,
        reason: data.reason,
        status: data.status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        productName: data.products?.name ?? "",
        userName: data.users?.name ?? "",
      }])
    }
  }

  const updateAction = async (id: string, updates: Partial<Action>) => {
    const { data, error } = await supabase
      .from("actions")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*, users(name), products(name)")
      .single()

    if (!error && data) {
      setActions(prev =>
        prev.map(a =>
          a.id === id
            ? {
                id: data.id,
                type: data.type,
                productId: data.product_id,
                userId: data.user_id,
                quantity: data.quantity,
                reason: data.reason,
                status: data.status,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
                productName: data.products?.name ?? "",
                userName: data.users?.name ?? "",
              }
            : a
        )
      )
    }
  }

  const deleteAction = async (id: string) => {
    const { error } = await supabase.from("actions").delete().eq("id", id)
    if (!error) {
      setActions(prev => prev.filter(a => a.id !== id))
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        loading, 
        users,
        products,
        registrationRequests,
        notes,
        requests,
        actions,
        currentUser,
        setCurrentUser,   
        login,
        logout,
        addUser,
        updateUserStatus,
        deleteUser,
        requestRegistration,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategories,
        getLowStockProducts,
        getTotalValue,
        approveRegistration,
        rejectRegistration,
        addNote,
        updateNote,
        deleteNote,
        addRequest,
        updateRequest,
        deleteRequest,
        addAction,
        updateAction,
        deleteAction,
      }}
    >
      {loading ? <Loadingx /> : children} {/* 🟢 NUEVO: renderiza loading global */}
    </GlobalContext.Provider>
  )
}

// ----------------------------
// Hook para consumir contexto
// ----------------------------
export function useGlobal() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("useGlobal debe usarse dentro de GlobalProvider")
  return context
}
