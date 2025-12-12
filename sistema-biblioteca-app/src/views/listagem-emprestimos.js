import React from "react";
import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axios from "axios";
import { API_URLS } from "../config/axios";

const emprestimosURL = `${API_URLS.exemplares}/emprestimos`;
const clientesURL = `${API_URLS.clientes}/clientes`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;

function ListagemEmprestimos() {
  const navigate = useNavigate();

  const [emprestimos, setEmprestimos] = React.useState([]);
  const [clientes, setClientes] = React.useState([]);
  const [exemplares, setExemplares] = React.useState([]);

  async function carregar() {
    try {
      const empResp = await axios.get(emprestimosURL);
      const cliResp = await axios.get(clientesURL);
      const exResp = await axios.get(exemplaresURL);

      setEmprestimos(empResp.data);
      setClientes(cliResp.data);
      setExemplares(exResp.data);
    } catch {
      mensagemErro("Erro ao carregar empréstimos");
    }
  }

  React.useEffect(() => {
    carregar();
  }, []);

  const getCliente = (id) => clientes.find((c) => c.id === id);
  const getExemplar = (id) => exemplares.find((e) => e.id === id);

  async function excluir(id) {
    try {
      await axios.delete(`${emprestimosURL}/${id}`);
      mensagemSucesso("Empréstimo removido!");
      carregar();
    } catch {
      mensagemErro("Erro ao excluir empréstimo");
    }
  }

  return (
    <div className="container">
      <Card title="Listagem de Empréstimos">

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Exemplar</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {emprestimos.map((emp) => {
              const cli = getCliente(emp.idCliente);
              const ex = getExemplar(emp.idExemplar);

              return (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{cli ? cli.nome : "—"}</td>
                  <td>
                    {ex ? (
                      <>
                        {ex.titulo} <b>({ex.codigo})</b>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{emp.data}</td>

                  <td>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        aria-label="ver"
                        onClick={() => navigate(`/perfil-cliente/${emp.idCliente}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        aria-label="ver exemplar"
                        onClick={() => navigate(`/perfil-exemplar/${emp.idExemplar}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton aria-label="delete" onClick={() => excluir(emp.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ListagemEmprestimos;
