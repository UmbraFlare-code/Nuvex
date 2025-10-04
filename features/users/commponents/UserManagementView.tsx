"use client"

import { useState, useMemo } from "react"
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
  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        u.email.toLowerCase().includes(searchEmail.toLowerCase())
      ),
    [users, searchEmail]
  )

  const pendingRequests = registrationRequests.filter((r) => r.status === "pending")
  const processedRequests = registrationRequests.filter((r) => r.status !== "pending")

  // === Handlers ===
  const handleToggleStatus = (id: string, current: "active" | "inactive") => {
    const newStatus = current === "active" ? "inactive" : "active"
    if (confirm(`¿Está seguro de ${newStatus === "active" ? "activar" : "desactivar"} este usuario?`)) {
      updateUserStatus(id, newStatus)
    }
  }

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      deleteUser(id)
    }
  }

  return (
    <div className={styles.userManagement}>
      <Header />

      {/* Tabs */}
      <div className={styles.tabs}>
        <Tab
          label="Usuarios"
          icon={<MdPerson size={18} />}
          count={users.length}
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
        />
        <Tab
          label="Solicitudes"
          icon={<MdPending size={18} />}
          count={pendingRequests.length}
          active={activeTab === "requests"}
          onClick={() => setActiveTab("requests")}
        />
      </div>

      {/* Usuarios */}
      {activeTab === "users" && (
        <>
          <SearchBar value={searchEmail} onChange={setSearchEmail} />
          <div className={styles.usersGrid}>
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
          {filteredUsers.length === 0 && (
            <EmptyState icon={<MdPerson size={48} />} text="No se encontraron usuarios" />
          )}
        </>
      )}

      {/* Solicitudes */}
      {activeTab === "requests" && (
        <>
          <Section title="Solicitudes Pendientes">
            {pendingRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onApprove={() => approveRegistration(req.id)}
                onReject={() => rejectRegistration(req.id)}
              />
            ))}
          </Section>

          <Section title="Solicitudes Procesadas">
            {processedRequests.map((req) => (
              <RequestCard key={req.id} request={req} processed />
            ))}
          </Section>

          {registrationRequests.length === 0 && (
            <EmptyState
              icon={<MdPending size={48} />}
              text="No hay solicitudes de registro"
            />
          )}
        </>
      )}
    </div>
  )
}

/* =====================
   Subcomponentes UI
===================== */

const Header = () => (
  <div className={styles.header}>
    <div>
      <h1 className={styles.title}>Gestión de Usuarios</h1>
      <p className={styles.subtitle}>Administre empleados y solicitudes de registro</p>
    </div>
  </div>
)

const Tab = ({
  label,
  icon,
  count,
  active,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  count: number
  active: boolean
  onClick: () => void
}) => (
  <button
    className={`${styles.tab} ${active ? styles.tabActive : ""}`}
    onClick={onClick}
  >
    {icon}
    {label} ({count})
  </button>
)

const SearchBar = ({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) => (
  <div className={styles.searchBar}>
    <MdSearch size={20} />
    <input
      type="text"
      placeholder="Buscar por correo electrónico..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.searchInput}
    />
  </div>
)

const UserCard = ({
  user,
  onToggleStatus,
  onDelete,
}: {
  user: any
  onToggleStatus: (id: string, status: "active" | "inactive") => void
  onDelete: (id: string, name: string) => void
}) => (
  <div className={styles.userCard}>
    <div className={styles.userHeader}>
      <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{user.name}</h3>
        <div className={styles.userEmail}>
          <MdEmail size={14} /> {user.email}
        </div>
      </div>
    </div>

    <div className={styles.userDetails}>
      <DetailRow
        label="Rol"
        value={
          <span
            className={`${styles.roleBadge} ${
              user.role === "admin" ? styles.roleAdmin : styles.roleEmployee
            }`}
          >
            {user.role === "admin" ? <MdAdminPanelSettings size={14} /> : <MdPerson size={14} />}
            {user.role === "admin" ? "Administrador" : "Empleado"}
          </span>
        }
      />
      <DetailRow
        label="Estado"
        value={
          <span
            className={`${styles.statusBadge} ${
              user.status === "active" ? styles.statusActive : styles.statusInactive
            }`}
          >
            {user.status === "active" ? "Activo" : "Inactivo"}
          </span>
        }
      />
    </div>

    {user.role !== "admin" && (
      <div className={styles.userActions}>
        <button
          className={
            user.status === "active" ? styles.deactivateButton : styles.activateButton
          }
          onClick={() => onToggleStatus(user.id, user.status)}
        >
          {user.status === "active" ? (
            <>
              <MdBlock size={16} /> Desactivar
            </>
          ) : (
            <>
              <MdCheckCircle size={16} /> Activar
            </>
          )}
        </button>
        <button className={styles.deleteButton} onClick={() => onDelete(user.id, user.name)}>
          <MdDelete size={16} /> Eliminar
        </button>
      </div>
    )}
  </div>
)

const RequestCard = ({
  request,
  processed,
  onApprove,
  onReject,
}: {
  request: any
  processed?: boolean
  onApprove?: () => void
  onReject?: () => void
}) => (
  <div
    className={`${styles.requestCard} ${processed ? styles.requestCardProcessed : ""}`}
  >
    <div className={styles.requestHeader}>
      <div className={styles.requestAvatar}>{request.name.charAt(0)}</div>
      <div className={styles.requestInfo}>
        <h3 className={styles.requestName}>{request.name}</h3>
        <div className={styles.requestEmail}>
          <MdEmail size={14} /> {request.email}
        </div>
      </div>
      {processed && (
        <span
          className={`${styles.statusBadge} ${
            request.status === "approved" ? styles.statusApproved : styles.statusRejected
          }`}
        >
          {request.status === "approved" ? "Aprobada" : "Rechazada"}
        </span>
      )}
    </div>

    <DetailRow
      label="Fecha de solicitud"
      value={request.requestedAt.toLocaleDateString("es-ES")}
    />

    {!processed && (
      <div className={styles.requestActions}>
        <button className={styles.approveButton} onClick={onApprove}>
          <MdCheckCircle size={18} /> Aprobar
        </button>
        <button className={styles.rejectButton} onClick={onReject}>
          <MdCancel size={18} /> Rechazar
        </button>
      </div>
    )}
  </div>
)

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className={styles.detailRow}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{value}</span>
  </div>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) =>
  children && (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.requestsGrid}>{children}</div>
    </div>
  )

const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className={styles.emptyState}>
    {icon}
    <p>{text}</p>
  </div>
)
