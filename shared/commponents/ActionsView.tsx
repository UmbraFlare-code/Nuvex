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
import { useState } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import styles from "../styles/ActionsView.module.css"

export default function ActionsView() {
  // ✅ Todo desde GlobalContext
  const { actions, addAction, updateAction, deleteAction, products, users } = useGlobal()

  const [filterType, setFilterType] = useState<string>("todas")
  const [filterStatus, setFilterStatus] = useState<string>("todas")

  // 🔎 Filtrado dinámico
  const filteredActions = actions.filter((action) => {
    const typeMatch = filterType === "todas" || action.type === filterType
    const statusMatch = filterStatus === "todas" || action.status === filterStatus
    return typeMatch && statusMatch
  })

  // === Helpers ===
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "entrada":
        return <MdTrendingUp size={24} />
      case "salida":
        return <MdTrendingDown size={24} />
      case "ajuste":
        return <MdSync size={24} />
      case "uso":
        return <MdExitToApp size={24} />
      case "retorno":
        return <MdAssignmentReturn size={24} />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "entrada":
        return styles.typeEntrada
      case "salida":
        return styles.typeSalida
      case "ajuste":
        return styles.typeAjuste
      case "uso":
        return styles.typeUso
      case "retorno":
        return styles.typeRetorno
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return styles.statusCompletada
      case "pendiente":
        return styles.statusPendiente
      case "cancelada":
        return styles.statusCancelada
      default:
        return ""
    }
  }

  // === Handlers ===
  const handleDelete = (id: string) => {
    if (confirm("¿Seguro que quieres eliminar esta acción?")) {
      deleteAction(id)
    }
  }

  const handleAddTestAction = () => {
    if (products.length === 0 || users.length === 0) {
      alert("No hay productos o usuarios cargados aún.")
      return
    }

    // ✅ Guardamos IDs para mantener relaciones
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
      {/* === Header === */}
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

      {/* === Filtros === */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Tipo de Acción:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={styles.select}>
            <option value="todas">Todas</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
            <option value="uso">Uso</option>
            <option value="retorno">Retorno</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={styles.select}>
            <option value="todas">Todas</option>
            <option value="completada">Completada</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{actions.length}</strong>
          </span>
          <span className={styles.statItem}>
            Mostrando: <strong>{filteredActions.length}</strong>
          </span>
        </div>
      </div>

      {/* === Tarjetas === */}
      <div className={styles.cardsGrid}>
        {filteredActions.map((action) => {
          const product = products.find((p) => p.id === action.productId)
          const user = users.find((u) => u.id === action.userId)

          return (
            <div key={action.id} className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${getTypeColor(action.type)}`}>{getTypeIcon(action.type)}</div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.cardActionButton}
                    title="Editar"
                    onClick={() =>
                      updateAction(action.id, {
                        status: action.status === "pendiente" ? "completada" : "pendiente",
                      })
                    }
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    className={styles.cardActionButtonDanger}
                    title="Eliminar"
                    onClick={() => handleDelete(action.id)}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={`${styles.typeBadge} ${getTypeColor(action.type)}`}>
                    {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                  </span>
                  {/* ✅ usamos createdAt */}
                  <span className={styles.cardDate}>{new Date(action.createdAt).toLocaleDateString("es-ES")}</span>
                </div>

                <h3 className={styles.cardTitle}>{product?.name ?? "Producto desconocido"}</h3>

                <div className={styles.cardInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cantidad:</span>
                    <span className={action.quantity > 0 ? styles.quantityPositive : styles.quantityNegative}>
                      {action.quantity > 0 ? "+" : ""}
                      {action.quantity} unidades
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Usuario:</span>
                    <span className={styles.infoValue}>{user?.name ?? "Usuario desconocido"}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Razón:</span>
                    <span className={styles.infoValue}>{action.reason}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={`${styles.statusBadge} ${getStatusColor(action.status)}`}>
                  {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {filteredActions.length === 0 && (
        <div className={styles.emptyState}>
          <p>No se encontraron acciones</p>
        </div>
      )}
    </div>
  )
}
