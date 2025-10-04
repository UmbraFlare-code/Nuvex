"use client"

import { useState, useMemo } from "react"
import { MdAdd, MdShoppingCart, MdCheckCircle, MdCancel, MdPending } from "react-icons/md"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/ItemRequestsView.module.css"

interface ItemRequestsViewProps {
  isAdmin?: boolean
  currentUser: string
}

export default function ItemRequestsView({ isAdmin = false, currentUser }: ItemRequestsViewProps) {
  const { products, requests, addRequest, updateRequest, users } = useGlobal()
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all")

  const filteredRequests = useMemo(() => {
    const base = filterStatus === "all" ? requests : requests.filter(r => r.status === filterStatus)
    return isAdmin ? base : base.filter(r => users.find(u => u.id === r.userId)?.name === currentUser)
  }, [requests, filterStatus, isAdmin, users, currentUser])

  const handleCreateRequest = async () => {
    if (!selectedProduct || quantity < 1 || !reason.trim()) {
      alert("Por favor complete todos los campos")
      return
    }

    const user = users.find(u => u.name === currentUser)
    if (!user) return alert("Usuario no encontrado")

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

  const updateStatus = async (id: string, status: "accepted" | "rejected", note: string) => {
    await updateRequest(id, { status, reason: note, updatedAt: new Date() })
  }

  return (
    <div className={styles.requestsView}>
      <Header isAdmin={isAdmin} onNew={() => setShowModal(true)} />
      <Filters filterStatus={filterStatus} setFilterStatus={setFilterStatus} total={filteredRequests.length} pending={filteredRequests.filter(r => r.status === "pending").length} />

      <div className={styles.requestsGrid}>
        {filteredRequests.map(req => (
          <RequestCard
            key={req.id}
            request={req}
            products={products}
            users={users}
            isAdmin={isAdmin}
            onApprove={note => updateStatus(req.id, "accepted", note)}
            onReject={note => updateStatus(req.id, "rejected", note)}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && <EmptyState />}
      {showModal && <RequestModal products={products} quantity={quantity} setQuantity={setQuantity} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} reason={reason} setReason={setReason} onClose={() => setShowModal(false)} onSubmit={handleCreateRequest} />}
    </div>
  )
}

function Header({ isAdmin, onNew }: { isAdmin: boolean; onNew: () => void }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Solicitudes de Ítems</h1>
        <p className={styles.subtitle}>{isAdmin ? "Gestione las solicitudes de inventario" : "Solicite ítems del inventario"}</p>
      </div>
      {!isAdmin && (
        <button className={styles.addButton} onClick={onNew}>
          <MdAdd size={20} />
          <span>Nueva Solicitud</span>
        </button>
      )}
    </div>
  )
}

function Filters({ filterStatus, setFilterStatus, total, pending }: any) {
  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label>Estado:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={styles.select}>
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="accepted">Aprobadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>
      <div className={styles.stats}>
        <span className={styles.statItem}>Total: <strong>{total}</strong></span>
        <span className={styles.statItem}>Pendientes: <strong>{pending}</strong></span>
      </div>
    </div>
  )
}

function RequestCard({ request, products, users, isAdmin, onApprove, onReject }: any) {
  const product = products.find((p: any) => p.id === request.productId)
  const user = users.find((u: any) => u.id === request.userId)

  const statusConfig: any = {
    accepted: { icon: <MdCheckCircle size={20} />, label: "Aprobada", className: styles.statusApproved },
    rejected: { icon: <MdCancel size={20} />, label: "Rechazada", className: styles.statusRejected },
    pending: { icon: <MdPending size={20} />, label: "Pendiente", className: styles.statusPending },
  }
  const { icon, label, className } = statusConfig[request.status] || statusConfig.pending

  return (
    <div className={styles.requestCard}>
      <div className={styles.requestHeader}>
        <div className={styles.productInfo}>
          <MdShoppingCart size={24} className={styles.productIcon} />
          <div>
            <h3 className={styles.productName}>{product?.name ?? "Producto desconocido"}</h3>
            <p className={styles.quantity}>Cantidad: {request.quantity}</p>
          </div>
        </div>
        <span className={`${styles.statusBadge} ${className}`}>{icon}{label}</span>
      </div>

      <div className={styles.requestBody}>
        <InfoRow label="Motivo:" value={request.reason} />
        <InfoRow label="Solicitado por:" value={user?.name ?? "Usuario desconocido"} />
        <InfoRow label="Fecha:" value={new Date(request.createdAt).toLocaleDateString("es-ES")} />
      </div>

      {isAdmin && request.status === "pending" && (
        <div className={styles.requestActions}>
          <button className={styles.approveButton} onClick={() => onApprove(prompt("Nota (opcional):") || "Solicitud aprobada")}>
            <MdCheckCircle size={18} /> Aprobar
          </button>
          <button className={styles.rejectButton} onClick={() => { const note = prompt("Motivo del rechazo:"); if (note) onReject(note) }}>
            <MdCancel size={18} /> Rechazar
          </button>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <MdShoppingCart size={48} />
      <p>No hay solicitudes</p>
    </div>
  )
}

function RequestModal({ products, quantity, setQuantity, selectedProduct, setSelectedProduct, reason, setReason, onClose, onSubmit }: any) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Nueva Solicitud de Ítem</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Producto:</label>
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className={styles.select}>
            <option value="">Seleccione un producto</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cantidad:</label>
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Motivo de la solicitud:</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} className={styles.textarea} rows={4} placeholder="Explique por qué necesita este ítem..." />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
          <button className={styles.submitButton} onClick={onSubmit}>Enviar Solicitud</button>
        </div>
      </div>
    </div>
  )
}