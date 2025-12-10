import React from "react";

import Card from "../components/card";

import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";

import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.exemplares}/exemplares`;

function ListagemExemplares() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-exemplar`);
  };

  const editar = (id) => {
    navigate(`/cadastro-exemplar/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    let data = JSON.stringify({ id });
    let url = `${baseURL}/${id}`;
    console.log(url);
    await axios
      .delete(url, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(function (response) {
        mensagemSucesso(`Exemplar excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o exemplar`);
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
      <Card title="Listagem de Exemplares">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => cadastrar()}
              >
                Novo Exemplar
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Data de Aquisição</th>
                    <th scope="col">Seção</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.id}</td>
                      <td>{dado.dataAquisicao}</td>
                      <td>{dado.idSecao}</td>
                      <td>{dado.status}</td>
                      
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>{" "}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemExemplares;
