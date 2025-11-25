import React from "react";

import Card from "../components/card";

import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";

import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import axios from 'axios';
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.clientes}/clientes`;

function ListagemClientes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-cliente`);
  };

  const editar = (id) => {
    navigate(`/cadastro-cliente/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    await axios
      .delete(url, {
        headers: { 'Content-Type': 'application/json' },
        data: { id },
      })
      .then(function () {
        mensagemSucesso(`Cliente excluído com sucesso!`);
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(function () {
        mensagemErro(`Erro ao excluir o cliente`);
      });
  }

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return null;

  return (
    <div className="container">
      <Card title="Listagem de Clientes">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => cadastrar()}
              >
                Novo Cliente
              </button>

              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">CEP</th>
                    <th scope="col">Rua</th>
                    <th scope="col">Número</th>
                    <th scope="col">Bairro</th>
                    <th scope="col">Complemento</th>
                    <th scope="col">Data de Nascimento</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Cidade</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Obras</th>
                    <th scope="col">Pendências</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{dado.cpf}</td>
                      <td>{dado.cep}</td>
                      <td>{dado.rua}</td>
                      <td>{dado.numero}</td>
                      <td>{dado.bairro}</td>
                      <td>{dado.complemento}</td>
                      <td>{dado.dataNascimento}</td>
                      <td>{dado.telefone}</td>
                      <td>{dado.cidade}</td>
                      <td>{dado.estado}</td>

                      <td>
                        {Array.isArray(dado.obras)
                          ? dado.obras.length
                          : dado.obras || ""}
                      </td>

                      <td>
                        {Array.isArray(dado.pendencias)
                          ? dado.pendencias.length
                          : dado.pendencias || ""}
                      </td>

                      <td>
                        <Stack spacing={1} direction="row">
                          <IconButton
                            aria-label="edit"
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            aria-label="delete"
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemClientes;
