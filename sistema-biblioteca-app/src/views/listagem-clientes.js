import React from "react";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.clientes}/clientes`;

function ListagemClientes() {
  const navigate = useNavigate();

  const [dados, setDados] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [clienteSelecionado, setClienteSelecionado] = React.useState(null);

  const cadastrar = () => {
    navigate("/cadastro-cliente");
  };

  const visualizar = (id) => {
    navigate(`/perfil-cliente/${id}`);
  };

  const abrirConfirmacao = (cliente) => {
    setClienteSelecionado(cliente);
    setOpen(true);
  };

  const fecharConfirmacao = () => {
    setOpen(false);
    setClienteSelecionado(null);
  };

  async function excluir() {
    if (!clienteSelecionado) return;

    let url = `${baseURL}/${clienteSelecionado.id}`;

    await axios
      .delete(url, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        mensagemSucesso("Cliente excluído com sucesso!");
        setDados(
          dados.filter((dado) => dado.id !== clienteSelecionado.id)
        );
        fecharConfirmacao();
      })
      .catch(() => {
        mensagemErro("Erro ao excluir o cliente");
        fecharConfirmacao();
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
                onClick={cadastrar}
              >
                Novo Cliente
              </button>

              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Email</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{dado.cpf}</td>
                      <td>{dado.email}</td>
                      <td>{dado.telefone}</td>
                      <td>
                        <Stack spacing={1} direction="row">
                          <IconButton
                            aria-label="account"
                            onClick={() => visualizar(dado.id)}
                          >
                            <AccountCircleIcon />
                          </IconButton>

                          <IconButton
                            aria-label="delete"
                            onClick={() => abrirConfirmacao(dado)}
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

        <Dialog open={open} onClose={fecharConfirmacao}>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o cliente{" "}
              <strong>{clienteSelecionado?.nome}</strong>?
              <br />
              Essa ação não poderá ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharConfirmacao} color="inherit">
              Cancelar
            </Button>
            <Button
              onClick={excluir}
              color="error"
              variant="contained"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default ListagemClientes;
