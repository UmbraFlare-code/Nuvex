import Navbar from "../components/Navbar";
import "../styles/reportes.css";

export default function Reportes() {
  // Datos simulados
  const reportes = [
    { id: 1, fecha: "2025-09-20", tipo: "Inventario General", descripcion: "Estado del stock actual." },
    { id: 2, fecha: "2025-09-22", tipo: "Movimientos", descripcion: "Entradas y salidas de la última semana." },
    { id: 3, fecha: "2025-09-25", tipo: "Alertas", descripcion: "Productos con stock crítico o excedente." },
  ];

  return (
    <div className="reportes">
      <Navbar />
      <main className="reportes-main">
        <div className="reportes-header">
          <h1>Reportes</h1>
          <button className="add-btn">+ Generar Reporte</button>
        </div>

        <table className="reportes-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id}>
                <td>{r.fecha}</td>
                <td>{r.tipo}</td>
                <td>{r.descripcion}</td>
                <td>
                  <button className="detail-btn">Ver</button>
                  <button className="download-btn">Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
