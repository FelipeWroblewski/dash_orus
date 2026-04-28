import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function Header({ filtros, setFiltros }) {
  const [opcoesFiltros, setOpcoesFiltros] = useState({
    teams: ["Todos"],
    sprints: ["Todos"],
    devs: ["Todos"],
  });

  useEffect(() => {
    axios.get("http://localhost:9001/filtros")
      .then((res) => {
        setOpcoesFiltros({
          teams: ["Todos", ...res.data.teams],
          sprints: ["Todos", ...res.data.sprints],
          devs: ["Todos", ...res.data.devs],
        });
      })
      .catch((err) => console.error("Erro ao carregar filtros:", err));
  }, []);

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
        <Select
          label="Team"
          value={filtros.team}
          onChange={(v) => handleChange("team", v)}
          options={opcoesFiltros.teams}
        />

        <Select
          label="Sprint"
          value={filtros.sprint}
          onChange={(v) => handleChange("sprint", v)}
          options={opcoesFiltros.sprints}
        />

        <Select
          label="Desenvolvedor"
          value={filtros.dev}
          onChange={(v) => handleChange("dev", v)}
          options={opcoesFiltros.devs}
        />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
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
          background: "#000",
          color: "#fff",
        }}
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}