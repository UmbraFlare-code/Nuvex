import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Páginas de ejemplo
function Home() {
  return <h2>Bienvenido a IntegraStock</h2>;
}

function Products() {
  return <h2>Gestión de productos</h2>;
}

function About() {
  return <h2>Sobre este proyecto</h2>;
}

// Componente principal
function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Nuvex</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ margin: "0 10px" }}>Inicio</Link>
          <Link to="/products" style={{ margin: "0 10px" }}>Productos</Link>
          <Link to="/about" style={{ margin: "0 10px" }}>Acerca de</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
