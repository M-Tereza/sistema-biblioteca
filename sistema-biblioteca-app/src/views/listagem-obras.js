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

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.obras}/obras`;

function ListagemObras() {
  const navigate = useNavigate();

  const [dados, setDados] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [obraSelecionada, setObraSelecionada] = React.useState(null);

  const cadastrar = () => {
    navigate("/cadastro-obra");
  };

  const editar = (id) => {
    navigate(`/cadastro-obra/${id}`);
  };

  const abrirConfirmacao = (obra) => {
    setObraSelecionada(obra);
    setOpen(true);
  };

  const fecharConfirmacao = () => {
    setOpen(false);
    setObraSelecionada(null);
  };

  async function excluir() {
    if (!obraSelecionada) return;

    let url = `${baseURL}/${obraSelecionada.id}`;

    await axios
      .delete(url, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        mensagemSucesso("Obra excluída com sucesso!");
        setDados(
          dados.filter(
            (dado) => dado.id !== obraSelecionada.id
          )
        );
        fecharConfirmacao();
      })
      .catch(() => {
        mensagemErro("Erro ao excluir a obra");
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
      <Card title="Listagem de Obras">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={cadastrar}
              >
                Nova Obra
              </button>

              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">Título</th>
                    <th scope="col">ISBN</th>
                    <th scope="col">Edição</th>
                    <th scope="col">Autor</th>
                    <th scope="col">Editora</th>
                    <th scope="col">Gênero</th>
                    <th scope="col">Idioma</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.titulo}</td>
                      <td>{dado.isbn}</td>
                      <td>{dado.edicao}</td>
                      <td>{dado.idAutor}</td>
                      <td>{dado.idEditora}</td>
                      <td>{dado.idGenero}</td>
                      <td>{dado.idIdioma}</td>
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
              Tem certeza que deseja excluir a obra{" "}
              <strong>{obraSelecionada?.titulo}</strong>?
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

export default ListagemObras;
