import React from 'react';
import Card from '../components/card';
import { mensagemErro } from '../components/toastr';
import '../custom.css';

import { formatarDataHora } from '../utils/formatadores';

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS}/duracaoPadraoReservas`;

function ListagemDuracaoPadraoReservas() {
  const [dados, setDados] = React.useState([]);

  React.useEffect(() => {
    axios.get(baseURL)
      .then(res => setDados(res.data || []))
      .catch(() => mensagemErro('Erro ao carregar durações padrões para reservas'));
  }, []);

  const cadastrar = () => {
    window.location.href = "/cadastro-duracaoPadraoReserva";
  };

  if (!dados) return null;

  //const dadosOrdenados = [...dados].sort((a, b) => new Date(b.dataHoraAlteracao) - new Date(b.dataHoraAlteracao));
  const dadosOrdenados = [...dados].sort((a, b) => b.id - a.id);

  return (
    <div className="container">
      <Card title="Histórico de Durações Padrões para Reservas">
        <div className="d-flex mb-3">
          <button
            className="btn btn-warning"
            onClick={cadastrar}
          >
            Nova Duração para Reservas
          </button>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Dias Úteis</th>
              <th>Data da Alteração</th>
            </tr>
          </thead>

          <tbody>
            {dadosOrdenados.length > 0 ? (
              dadosOrdenados.map(item => (
                <tr key={item.id}>
                  <td> {(item.diasUteis ?? 0)}</td>
                  <td>{formatarDataHora(item.dataHoraAlteracao) || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  Nenhuma duração para reservas encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ListagemDuracaoPadraoReservas;