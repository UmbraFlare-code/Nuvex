import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function Dashboard() {
  // Datos simulados
  const movimientos = [
    { fecha: "2025-09-20", entradas: 40, salidas: 15 },
    { fecha: "2025-09-21", entradas: 25, salidas: 30 },
    { fecha: "2025-09-22", entradas: 50, salidas: 20 },
    { fecha: "2025-09-23", entradas: 35, salidas: 25 },
  ];

  const stockCritico = [
    { id: 1, producto: "Focos LED", stock: 5, unidad: "cajas" },
    { id: 2, producto: "Cables Eléctricos", stock: 8, unidad: "rollos" },
    { id: 3, producto: "Tableros", stock: 2, unidad: "unidades" },
  ];

  // Datos financieros simulados
  const ingresosMes = 12500;
  const gastosMes = 8700;
  const balance = ingresosMes - gastosMes;

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        <h1>Panel de Control</h1>

        {/* Cards de resumen */}
        <div className="cards-container">
          <div className="card">
            <h3>Productos Totales</h3>
            <p>128</p>
          </div>
          <div className="card">
            <h3>Movimientos Hoy</h3>
            <p>24</p>
          </div>
          <div className="card">
            <h3>Alertas Activas</h3>
            <p>3</p>
          </div>
          <div className="card finance">
            <h3>Ingresos del Mes</h3>
            <p className="positivo">${ingresosMes.toLocaleString()}</p>
          </div>
          <div className="card finance">
            <h3>Gastos del Mes</h3>
            <p className="negativo">${gastosMes.toLocaleString()}</p>
          </div>
          <div className="card finance">
            <h3>Balance</h3>
            <p className={balance >= 0 ? "positivo" : "negativo"}>
              ${Math.abs(balance).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Resto del Dashboard */}
        <div className="charts-container">
          <div className="chart-box">
            <h3>Stock Crítico por Producto</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stockCritico}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="producto" type="category" />
                <Tooltip />
                <Bar dataKey="stock" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Tendencia de Movimientos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movimientos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entradas" stroke="#16a34a" />
                <Line type="monotone" dataKey="salidas" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stock-critico">
          <h3>Productos con Stock Crítico</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              {stockCritico.map((p) => (
                <tr key={p.id}>
                  <td>{p.producto}</td>
                  <td className="critico">{p.stock}</td>
                  <td>{p.unidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
