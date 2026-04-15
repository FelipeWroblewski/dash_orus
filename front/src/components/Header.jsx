import React from "react";
import logo from "../assets/logo.png";

export default function Header({ filtros, setFiltros }) {
  const handleChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  return (
    <div>
      {/* TOPO PRETO */}
      <div
        style={{
          background: "#000",
          color: "#fff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 40 }} />

        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 40 }}>Indicadores de Sprint</h2>
          <span style={{ fontSize: 16 }}>
            Monitoramento do progresso das sprints, incluindo entregas, horas
            planejadas e análise de desvios.
          </span>
        </div>
      </div>

      {/* FILTROS */}
      <div
        style={{
          background: "#87705F",
          padding: "20px 40px",
          display: "flex",
          gap: 20,
          justifyContent: "flex-end",
        }}
      >
        {/* TEAM */}
        <Select
          style={{
            background: "#000",
            color: "#fff",
            border: "1px solid #000",
            padding: "8px 12px",
            borderRadius: 6,
          }}
          label="Team"
          value={filtros.team}
          onChange={(v) => handleChange("team", v)}
          options={["Todos", "Web", "Dados"]}
        />

        {/* SPRINT */}
        <Select
          style={{
            background: "#000",
            color: "#fff",
            border: "1px solid #000",
            padding: "8px 12px",
            borderRadius: 6,
          }}
          label="Sprint"
          value={filtros.sprint}
          onChange={(v) => handleChange("sprint", v)}
          options={["Todos", "1", "2", "3"]}
        />

        {/* DEV */}
        <Select
            style={{
            background: "#000",
            color: "#fff",
            border: "1px solid #000",
            padding: "8px 12px",
            borderRadius: 6,
          }}
          label="Desenvolvedor"
          value={filtros.dev}
          onChange={(v) => handleChange("dev", v)}
          options={["Todos", "Felipe", "João", "Maria"]}
        />
      </div>
    </div>
  );
}

// =======================
// COMPONENTE SELECT
// =======================

function Select({ label, value, onChange, options, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ color: "#fff", fontSize: 14 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: 8,
          borderRadius: 5,
          border: "none",
          width: 150,
          ...style,
        }}
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
