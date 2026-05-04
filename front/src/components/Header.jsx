import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function Header({ filters, setFilters }) {
  const [filterOptions, setFilterOptions] = useState({
    teams: ["Todos"],
    sprints: ["Todos"],
    devs: ["Todos"],
  });

  useEffect(() => {
    axios
      .get("http://localhost:9001/filters")
      .then((res) => {
        setFilterOptions({
          teams: ["Todos", ...res.data.teams],
          sprints: ["Todos", ...res.data.sprints],
          devs: ["Todos", ...res.data.devs],
        });
      })
      .catch((err) => console.error("Erro ao carregar filtros:", err));
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div
        style={{
          background: "#1c1917",
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

      <div
        style={{
          background: "#87705F",
          padding: "20px 40px",
          display: "flex",
          gap: 20,
          justifyContent: "flex-end",
        }}
      >
        <SearchableSelect
          label="Team"
          value={filters.team}
          onChange={(v) => handleChange("team", v)}
          options={filterOptions.teams}
        />

        <SearchableSelect
          label="Sprint"
          value={filters.sprint}
          onChange={(v) => handleChange("sprint", v)}
          options={filterOptions.sprints}
          inputType="number"
          placeholder="Buscar sprint..."
        />

        <SearchableSelect
          label="Desenvolvedor"
          value={filters.dev}
          onChange={(v) => handleChange("dev", v)}
          options={filterOptions.devs}
          inputType="text"
          placeholder="Buscar dev..."
        />
      </div>
    </div>
  );
}

function SimpleSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: FILTER_WIDTH }}>
      <label style={{ color: "#fff", fontSize: 14, marginBottom: 4 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function SearchableSelect({ label, value, onChange, options, inputType, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const baseOptions = options.filter((o) => o !== "Todos");
  const filtered = search
    ? baseOptions.filter((o) =>
        String(o).toLowerCase().includes(search.toLowerCase())
      )
    : baseOptions;

  const visible = filtered.slice(0, 3);
  const hasMore = filtered.length > 3;

  const handleInput = (e) => {
    const raw = e.target.value;
    if (inputType === "number") {
      setSearch(raw.replace(/\D/g, ""));
    } else {
      setSearch(raw.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""));
    }
  };

  const handleSelect = (opt) => {
    onChange(opt);
    setSearch("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", position: "relative", width: FILTER_WIDTH }}>
      <label style={{ color: "#fff", fontSize: 14, marginBottom: 4 }}>{label}</label>

      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          ...selectStyle,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <span>{value}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 999,
            background: "#1c1917",
            borderRadius: 6,
            marginTop: 4,
            width: "100%",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px 8px 4px" }}>
            <input
              autoFocus
              value={search}
              onChange={handleInput}
              placeholder={placeholder}
              inputMode={inputType === "number" ? "numeric" : "text"}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #87705F",
                background: "#2c2927",
                color: "#fff",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div onClick={() => handleSelect("Todos")} style={optionStyle(value === "Todos")}>
            Todos
          </div>

          {visible.length > 0 ? (
            visible.map((opt, i) => (
              <div
                key={i}
                onClick={() => handleSelect(String(opt))}
                style={optionStyle(String(value) === String(opt))}
              >
                {opt}
              </div>
            ))
          ) : (
            <div style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>
              Nenhum resultado
            </div>
          )}

          {hasMore && (
            <div
              style={{
                padding: "6px 12px",
                fontSize: 11,
                color: "#87705F",
                borderTop: "1px solid #2c2927",
              }}
            >
              +{filtered.length - 3} resultado(s). Refine a busca.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const FILTER_WIDTH = 180;

const selectStyle = {
  padding: "8px 12px",
  borderRadius: 5,
  border: "none",
  width: "100%",
  height: 38,  
  background: "#1c1917",
  color: "#fff",
  fontSize: 14,
  boxSizing: "border-box",
};

const optionStyle = (active) => ({
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 14,
  color: active ? "#fff" : "#ccc",
  background: active ? "#87705F" : "transparent",
});