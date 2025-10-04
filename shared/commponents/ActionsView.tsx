"use client"

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdTrendingUp,
  MdTrendingDown,
  MdSync,
  MdExitToApp,
  MdAssignmentReturn,
} from "react-icons/md"
import { useState, useMemo } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/ActionsView.module.css"

export default function ActionsView() {
  const { actions, addAction, updateAction, deleteAction, products, users } = useGlobal()

  const [filterType, setFilterType] = useState("todas")
  const [filterStatus, setFilterStatus] = useState("todas")

  const filteredActions = useMemo(
    () =>
      actions.filter(
        (a) =>
          (filterType === "todas" || a.type === filterType) &&
          (filterStatus === "todas" || a.status === filterStatus)
      ),
    [actions, filterType, filterStatus]
  )

  const typeIconMap: Record<string, JSX.Element> = {
    entrada: <MdTrendingUp size={24} />,
    salida: <MdTrendingDown size={24} />,
    ajuste: <MdSync size={24} />,
    uso: <MdExitToApp size={24} />,
    retorno: <MdAssignmentReturn size={24} />,
  }

  const typeStyleMap: Record<string, string> = {
    entrada: styles.typeEntrada,
    salida: styles.typeSalida,
    ajuste: styles.typeAjuste,
    uso: styles.typeUso,
    retorno: styles.typeRetorno,
  }

  const statusStyleMap: Record<string, string> = {
    completada: styles.statusCompletada,
    pendiente: styles.statusPendiente,
    cancelada: styles.statusCancelada,
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Seguro que quieres eliminar esta acción?")) deleteAction(id)
  }

  const handleAddTestAction = () => {
    if (!products.length || !users.length) {
      alert("No hay productos o usuarios cargados aún.")
      return
    }
    addAction({
      type: "entrada",
      productId: products[0].id,
      userId: users[0].id,
      quantity: 5,
      reason: "Carga inicial de prueba",
      status: "pendiente",
    })
  }

  return (
    <div className={styles.actionsView}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Registro de Acciones</h1>
          <p className={styles.subtitle}>Historial de movimientos de inventario</p>
        </div>
        <button className={styles.addButton} onClick={handleAddTestAction}>
          <MdAdd size={20} />
          <span>Nueva Acción</span>
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <FilterSelect
          label="Tipo de Acción:"
          value={filterType}
          onChange={setFilterType}
          options={["todas", "entrada", "salida", "ajuste", "uso", "retorno"]}
        />
        <FilterSelect
          label="Estado:"
          value={filterStatus}
          onChange={setFilterStatus}
          options={["todas", "completada", "pendiente", "cancelada"]}
        />
        <div className={styles.stats}>
          <Stat label="Total" value={actions.length} />
          <Stat label="Mostrando" value={filteredActions.length} />
        </div>
      </div>

      {/* Cards */}
      <div className={styles.cardsGrid}>
        {filteredActions.map((action) => {
          const product = products.find((p) => p.id === action.productId)
          const user = users.find((u) => u.id === action.userId)

          return (
            <Card key={action.id}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${typeStyleMap[action.type]}`}>
                  {typeIconMap[action.type]}
                </div>
                <div className={styles.cardActions}>
                  <IconButton
                    icon={<MdEdit size={18} />}
                    title="Editar"
                    onClick={() =>
                      updateAction(action.id, {
                        status: action.status === "pendiente" ? "completada" : "pendiente",
                      })
                    }
                  />
                  <IconButton
                    icon={<MdDelete size={18} />}
                    title="Eliminar"
                    danger
                    onClick={() => handleDelete(action.id)}
                  />
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={`${styles.typeBadge} ${typeStyleMap[action.type]}`}>
                    {capitalize(action.type)}
                  </span>
                  <span className={styles.cardDate}>
                    {new Date(action.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{product?.name ?? "Producto desconocido"}</h3>

                <InfoRow label="Cantidad:" value={`${action.quantity > 0 ? "+" : ""}${action.quantity} unidades`} highlight={action.quantity > 0} />
                <InfoRow label="Usuario:" value={user?.name ?? "Usuario desconocido"} />
                <InfoRow label="Razón:" value={action.reason} />
              </div>

              <div className={styles.cardFooter}>
                <span className={`${styles.statusBadge} ${statusStyleMap[action.status]}`}>
                  {capitalize(action.status)}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredActions.length === 0 && <div className={styles.emptyState}>No se encontraron acciones</div>}
    </div>
  )
}

/* ===========================
   Componentes UI reutilizables
=========================== */

function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.actionCard}>{children}</div>
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className={styles.statItem}>
      {label}: <strong>{value}</strong>
    </span>
  )
}

function IconButton({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  title: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      className={danger ? styles.cardActionButtonDanger : styles.cardActionButton}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  options: string[]
}) {
  return (
    <div className={styles.filterGroup}>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {capitalize(opt)}
          </option>
        ))}
      </select>
    </div>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={highlight ? styles.quantityPositive : styles.infoValue}>{value}</span>
    </div>
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)