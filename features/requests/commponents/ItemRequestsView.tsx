"use client"

import { useState } from "react"
import { MdAdd, MdShoppingCart, MdCheckCircle, MdCancel, MdPending } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/ItemRequestsView.module.css"

interface ItemRequestsViewProps {
  isAdmin?: boolean
  currentUser: string // 👈 nombre del usuario actual (debería venir de sesión)
}

export default function ItemRequestsView({ isAdmin = false, currentUser }: ItemRequestsViewProps) {
  const { products, requests, addRequest, updateRequest, users } = useGlobal()
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all")

  // === Handlers ===
  const handleCreateRequest = async () => {
    if (!selectedProduct || quantity < 1 || !reason.trim()) {
      alert("Por favor complete todos los campos")
      return
    }

    const user = users.find((u) => u.name === currentUser)
    if (!user) {
      alert("Usuario no encontrado")
      return
    }

    await addRequest({
      userId: user.id,
      productId: selectedProduct,
      title: `Solicitud de ${quantity} unidades`,
      reason: reason.trim(),
      quantity,
      status: "pending",
    })

    setShowModal(false)
    setSelectedProduct("")
    setQuantity(1)
    setReason("")
  }

  const handleApprove = async (id: string, note: string) => {
    const admin = users.find((u) => u.name === currentUser)
    await updateRequest(id, {
      status: "accepted",
      reason: note,
      updatedAt: new Date(),
    })
  }

  const handleReject = async (id: string, note: string) => {
    const admin = users.find((u) => u.name === currentUser)
    await updateRequest(id, {
      status: "rejected",
      reason: note,
      updatedAt: new Date(),
    })
  }

  // === Filtros ===
  const filteredRequests = requests.filter((req) => {
    if (filterStatus === "all") return true
    return req.status === filterStatus
  })

  const userRequests = isAdmin
    ? filteredRequests
    : filteredRequests.filter((req) => {
        const user = users.find((u) => u.id === req.userId)
        return user?.name === currentUser
      })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <MdCheckCircle size={20} />
      case "rejected":
        return <MdCancel size={20} />
      default:
        return <MdPending size={20} />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "accepted":
        return styles.statusApproved
      case "rejected":
        return styles.statusRejected
      default:
        return styles.statusPending
    }
  }

  return (
    <div className={styles.requestsView}>
      {/* === Header === */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Solicitudes de Ítems</h1>
          <p className={styles.subtitle}>
            {isAdmin ? "Gestione las solicitudes de inventario" : "Solicite ítems del inventario"}
          </p>
        </div>
        {!isAdmin && (
          <button className={styles.addButton} onClick={() => setShowModal(true)}>
            <MdAdd size={20} />
            <span>Nueva Solicitud</span>
          </button>
        )}
      </div>

      {/* === Filtros === */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={styles.select}
          >
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{userRequests.length}</strong>
          </span>
          <span className={styles.statItem}>
            Pendientes: <strong>{userRequests.filter((r) => r.status === "pending").length}</strong>
          </span>
        </div>
      </div>

      {/* === Cards === */}
      <div className={styles.requestsGrid}>
        {userRequests.map((request) => {
          const product = products.find((p) => p.id === request.productId)
          const user = users.find((u) => u.id === request.userId)

          return (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <div className={styles.productInfo}>
                  <MdShoppingCart size={24} className={styles.productIcon} />
                  <div>
                    <h3 className={styles.productName}>{product?.name ?? "Producto desconocido"}</h3>
                    <p className={styles.quantity}>Cantidad: {request.quantity}</p>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${getStatusClass(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status === "pending"
                    ? "Pendiente"
                    : request.status === "accepted"
                    ? "Aprobada"
                    : "Rechazada"}
                </span>
              </div>

              <div className={styles.requestBody}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Motivo:</span>
                  <p className={styles.reason}>{request.reason}</p>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Solicitado por:</span>
                  <span className={styles.value}>{user?.name ?? "Usuario desconocido"}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Fecha:</span>
                  <span className={styles.value}>
                    {new Date(request.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>

              {isAdmin && request.status === "pending" && (
                <div className={styles.requestActions}>
                  <button
                    className={styles.approveButton}
                    onClick={() => {
                      const note = prompt("Nota para el empleado (opcional):")
                      handleApprove(request.id, note || "Solicitud aprobada")
                    }}
                  >
                    <MdCheckCircle size={18} />
                    Aprobar
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => {
                      const note = prompt("Motivo del rechazo:")
                      if (note) handleReject(request.id, note)
                    }}
                  >
                    <MdCancel size={18} />
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* === Empty state === */}
      {userRequests.length === 0 && (
        <div className={styles.emptyState}>
          <MdShoppingCart size={48} />
          <p>No hay solicitudes</p>
        </div>
      )}

      {/* === Modal === */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Nueva Solicitud de Ítem</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Producto:</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className={styles.select}
              >
                <option value="">Seleccione un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Motivo de la solicitud:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Explique por qué necesita este ítem..."
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={styles.submitButton} onClick={handleCreateRequest}>
                Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
