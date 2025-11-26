import React from "react";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import "../custom.css";

import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.clientes}/clientes`;

function PerfilCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dado, setDado] = React.useState(null);

  const editar = () => {
    navigate(`/cadastro-cliente/${id}`);
  };

  const voltar = () => {
    navigate(`/listagem-clientes`);
  };

  async function excluir() {
    let url = `${baseURL}/${id}`;
    await axios
      .delete(url)
      .then(function () {
        mensagemSucesso("Cliente excluído com sucesso!");
        navigate("/listagem-clientes");
      })
      .catch(function () {
        mensagemErro("Erro ao excluir o cliente");
      });
  }

  React.useEffect(() => {
    axios.get(`${baseURL}/${id}`).then((response) => {
      setDado(response.data);
    });
  }, [id]);

  if (!dado) return null;

  return (
    <div className="container">
      <Card title="Perfil do Cliente">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-secondary mb-3 text-white"
                style={{ backgroundColor: "blue" }}
                onClick={voltar}
              >
                Voltar
              </button>

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Nome</th>
                    <td>{dado.nome}</td>
                  </tr>

                  <tr>
                    <th>CPF</th>
                    <td>{dado.cpf}</td>
                  </tr>

                  <tr>
                    <th>Data de Nascimento</th>
                    <td>{dado.dataNascimento}</td>
                  </tr>

                  <tr>
                    <th>Telefone</th>
                    <td>{dado.telefone}</td>
                  </tr>

                  <tr>
                    <th>CEP</th>
                    <td>{dado.cep}</td>
                  </tr>

                  <tr>
                    <th>Logradouro</th>
                    <td>{dado.logradouro}</td>
                  </tr>

                  <tr>
                    <th>Número</th>
                    <td>{dado.numero}</td>
                  </tr>

                  <tr>
                    <th>Complemento</th>
                    <td>{dado.complemento}</td>
                  </tr>

                  <tr>
                    <th>Bairro</th>
                    <td>{dado.bairro}</td>
                  </tr>

                  <tr>
                    <th>Cidade</th>
                    <td>{dado.cidade}</td>
                  </tr>

                  <tr>
                    <th>Estado</th>
                    <td>{dado.estado}</td>
                  </tr>

                  <tr>
                    <th>Obras</th>
                    <td>{dado.obras}</td>
                  </tr>

                  <tr>
                    <th>Pendências</th>
                    <td>{dado.pendencias}</td>
                  </tr>

                  <tr>
                    <th>Ações</th>
                    <td>
                      <Stack spacing={1} direction="row">
                        <IconButton aria-label="edit" onClick={editar}>
                          <EditIcon />
                        </IconButton>

                        <IconButton aria-label="delete" onClick={excluir}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PerfilCliente;
