"use client";

import { useEffect, useState } from "react";

export default function MonitorPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/metrics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Cargando métricas...</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Monitor de Recursos del Servidor
      </h1>

      <div style={{ marginBottom: "10px" }}>
        <strong>Memoria RSS:</strong> {(data.rss / 1024 / 1024).toFixed(2)} MB
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Heap Usado:</strong> {(data.heapUsed / 1024 / 1024).toFixed(2)} MB
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Carga CPU (1m / 5m / 15m):</strong> {data.load.join(" | ")}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Uptime:</strong> {data.uptime.toFixed(1)} segundos
      </div>

      <div>
        <strong>Última actualización:</strong>{" "}
        {new Date(data.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
