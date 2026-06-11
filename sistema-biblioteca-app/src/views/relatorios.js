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

const clientesURL = `${API_URLS}/clientes`;
const emprestimosURL = `${API_URLS}/emprestimos`;
const exemplaresURL = `${API_URLS}/exemplares`;

const STATUS_EXEMPLAR = {
  DISPONIVEL: 1,
  RESERVADO: 3,
  EM_POSSE: 4,
  EM_ATRASO: 5,
  EXTRAVIADO: 6,
};

function Relatorios() {
  const [clientes, setClientes] = React.useState([]);
  const [emprestimos, setEmprestimos] = React.useState([]);
  const [exemplares, setExemplares] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(clientesURL)
      .then((r) => setClientes(r.data || []));

    axios
      .get(emprestimosURL)
      .then((r) => setEmprestimos(r.data || []));

    axios
      .get(exemplaresURL)
      .then((r) => setExemplares(r.data || []));
  }, []);

  const hoje = new Date();

  const clientesComEmprestimo = new Set(
    emprestimos.map((e) => e.idCliente)
  );

  const clientesSemEmprestimo =
    clientes.length - clientesComEmprestimo.size;

  const clientesAtrasados = new Set(
    emprestimos
      .filter(
        (e) =>
          !e.dataHoraEntrega &&
          new Date(e.dataPrevistaDevolucao) < hoje
      )
      .map((e) => e.idCliente)
  );

  const exemplaresDisponiveis = exemplares.filter(
    (e) =>
      e.idStatusExemplar ===
      STATUS_EXEMPLAR.DISPONIVEL
  ).length;

  const exemplaresReservados = exemplares.filter(
    (e) =>
      e.idStatusExemplar ===
      STATUS_EXEMPLAR.RESERVADO
  ).length;

  const exemplaresEmPosse = exemplares.filter(
    (e) =>
      e.idStatusExemplar ===
      STATUS_EXEMPLAR.EM_POSSE
  ).length;

  const exemplaresEmAtraso = exemplares.filter(
    (e) =>
      e.idStatusExemplar ===
      STATUS_EXEMPLAR.EM_ATRASO
  ).length;

  const exemplaresExtraviados = exemplares.filter(
    (e) =>
      e.idStatusExemplar ===
      STATUS_EXEMPLAR.EXTRAVIADO
  ).length;

  const emprestimosComMulta = emprestimos.filter(
    (e) => Number(e.multa || 0) > 0
  );

  const multasPagas = emprestimos.filter(
    (e) =>
      Number(e.multa || 0) > 0 &&
      e.dataHoraEntrega
  );

  const multasNaoPagas = emprestimos.filter(
    (e) =>
      Number(e.multa || 0) > 0 &&
      !e.dataHoraEntrega
  );

  const totalValorMultas = emprestimos.reduce(
    (soma, e) =>
      soma + Number(e.multa || 0),
    0
  );

  const faixas = {
    "Até R$ 10": 0,
    "R$ 10 a R$ 30": 0,
    "R$ 30 a R$ 60": 0,
    "Acima de R$ 60": 0,
  };

  emprestimosComMulta.forEach((e) => {
    const valor = Number(e.multa || 0);

    if (valor <= 10) {
      faixas["Até R$ 10"]++;
    } else if (valor <= 30) {
      faixas["R$ 10 a R$ 30"]++;
    } else if (valor <= 60) {
      faixas["R$ 30 a R$ 60"]++;
    } else {
      faixas["Acima de R$ 60"]++;
    }
  });

  const graficoClientes = {
    labels: [
      "Com empréstimo",
      "Sem empréstimo",
    ],
    datasets: [
      {
        data: [
          clientesComEmprestimo.size,
          clientesSemEmprestimo,
        ],
        backgroundColor: [
          "rgba(54,162,235,0.6)",
          "rgba(201,203,207,0.6)",
        ],
        borderColor: [
          "rgba(54,162,235,1)",
          "rgba(201,203,207,1)",
        ],
      },
    ],
  };

  const graficoExemplares = {
    labels: [
      "Disponível",
      "Reservado",
      "Em posse",
      "Em atraso",
      "Extraviado/Danificado",
    ],
    datasets: [
      {
        data: [
          exemplaresDisponiveis,
          exemplaresReservados,
          exemplaresEmPosse,
          exemplaresEmAtraso,
          exemplaresExtraviados,
        ],
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(201,203,207,0.6)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(255,206,86,1)",
          "rgba(54,162,235,1)",
          "rgba(255,99,132,1)",
          "rgba(201,203,207,1)",
        ],
      },
    ],
  };

  const graficoMultasStatus = {
    labels: ["Pagas", "Em aberto"],
    datasets: [
      {
        label: "Quantidade",
        data: [
          multasPagas.length,
          multasNaoPagas.length,
        ],
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,159,64,0.6)",
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
          "rgba(153,102,255,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(255,99,132,0.6)",
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
            <h6>
              Total de clientes: {clientes.length}
            </h6>

            <h6>
              Clientes com empréstimos:{" "}
              {clientesComEmprestimo.size}
            </h6>

            <h6>
              Clientes sem empréstimos:{" "}
              {clientesSemEmprestimo}
            </h6>

            <h6>
              Clientes em atraso:{" "}
              {clientesAtrasados.size}
            </h6>
          </div>
        </div>
      </Card>

      <Card title="Relatórios de Exemplares">
        <div className="row">
          <div className="col-lg-4">
            <Doughnut data={graficoExemplares} />
          </div>

          <div className="col-lg-8">
            <h6>
              Total de exemplares:{" "}
              {exemplares.length}
            </h6>

            <h6>
              Disponíveis:{" "}
              {exemplaresDisponiveis}
            </h6>

            <h6>
              Reservados:{" "}
              {exemplaresReservados}
            </h6>

            <h6>
              Em posse: {exemplaresEmPosse}
            </h6>

            <h6>
              Em atraso:{" "}
              {exemplaresEmAtraso}
            </h6>

            <h6>
              Extraviados/Danificados:{" "}
              {exemplaresExtraviados}
            </h6>
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
            <h6>
              Empréstimos com multa:{" "}
              {emprestimosComMulta.length}
            </h6>

            <h6>
              Multas pagas:{" "}
              {multasPagas.length}
            </h6>

            <h6>
              Multas em aberto:{" "}
              {multasNaoPagas.length}
            </h6>

            <h6>
              Valor total em multas: R${" "}
              {totalValorMultas.toFixed(2)}
            </h6>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Relatorios;
