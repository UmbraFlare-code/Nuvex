import Navbar from "../components/Navbar";
import "../styles/usuarios.css";

export default function Usuarios() {
  // Datos simulados
  const usuarios = [
    { id: 1, nombre: "Juan Torres", correo: "juan@cvelectric.com", rol: "Administrador", estado: "Activo" },
    { id: 2, nombre: "María Gómez", correo: "maria@cvelectric.com", rol: "Operador", estado: "Activo" },
    { id: 3, nombre: "Pedro Silva", correo: "pedro@cvelectric.com", rol: "Supervisor", estado: "Inactivo" },
  ];

  return (
    <div className="usuarios">
      <Navbar />
      <main className="usuarios-main">
        <div className="usuarios-header">
          <h1>Gestión de Usuarios</h1>
          <button className="add-btn">+ Nuevo Usuario</button>
        </div>

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>
                  <span className={`estado ${u.estado.toLowerCase()}`}>
                    {u.estado}
                  </span>
                </td>
                <td>
                  <button className="edit-btn">Editar</button>
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
