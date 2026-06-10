import React from 'react';
import Card from '../components/card';
import { mensagemErro } from '../components/toastr';
import '../custom.css';

import { formatarDataHora } from '../utils/formatadores';

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS}/valorDiarioMultas`;

function ListagemValorDiarioMultas() {
  const [dados, setDados] = React.useState([]);

  React.useEffect(() => {
    axios.get(baseURL)
      .then(res => setDados(res.data || []))
      .catch(() => mensagemErro('Erro ao carregar valores diários para multas'));
  }, []);

  const cadastrar = () => {
    window.location.href = "/cadastro-valorDiarioMulta";
  };

  if (!dados) return null;

  return (
    <div className="container">
      <Card title="Histórico de Valores Diários para Multas">
        <div className="d-flex mb-3">
          <button
            className="btn btn-warning"
            onClick={cadastrar}
          >
            Cadastrar Novo Valor Diário para Multa
          </button>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Valor Diário</th>
              <th>Data da Alteração</th>
            </tr>
          </thead>
          <tbody>
            {dados.length > 0 ? (
              dados.map(item => (
                <tr key={item.id}>
                  <td>R$ {(item.valorDia ?? 0).toFixed(2)}</td>
                  <td>{formatarDataHora(item.dataHoraAlteracao) || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">Nenhum valor diário para multas cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ListagemValorDiarioMultas;
