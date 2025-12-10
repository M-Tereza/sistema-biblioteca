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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBack';

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.clientes}/clientes`;

function PerfilCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dado, setDado] = React.useState(null);

  const editar = (id) => {
    navigate(`/cadastro-cliente/${id}`);
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

  const voltar = () => {
    navigate(`/listagem-clientes`);
  };

  React.useEffect(() => {
    axios.get(`${baseURL}/${id}`).then((response) => {
      setDado(response.data);
    });
  }, [id]);

  if (!dado) return null;

  return (
    <div className="container">

      <Card title={
        <Stack direction="row" spacing={1} alignItems="left">
          <IconButton
            aria-label="voltar"
            onClick={voltar}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <span>Perfil do Cliente</span>
        </Stack>
      }>

        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">

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
                    <th>Email</th>
                    <td>{dado.email}</td>
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
                </tbody>
              </table>

              <Stack spacing={1} padding={0} direction='row' justifyContent="flex-end">
                <IconButton
                  aria-label='edit'
                  onClick={() => editar(dado.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  onClick={() => excluir(dado.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>

            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PerfilCliente;
