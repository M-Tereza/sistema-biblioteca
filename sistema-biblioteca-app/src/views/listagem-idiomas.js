import React from "react";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.idiomas}/idiomas`;

function ListagemIdiomas() {
  const navigate = useNavigate();

  const [dados, setDados] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [idiomaSelecionado, setIdiomaSelecionado] = React.useState(null);

  const cadastrar = () => {
    navigate("/cadastro-idioma");
  };

  const editar = (id) => {
    navigate(`/cadastro-idioma/${id}`);
  };

  const abrirConfirmacao = (idioma) => {
    setIdiomaSelecionado(idioma);
    setOpen(true);
  };

  const fecharConfirmacao = () => {
    setOpen(false);
    setIdiomaSelecionado(null);
  };

  async function excluir() {
    if (!idiomaSelecionado) return;

    let url = `${baseURL}/${idiomaSelecionado.id}`;

    await axios
      .delete(url, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        mensagemSucesso("Idioma excluído com sucesso!");
        setDados(
          dados.filter(
            (dado) => dado.id !== idiomaSelecionado.id
          )
        );
        fecharConfirmacao();
      })
      .catch(() => {
        mensagemErro("Erro ao excluir o idioma");
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
      <Card title="Listagem de Idiomas">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={cadastrar}
              >
                Novo Idioma
              </button>

              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">Idioma</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
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
              Tem certeza que deseja excluir o idioma{" "}
              <strong>{idiomaSelecionado?.nome}</strong>?
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

export default ListagemIdiomas;
