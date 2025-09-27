import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulación de validación
    const ok = correo === "admin@empresa.com" && password === "123456";
    if (!ok) {
      alert("Credenciales incorrectas");
      return;
    }

    // token simulado (en real, lo devuelve el backend)
    const token = "token_simulado_" + Date.now();

    if (remember) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }

    // Navega y reemplaza el histórico para evitar volver al login con Back
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="app-container">
      <form className="card login-container" onSubmit={handleLogin}>
        <h1 className="title">Iniciar Sesión</h1>

        <div className="input-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="checkbox-group" style={{ margin: "8px 0 16px" }}>
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={() => setRemember((v) => !v)}
          />
          <label htmlFor="remember" style={{ marginLeft: 8 }}>
            Mantener sesión
          </label>
        </div>

        <button type="submit" className="button">Entrar</button>

        <div className="login-footer" style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/forgot" className="link">¿Olvidó su contraseña?</Link>
        </div>
      </form>
    </div>
  );
}
