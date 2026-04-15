import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
      value:
        data.desvios_informais.reuniao +
        data.desvios_informais.auxilio,
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
    (data.cards.entregues / data.cards.planejados) * 100
  );

  const percentualHoras = Math.round(
    (data.horas.apontadas / data.horas.planejadas) * 100
  );

  // =========================
  // COMPONENTES
  // =========================

  const Card = ({ children }) => (
    <div
      style={{
        background: "#000",
        borderRadius: 20,
        padding: 20,
        flex: 1,
        minHeight: 235,
      }}
    >
      {children}
    </div>
  );

  const Gauge = ({ value, label, extra }) => (
    <div style={{ textAlign: "center" }}>
      <h3>{label}</h3>
      <div style={{ fontSize: 48 }}>{value}%</div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {extra}
      </div>
    </div>
  );

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

    <div style={{ padding: "20px 40px" }}> {/* ✅ alinhamento lateral */}
      
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