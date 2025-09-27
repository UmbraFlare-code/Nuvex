import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgot.css";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const handleForgot = (e) => {
    e.preventDefault();
    alert(`Se ha enviado un enlace de recuperación a: ${correo}`);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <form className="card forgot-container" onSubmit={handleForgot}>
        <h1 className="title">¿Olvidó su contraseña?</h1>
        <p className="subtitle">
          Ingrese su correo electrónico y le enviaremos un enlace para
          restablecer su contraseña.
        </p>

        <div className="input-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="button">Enviar enlace</button>

        <div className="forgot-footer">
          <a href="/login" className="link">Volver al inicio de sesión</a>
        </div>
      </form>
    </div>
  );
}
