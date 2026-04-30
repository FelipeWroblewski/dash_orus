import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#9c6b3c", "#d1a978", "#e5d3b3", "#b8a999", "#222"];

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [filters, setFilters] = useState({
    team: "Todos",
    sprint: "Todos",
    dev: "Todos",
  });

  // =========================
  // API CALL (COM FILTROS)
  // =========================
  useEffect(() => {
    axios
      .get("http://localhost:9001/dashboard", {
        params: filters,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Erro na API:", err);
      });
  }, [filters]);

  if (!data) return <div style={{ padding: 20 }}>Carregando...</div>;

  // =========================
  // DADOS FORMATADOS
  // =========================

  const totalHours = [
    { name: "Melhorias", value: data.hours.recorded },
    {
      name: "Desvio Formal",
      value:
        data.formal_deviations.improvement +
        data.formal_deviations.revision_adjustment +
        data.formal_deviations.error_revision  +
        data.formal_deviations.service,
    },
    {
      name: "Desvio Informal",
      value: 
        data.informal_deviations.meeting + 
        data.informal_deviations.assistant + 
        data.informal_deviations.emergency_service +
        data.informal_deviations.impediment +
        data.informal_deviations.code_review,
    },
  ];

  const formalDeviations = [
    { name: "Melhoria", value: data.formal_deviations.improvement  },
    { name: "Revisão Ajuste", value: data.formal_deviations.revision_adjustment  },
    { name: "Revisão Erro", value: data.formal_deviations.error_revision  },
    { name: "Atendimento", value: data.formal_deviations.service },
  ];

    const informalDeviations = [
        { name: "Reunião", value: data.informal_deviations.meeting },
        { name: "Auxílio", value: data.informal_deviations.assistant },
        { name: "Atendimento Emergencial", value: data.informal_deviations.emergency_service },
        { name: "Impedimento", value: data.informal_deviations.impediment },
        { name: "Code Review", value: data.informal_deviations.code_review },
    ];

  const cardPercentage = data.cards.planned_cards > 0
    ? Math.min(Math.round((data.cards.delivered / data.cards.planned_cards) * 100), 100)
    : 0;

  const hoursPercentage = data.hours.planned_hours  > 0
    ? Math.min(Math.round((data.hours.recorded / data.hours.planned_hours) * 100), 100)
    : 0;
  // =========================
  // COMPONENTES
  // =========================

  const Card = ({ children }) => (
    <div
      style={{
        background: "#1c1917",
        borderRadius: 30,
        padding: 30,
        flex: 1,
        minHeight: 260, // 🔥 altura igual ao modelo
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );

const Gauge = ({ value, label, extra }) => {
  const valorTratado = Math.min(value, 100);

  const gaugeData = [
  { name: "value", value: valorTratado, fill: "#87705F" },
];

  return (
    <div style={{ textAlign: "center", color: "#fff", width: "100%" }}>
      <h3 style={{ marginBottom: 16, fontSize: 28, fontWeight: 400, color: "#fff" }}>
        {label}
      </h3>

      <div style={{ position: "relative", width: "100%", height: 220 }}>
  <ResponsiveContainer width="100%" height={220}>
    <RadialBarChart
      cx="50%"
      cy="100%"
      innerRadius={120}
      outerRadius={200}
      barSize={45}
      data={gaugeData}
      startAngle={180}
      endAngle={0}
    >
      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
      <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#fff" }} />
    </RadialBarChart>
  </ResponsiveContainer>

  <div style={{
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 36,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  }}>
    {value.toFixed(2)}%
  </div>

  
</div>

      <div style={{ marginTop: 16 }}>
        {extra}
      </div>
    </div>
  );
};



const COLORS_TOTALS = ["#87705F", "#86989c", "#555"];
const FORMAL_COLORS = ["#87705F", "#86989c", "#555", "#fff"];
const INFORMAL_COLORS = ["#87705F", "#86989c", "#fff", "#555", "#1c1917"];

const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#fff" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={13}>
      {`${name} ${value.toFixed(2)}`}
    </text>
  );
};

const PieBlock = ({ title, data, colors }) => {
  const filteredData = data.filter(item => item.value > 0);

  return (
    <Card>
      <h3 style={{
        textAlign: "center",
        marginBottom: 10,
        fontSize: 34,
        fontWeight: 400,
        color: "#fff",
      }}>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="value"
            outerRadius={90}
            labelLine={true}
            label={renderLabel}
          >
            {filteredData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toFixed(2)} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
  // =========================
  // RENDER
  // =========================

  return (
    <div
      style={{
        background: "#87705F",
        minHeight: "100vh",
        width: "100%", 
        margin: 0,
        padding: 0,
      }}
    >
      <Header filters={filters} setFilters={setFilters} />

      <div style={{ padding: "20px 40px" }}>
        {" "}
        {}
        {}
        <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
          <Card>
            <Gauge    
              value={cardPercentage}
              label="Resumo das entregas"
              extra={
                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-around", 
                    width: "100%",
                    padding: "0 40px", 
                    marginTop: 40,
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Planejados
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.cards.planned_cards}
                    </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Entregues
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.cards.delivered}
                    </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Não entregues
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.cards.not_delivered}
                    </div>
                    </div>
                </div>
                }
            />
          </Card>

          <Card>
            <Gauge
                value={hoursPercentage}
                label="Horas planejadas"
                extra={
                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-evenly", 
                    width: "100%",
                    /*gap: 0,*/ 
                    marginTop: 20,
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Planejadas
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.hours.planned_hours}
                    </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Pendentes
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.hours.outstanding}
                    </div>
                    </div>
                </div>
                }
            />
            </Card>
        </div>
        {/* BOTTOM */}
        <div style={{ display: "flex", gap: 20 }}>
            <PieBlock title="Horas totais" data={totalHours} colors={COLORS_TOTALS} />
            <PieBlock title="Desvios Formais" data={formalDeviations} colors={FORMAL_COLORS} />
            <PieBlock title="Desvios Informais" data={informalDeviations} colors={INFORMAL_COLORS
} />
        </div>
      </div>
    </div>
  );
}
