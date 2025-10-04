"use client"

import { useState } from "react"
import { useGlobal } from "@/features/context/GlobalContext"
import {
  MdPerson,
  MdEmail,
  MdCheckCircle,
  MdCancel,
  MdBlock,
  MdDelete,
  MdSearch,
  MdPending,
  MdAdminPanelSettings,
} from "react-icons/md"
import styles from "../styles/UserManagementView.module.css"

export default function UserManagementView() {
  const {
    users,
    registrationRequests,
    approveRegistration,
    rejectRegistration,
    updateUserStatus,
    deleteUser,
  } = useGlobal()

  const [searchEmail, setSearchEmail] = useState("")
  const [activeTab, setActiveTab] = useState<"users" | "requests">("users")

  // === Filtros ===
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  )

  const pendingRequests = registrationRequests.filter((req) => req.status === "pending")
  const processedRequests = registrationRequests.filter((req) => req.status !== "pending")

  // === Handlers ===
  const handleToggleStatus = (userId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    if (
      confirm(
        `¿Está seguro de ${newStatus === "active" ? "activar" : "desactivar"} este usuario?`
      )
    ) {
      updateUserStatus(userId, newStatus)
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      confirm(
        `¿Está seguro de eliminar al usuario ${userName}? Esta acción no se puede deshacer.`
      )
    ) {
      deleteUser(userId)
    }
  }

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>Administre empleados y solicitudes de registro</p>
        </div>
      </div>

      {/* === Tabs === */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "users" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <MdPerson size={18} />
          Usuarios ({users.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "requests" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <MdPending size={18} />
          Solicitudes ({pendingRequests.length})
        </button>
      </div>

      {/* === Usuarios === */}
      {activeTab === "users" && (
        <>
          <div className={styles.searchBar}>
            <MdSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por correo electrónico..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.usersGrid}>
            {filteredUsers.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userHeader}>
                  <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{user.name}</h3>
                    <div className={styles.userEmail}>
                      <MdEmail size={14} />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className={styles.userDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Rol:</span>
                    <span
                      className={`${styles.roleBadge} ${
                        user.role === "admin" ? styles.roleAdmin : styles.roleEmployee
                      }`}
                    >
                      {user.role === "admin" ? (
                        <MdAdminPanelSettings size={14} />
                      ) : (
                        <MdPerson size={14} />
                      )}
                      {user.role === "admin" ? "Administrador" : "Empleado"}
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.label}>Estado:</span>
                    <span
                      className={`${styles.statusBadge} ${
                        user.status === "active"
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Acciones solo si no es admin */}
                {user.role !== "admin" && (
                  <div className={styles.userActions}>
                    <button
                      className={
                        user.status === "active"
                          ? styles.deactivateButton
                          : styles.activateButton
                      }
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {user.status === "active" ? (
                        <>
                          <MdBlock size={16} />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <MdCheckCircle size={16} />
                          Activar
                        </>
                      )}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      <MdDelete size={16} />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className={styles.emptyState}>
              <MdPerson size={48} />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </>
      )}

      {/* === Solicitudes === */}
      {activeTab === "requests" && (
        <>
          {pendingRequests.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Solicitudes Pendientes</h2>
              <div className={styles.requestsGrid}>
                {pendingRequests.map((request) => (
                  <div key={request.id} className={styles.requestCard}>
                    <div className={styles.requestHeader}>
                      <div className={styles.requestAvatar}>
                        {request.name.charAt(0)}
                      </div>
                      <div className={styles.requestInfo}>
                        <h3 className={styles.requestName}>{request.name}</h3>
                        <div className={styles.requestEmail}>
                          <MdEmail size={14} />
                          {request.email}
                        </div>
                      </div>
                    </div>

                    <div className={styles.requestDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Fecha de solicitud:</span>
                        <span className={styles.value}>
                          {request.requestedAt.toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>

                    <div className={styles.requestActions}>
                      <button
                        className={styles.approveButton}
                        onClick={() => approveRegistration(request.id)}
                      >
                        <MdCheckCircle size={18} />
                        Aprobar
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => rejectRegistration(request.id)}
                      >
                        <MdCancel size={18} />
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {processedRequests.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Solicitudes Procesadas</h2>
              <div className={styles.requestsGrid}>
                {processedRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`${styles.requestCard} ${styles.requestCardProcessed}`}
                  >
                    <div className={styles.requestHeader}>
                      <div className={styles.requestAvatar}>
                        {request.name.charAt(0)}
                      </div>
                      <div className={styles.requestInfo}>
                        <h3 className={styles.requestName}>{request.name}</h3>
                        <div className={styles.requestEmail}>
                          <MdEmail size={14} />
                          {request.email}
                        </div>
                      </div>
                      <span
                        className={`${styles.statusBadge} ${
                          request.status === "approved"
                            ? styles.statusApproved
                            : styles.statusRejected
                        }`}
                      >
                        {request.status === "approved" ? "Aprobada" : "Rechazada"}
                      </span>
                    </div>

                    <div className={styles.requestDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Fecha de solicitud:</span>
                        <span className={styles.value}>
                          {request.requestedAt.toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {registrationRequests.length === 0 && (
            <div className={styles.emptyState}>
              <MdPending size={48} />
              <p>No hay solicitudes de registro</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
