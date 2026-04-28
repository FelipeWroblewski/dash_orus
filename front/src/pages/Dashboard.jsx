import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#9c6b3c", "#d1a978", "#e5d3b3", "#b8a999", "#222"];

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [filtros, setFiltros] = useState({
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
        params: filtros,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Erro na API:", err);
      });
  }, [filtros]);

  if (!data) return <div style={{ padding: 20 }}>Carregando...</div>;

  // =========================
  // DADOS FORMATADOS
  // =========================

  const horasTotais = [
    { name: "Melhorias", value: data.horas.apontadas },
    {
      name: "Desvio Formal",
      value:
        data.desvios_formais.melhoria +
        data.desvios_formais.revisao_ajuste +
        data.desvios_formais.revisao_erro +
        data.desvios_formais.atendimento,
    },
    {
      name: "Desvio Informal",
      value: data.desvios_informais.reuniao + data.desvios_informais.auxilio,
    },
  ];

  const desviosFormais = [
    { name: "Melhoria", value: data.desvios_formais.melhoria },
    { name: "Revisão Ajuste", value: data.desvios_formais.revisao_ajuste },
    { name: "Revisão Erro", value: data.desvios_formais.revisao_erro },
    { name: "Atendimento", value: data.desvios_formais.atendimento },
  ];

  const desviosInformais = [
    { name: "Reunião", value: data.desvios_informais.reuniao },
    { name: "Auxílio", value: data.desvios_informais.auxilio },
  ];

  const percentualCards = data.cards.planejados > 0
    ? Math.min(Math.round((data.cards.entregues / data.cards.planejados) * 100), 100)
    : 0;

  const percentualHoras = data.horas.planejadas > 0
    ? Math.min(Math.round((data.horas.apontadas / data.horas.planejadas) * 100), 100)
    : 0;
  // =========================
  // COMPONENTES
  // =========================

  const Card = ({ children }) => (
    <div
      style={{
        background: "#000",
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



const COLORS_TOTAIS = ["#9c6b3c", "#d1a978", "#e5d3b3"];
const COLORS_FORMAIS = ["#5b3a29", "#9c6b3c", "#d1a978", "#e5d3b3"];
const COLORS_INFORMAIS = ["#9c6b3c", "#d1a978"];

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#fff" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={13}>
      {`${name} (${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};

const PieBlock = ({ title, data, colors }) => (
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
          data={data}
          dataKey="value"
          outerRadius={90}
          labelLine={true}
          label={renderLabel}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => value.toFixed(2)} />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);
  // =========================
  // RENDER
  // =========================

  return (
    <div
      style={{
        background: "#87705F",
        minHeight: "100vh",
        width: "100%", // ✅ corrigido
        margin: 0,
        padding: 0,
      }}
    >
      <Header filtros={filtros} setFiltros={setFiltros} />

      <div style={{ padding: "20px 40px" }}>
        {" "}
        {/* ✅ alinhamento lateral */}
        {/* TOP */}
        <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
          <Card>
            <Gauge    
              value={percentualCards}
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
                        {data.cards.planejados}
                    </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Entregues
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.cards.entregues}
                    </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Não entregues
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.cards.nao_entregues}
                    </div>
                    </div>
                </div>
                }
            />
          </Card>

          <Card>
            <Gauge
                value={percentualHoras}
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
                        {data.horas.planejadas}
                    </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#fff", opacity: 0.8, marginBottom: 12 }}>
                        Pendentes
                    </div>
                    <div style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
                        {data.horas.pendentes}
                    </div>
                    </div>
                </div>
                }
            />
            </Card>
        </div>
        {/* BOTTOM */}
        <div style={{ display: "flex", gap: 20 }}>
            <PieBlock title="Horas totais" data={horasTotais} colors={COLORS_TOTAIS} />
            <PieBlock title="Desvios Formais" data={desviosFormais} colors={COLORS_FORMAIS} />
            <PieBlock title="Desvios Informais" data={desviosInformais} colors={COLORS_INFORMAIS} />
        </div>
      </div>
    </div>
  );
}
