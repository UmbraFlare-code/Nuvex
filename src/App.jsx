import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./sections/Login";
import Dashboard from "./sections/Dashboard";
import Productos from "./sections/Productos";
import Movimientos from "./sections/Movimientos";
import Reportes from "./sections/Reportes";
import Usuarios from "./sections/Usuarios";
import ForgotPassword from "./sections/ForgotPassword";

const isAuthenticated = () =>
  Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));

function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Raíz dinámica */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />}
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Protegidas */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/productos"
          element={
            <RequireAuth>
              <Productos />
            </RequireAuth>
          }
        />
        <Route
          path="/movimientos"
          element={
            <RequireAuth>
              <Movimientos />
            </RequireAuth>
          }
        />
        <Route
          path="/reportes"
          element={
            <RequireAuth>
              <Reportes />
            </RequireAuth>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RequireAuth>
              <Usuarios />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
