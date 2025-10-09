"use client"

import SearchBox from "@/shared/components/SearchBox"
import fb from "../styles/FiltersBar.module.css"

type Props = {
  dataset: "actions" | "requests"
  users: Array<{ id: string; name: string }>
  products: Array<{ id: string; name: string }>
  value: {
    userId?: string | "all"
    productId?: string | "all"
    dateFrom?: string
    dateTo?: string
    q?: string
    actionType?: "entrada" | "salida" | "ajuste" | "uso" | "retorno" | "all"
    requestStatus?: "pending" | "accepted" | "rejected" | "all"
  }
  onChange: (patch: Partial<Props["value"]>) => void
}

export default function FiltersBar({
  dataset,
  users,
  products,
  value,
  onChange,
}: Props) {
  return (
    <section className={fb.card} aria-label="Filtros de reportes">
      <div className={fb.grid}>
        {/* Búsqueda */}
        <div className={`${fb.field} ${fb.span6}`}>
          <SearchBox
            value={value.q ?? ""}
            onChange={(q) => onChange({ q })}
            placeholder="Buscar término…"
            ariaLabel="Filtro"
            className={fb.searchBox}
          />
        </div>

        {/* Empleado */}
        <div className={`${fb.field} ${fb.span3}`}>
          <label className={fb.label} htmlFor="rep-user">Empleado</label>
          <select
            id="rep-user"
            value={value.userId ?? "all"}
            onChange={(e) => onChange({ userId: e.target.value as any })}
          >
            <option value="all">Todos</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Producto */}
        <div className={`${fb.field} ${fb.span3}`}>
          <label className={fb.label} htmlFor="rep-product">Producto</label>
          <select
            id="rep-product"
            value={value.productId ?? "all"}
            onChange={(e) => onChange({ productId: e.target.value as any })}
          >
            <option value="all">Todos</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <div className={`${fb.field} ${fb.span2}`}>
          <label className={fb.label} htmlFor="rep-from">Desde</label>
          <input
            id="rep-from"
            type="date"
            value={value.dateFrom ?? ""}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
          />
        </div>

        <div className={`${fb.field} ${fb.span2}`}>
          <label className={fb.label} htmlFor="rep-to">Hasta</label>
          <input
            id="rep-to"
            type="date"
            value={value.dateTo ?? ""}
            onChange={(e) => onChange({ dateTo: e.target.value })}
          />
        </div>

        {/* Dinámico */}
        <div className={`${fb.field} ${fb.span4}`}>
          <label className={fb.label} htmlFor="rep-dyn">
            {dataset === "actions" ? "Tipo de movimiento" : "Estado"}
          </label>

          {dataset === "actions" ? (
            <select
              id="rep-dyn"
              value={value.actionType ?? "all"}
              onChange={(e) => onChange({ actionType: e.target.value as any })}
            >
              <option value="all">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="ajuste">Ajuste</option>
              <option value="uso">Uso</option>
              <option value="retorno">Retorno</option>
            </select>
          ) : (
            <select
              id="rep-dyn"
              value={value.requestStatus ?? "all"}
              onChange={(e) => onChange({ requestStatus: e.target.value as any })}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="accepted">Aceptada</option>
              <option value="rejected">Rechazada</option>
            </select>
          )}
        </div>
      </div>
    </section>
  )
}
