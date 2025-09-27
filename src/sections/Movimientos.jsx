import Navbar from "../components/Navbar";
import "../styles/movimientos.css";

export default function Movimientos() {
  // Datos simulados
  const movimientos = [
    { id: 1, fecha: "2025-09-20", producto: "Cable Eléctrico", tipo: "Entrada", cantidad: 50, usuario: "admin" },
    { id: 2, fecha: "2025-09-21", producto: "Focos LED", tipo: "Salida", cantidad: 10, usuario: "jtorres" },
    { id: 3, fecha: "2025-09-22", producto: "Taladro", tipo: "Entrada", cantidad: 3, usuario: "admin" },
    { id: 4, fecha: "2025-09-23", producto: "Tableros", tipo: "Salida", cantidad: 2, usuario: "mgomez" },
  ];

  return (
    <div className="movimientos">
      <Navbar />
      <main className="movimientos-main">
        <div className="movimientos-header">
          <h1>Registro de Movimientos</h1>
          <button className="add-btn">+ Nuevo Movimiento</button>
        </div>

        <table className="movimientos-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td>{m.fecha}</td>
                <td>{m.producto}</td>
                <td>
                  <span className={`tipo ${m.tipo.toLowerCase()}`}>
                    {m.tipo}
                  </span>
                </td>
                <td>{m.cantidad}</td>
                <td>{m.usuario}</td>
                <td>
                  <button className="detail-btn">Detalle</button>
                  <button className="delete-btn">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
