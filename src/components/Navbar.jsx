import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Botón hamburguesa visible en móviles */}
      <button className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <nav className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="logo">Inventario</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/movimientos">Movimientos</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
          <li><Link to="/usuarios">Usuarios</Link></li>
        </ul>

        <button className="logout" onClick={logout}>Cerrar sesión</button>
      </nav>
    </>
  );
}
