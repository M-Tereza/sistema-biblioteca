import React from 'react';
import Card from '../components/card';
import { mensagemErro } from '../components/toastr';
import '../custom.css';

import { formatarDataHora } from '../utils/formatadores';

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const VALORES_MULTAS_URL = `${API_URLS.valorDiarioMultas}/valorDiarioMultas`;

function ListagemMultas() {
  const [dados, setDados] = React.useState([]);

  React.useEffect(() => {
    axios.get(VALORES_MULTAS_URL)
      .then(res => setDados(res.data || []))
      .catch(() => mensagemErro('Erro ao carregar valores diários das multas'));
  }, []);

  if (!dados) return null;

  return (
    <div className="container">
      <Card title="Listagem de Valores Diários das Multas">
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
                <td colSpan="2" className="text-center">Nenhum valor diário cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ListagemMultas;
