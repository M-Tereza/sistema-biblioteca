import React from "react";

import Card from "../components/card";
import "../custom.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

import axios, { API_URLS } from "../config/axios";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const clientesURL = `${API_URLS.clientes}/clientes`;
const emprestimosURL = `${API_URLS.emprestimos}/emprestimos`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;
const multasURL = `${API_URLS.multas}/multas`;
const duracoesURL = `${API_URLS.duracaoPadraoEmprestimos}/duracaoPadraoEmprestimos`;

const STATUS_EXEMPLAR = {
  DISPONIVEL: 1,
  RESERVADO: 2,
  EM_POSSE: 3,
  EXTRAVIADO: 5
};

function Relatorios() {
  const [clientes, setClientes] = React.useState([]);
  const [emprestimos, setEmprestimos] = React.useState([]);
  const [exemplares, setExemplares] = React.useState([]);
  const [multas, setMultas] = React.useState([]);
  const [duracoes, setDuracoes] = React.useState([]);

  React.useEffect(() => {
    axios.get(clientesURL).then(r => setClientes(r.data || []));
    axios.get(emprestimosURL).then(r => setEmprestimos(r.data || []));
    axios.get(exemplaresURL).then(r => setExemplares(r.data || []));
    axios.get(multasURL).then(r => setMultas(r.data || []));
    axios.get(duracoesURL).then(r => setDuracoes(r.data || []));
  }, []);

  const duracaoAtual =
    duracoes.length > 0
      ? duracoes[duracoes.length - 1].diasUteis
      : 0;

  const exemplaresEmPosse = exemplares.filter(
    e =>
      e.idStatus === STATUS_EXEMPLAR.EM_POSSE
  );

  const clientesComEmprestimo = new Set(
    emprestimos
      .filter(e =>
        exemplaresEmPosse.some(ex => ex.id === e.idExemplar)
      )
      .map(e => e.idCliente)
  );

  const clientesSemEmprestimo =
    clientes.length - clientesComEmprestimo.size;

  const clientesAtrasados = new Set(
    emprestimos
      .filter(e =>
        exemplares.some(
          ex =>
            ex.id === e.idExemplar &&
            ex.idStatus === STATUS_EXEMPLAR.EM_ATRASO
        )
      )
      .map(e => e.idCliente)
  );

  const exemplaresEmprestados = exemplaresEmPosse.length;
  const exemplaresDisponiveis = exemplares.filter(
    e => e.idStatus === STATUS_EXEMPLAR.DISPONIVEL
  ).length;

  const exemplaresReservados = exemplares.filter(
    e => e.idStatus === STATUS_EXEMPLAR.RESERVADO
  ).length;

  const exemplaresExtraviados = exemplares.filter(
    e => e.idStatus === STATUS_EXEMPLAR.EXTRAVIADO
  ).length;

  const hoje = new Date();
  const emprestimosEmAtraso = emprestimos.filter(e => {
    const inicio = new Date(e.dataEmprestimo);
    const fim = e.dataEntrega ? new Date(e.dataEntrega) : hoje;
    const dias = Math.ceil((fim - inicio) / 86400000);
    return dias > duracaoAtual;
  });

  const multasPagas = multas.filter(m =>
    emprestimosEmAtraso.some(
      e => e.id === m.idEmprestimo && e.dataEntrega
    )
  );

  const multasNaoPagas = multas.filter(m =>
    emprestimosEmAtraso.some(
      e => e.id === m.idEmprestimo && !e.dataEntrega
    )
  );

  const totalValorMultas = multas.reduce(
    (soma, m) => soma + (m.valor || 0),
    0
  );

  const faixas = {
    "Até R$ 10": 0,
    "R$ 10 a R$ 30": 0,
    "R$ 30 a R$ 60": 0,
    "Acima de R$ 60": 0,
  };

  multas.forEach(m => {
    if (m.valor <= 10) faixas["Até R$ 10"]++;
    else if (m.valor <= 30) faixas["R$ 10 a R$ 30"]++;
    else if (m.valor <= 60) faixas["R$ 30 a R$ 60"]++;
    else faixas["Acima de R$ 60"]++;
  });

  const graficoClientes = {
    labels: ["Com empréstimo", "Sem empréstimo"],
    datasets: [
      {
        data: [
          clientesComEmprestimo.size,
          clientesSemEmprestimo,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(201, 203, 207, 1)",
        ],
      },
    ],
  };

  const graficoExemplares = {
    labels: ["Disponível", "Reservado", "Em posse", "Extraviado/Danificado"],
    datasets: [
      {
        data: [
          exemplaresDisponiveis,
          exemplaresReservados,
          exemplaresEmprestados,
          exemplaresExtraviados
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(201, 203, 207, 0.6)"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(201, 203, 207, 1)"
        ],
      },
    ],
  };

  const graficoMultasStatus = {
    labels: ["Pagas", "Não pagas"],
    datasets: [
      {
        label: "Quantidade",
        data: [
          multasPagas.length,
          multasNaoPagas.length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const graficoMultasFaixa = {
    labels: Object.keys(faixas),
    datasets: [
      {
        label: "Quantidade",
        data: Object.values(faixas),
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="container">
      <Card title="Relatórios de Clientes">
        <div className="row">
          <div className="col-lg-4">
            <Doughnut data={graficoClientes} />
          </div>
          <div className="col-lg-8">
            <h6>Total de clientes: {clientes.length}</h6>
            <h6>Clientes com empréstimos: {clientesComEmprestimo.size}</h6>
            <h6>Clientes sem empréstimos: {clientesSemEmprestimo}</h6>
            <h6>Clientes em atraso: {clientesAtrasados.size}</h6>
          </div>
        </div>
      </Card>

      <Card title="Relatórios de Exemplares">
        <div className="row">
          <div className="col-lg-4">
            <Doughnut data={graficoExemplares} />
          </div>
          <div className="col-lg-8">
            <h6>Total de exemplares: {exemplares.length}</h6>
            <h6>Disponíveis: {exemplaresDisponiveis}</h6>
            <h6>Reservados: {exemplaresReservados}</h6>
            <h6>Em posse: {exemplaresEmprestados}</h6>
            <h6>Extraviados/Danificados: {exemplaresExtraviados}</h6>
          </div>
        </div>
      </Card>

      <Card title="Relatórios de Multas">
        <div className="row">
          <div className="col-lg-6">
            <Bar data={graficoMultasStatus} />
          </div>
          <div className="col-lg-6">
            <Bar data={graficoMultasFaixa} />
          </div>
          <div className="col-lg-12 mt-3">
            <h6>Total de multas: {multas.length}</h6>
            <h6>Multas pagas: {multasPagas.length}</h6>
            <h6>Multas não pagas: {multasNaoPagas.length}</h6>
            <h6>Valor total em multas: R$ {totalValorMultas.toFixed(2)}</h6>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Relatorios;
