import Navbar from "../components/Navbar";
import "../styles/productos.css";

export default function Productos() {
  const productos = [
    { id: 1, nombre: "Focos LED", categoria: "Iluminación", stock: 5, unidad: "cajas" },
    { id: 2, nombre: "Cables Eléctricos", categoria: "Material Eléctrico", stock: 8, unidad: "rollos" },
    { id: 3, nombre: "Tableros", categoria: "Control", stock: 2, unidad: "unidades" },
    { id: 4, nombre: "Taladro", categoria: "Herramientas", stock: 15, unidad: "unidades" },
  ];

  return (
    <div className="productos">
      <Navbar />
      <main className="productos-main">
        <div className="productos-header">
          <h1>Gestión de Productos</h1>
          <button className="add-btn">+ Nuevo Producto</button>
        </div>

        <div className="productos-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Unidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td className={p.stock <= 5 ? "critico" : ""}>{p.stock}</td>
                  <td>{p.unidad}</td>
                  <td>
                    <button className="edit-btn">Editar</button>
                    <button className="delete-btn">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista responsive en tarjetas */}
        <div className="productos-cards">
          {productos.map((p) => (
            <div key={p.id} className="producto-card">
              <h3>{p.nombre}</h3>
              <p><span>Categoría:</span> {p.categoria}</p>
              <p>
                <span>Stock:</span>{" "}
                <span className={p.stock <= 5 ? "critico" : ""}>{p.stock}</span>
              </p>
              <p><span>Unidad:</span> {p.unidad}</p>
              <div className="acciones">
                <button className="edit-btn">Editar</button>
                <button className="delete-btn">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
