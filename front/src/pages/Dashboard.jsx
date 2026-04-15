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

  const percentualCards = Math.round(
    (data.cards.entregues / data.cards.planejados) * 100,
  );

  const percentualHoras = Math.round(
    (data.horas.apontadas / data.horas.planejadas) * 100,
  );

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
    const valorTratado = Math.min(value, 100); // evita passar de 100 no gráfico

    const data = [
      {
        name: "bg",
        value: 100,
        fill: "#d9d9d9", // fundo cinza
      },
      {
        name: "value",
        value: valorTratado,
        fill: "#9c6b3c", // cor principal
      },
    ];

    return (
      <div style={{ textAlign: "center", color: "#fff" }}>
        <h3 style={{ marginBottom: 10 }}>{label}</h3>

        <div style={{ position: "relative" }}>
          <RadialBarChart
            width={300}
            height={180}
            cx="50%"
            cy="100%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={15}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={10} />
          </RadialBarChart>

          {/* VALOR CENTRAL */}
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            {value.toFixed(2)}%
          </div>

          {/* 0% e 100% */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 20,
              fontSize: 12,
            }}
          >
            0,00%
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 20,
              fontSize: 12,
            }}
          >
            100,00%
          </div>
        </div>

        {/* INFOS ABAIXO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 10,
            fontSize: 14,
          }}
        >
          {extra}
        </div>
      </div>
    );
  };

  const PieBlock = ({ title, data }) => (
    <Card>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
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
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <Card>
            <Gauge
              value={percentualCards}
              label="Resumo das entregas"
              extra={
                <>
                  <div>Planejados: {data.cards.planejados}</div>
                  <div>Entregues: {data.cards.entregues}</div>
                  <div>Não: {data.cards.nao_entregues}</div>
                </>
              }
            />
          </Card>

          <Card>
            <Gauge
              value={percentualHoras}
              label="Horas planejadas"
              extra={
                <>
                  <div>Planejadas: {data.horas.planejadas}</div>
                  <div>Pendentes: {data.horas.pendentes}</div>
                </>
              }
            />
          </Card>
        </div>
        {/* BOTTOM */}
        <div style={{ display: "flex", gap: 20 }}>
          <PieBlock title="Horas totais" data={horasTotais} />
          <PieBlock title="Desvios Formais" data={desviosFormais} />
          <PieBlock title="Desvios Informais" data={desviosInformais} />
        </div>
      </div>
    </div>
  );
}
