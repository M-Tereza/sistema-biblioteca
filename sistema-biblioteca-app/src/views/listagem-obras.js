import React from "react";

import Card from "../components/card";
import "../custom.css";

import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import {
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {
  mensagemSucesso,
  mensagemErro,
} from "../components/toastr";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const obrasURL = `${API_URLS}/obras`;

function ListagemObras() {
  const navigate = useNavigate();

  const [obras, setObras] = React.useState([]);

  const [termoBusca, setTermoBusca] = React.useState("");

  const [termoDebounce, setTermoDebounce] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const [obraSelecionada, setObraSelecionada] = React.useState(null);

  const cadastrar = () => {
    navigate("/cadastro-obra");
  };

  const visualizar = (id) => {
    navigate(`/perfil-obra/${id}`);
  };

  const abrirConfirmacao = (obra) => {
    setObraSelecionada(obra);
    setOpen(true);
  };

  const fecharConfirmacao = () => {
    setOpen(false);
    setObraSelecionada(null);
  };

  const excluir = async () => {
    if (!obraSelecionada) return;

    try {
      await axios.delete(
        `${obrasURL}/${obraSelecionada.id}`
      );

      mensagemSucesso(
        "Obra excluída com sucesso!"
      );

      setObras((obrasAtuais) =>
        obrasAtuais.filter(
          (o) => o.id !== obraSelecionada.id
        )
      );

      fecharConfirmacao();
    } catch (error) {
      mensagemErro(
        "Erro ao excluir a obra"
      );

      fecharConfirmacao();
    }
  };

  React.useEffect(() => {
    carregarObras();
  }, []);

  const carregarObras = async () => {
    try {
      const response =
        await axios.get(obrasURL);

      setObras(response.data || []);
    } catch (error) {
      mensagemErro(
        "Erro ao carregar as obras."
      );
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setTermoDebounce(termoBusca);
    }, 300);

    return () => clearTimeout(timeout);
  }, [termoBusca]);

  const obrasFiltradas = obras.filter(
    (obra) => {
      const termo = termoDebounce.toLowerCase();

      const autores = (obra.autores || []).join(" ").toLowerCase();

      const editoras = (obra.editoras || []).join(" ").toLowerCase();

      const generos = (obra.generos || []).join(" ").toLowerCase();

      const idiomas = (obra.idiomas || []).join(" ").toLowerCase();

      return (
        String(obra.titulo || "").toLowerCase().includes(termo) ||
        String(obra.isbn || "").toLowerCase().includes(termo) ||
        String(obra.edicao || "").toLowerCase().includes(termo) ||
        autores.includes(termo) ||
        editoras.includes(termo) ||
        generos.includes(termo) ||
        idiomas.includes(termo)
      );
    }
  );

  return (
    <div className="container">
      <Card title="Listagem de Obras">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">

              <div className="d-flex gap-3 mb-3">

                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={cadastrar}
                >
                  Nova Obra
                </button>

                <TextField
                  label="Pesquisar obra"
                  size="small"
                  value={termoBusca}
                  onChange={(e) =>
                    setTermoBusca(
                      e.target.value
                    )
                  }
                />

              </div>

              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>ISBN</th>
                    <th>Edição</th>
                    <th>Autores</th>
                    <th>Editoras</th>
                    <th>Gêneros</th>
                    <th>Idiomas</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {obrasFiltradas.length >
                    0 ? (
                    obrasFiltradas.map(
                      (obra) => (
                        <tr key={obra.id}>
                          <td>
                            {obra.titulo}
                          </td>

                          <td>
                            {obra.isbn}
                          </td>

                          <td>
                            {obra.edicao}
                          </td>

                          <td>
                            {obra.autores && obra.autores.length > 0 ? obra.autores.join(", "): "Não informado"}
                          </td>

                          <td>
                            {obra.editoras && obra.editoras.length > 0 ? obra.editoras.join(", "): "Não informado"}
                          </td>

                          <td>
                            {obra.generos && obra.generos.length > 0 ? obra.generos.join(", "): "Não informado"}
                          </td>

                          <td>
                            {obra.idiomas && obra.idiomas.length > 0 ? obra.idiomas.join(", "): "Não informado"}
                          </td>

                          <td>
                            <Stack
                              direction="row"
                              spacing={1}
                            >
                              <IconButton
                                aria-label="visualizar"
                                onClick={() =>
                                  visualizar(
                                    obra.id
                                  )
                                }
                              >
                                <VisibilityIcon />
                              </IconButton>

                              <IconButton
                                aria-label="excluir"
                                onClick={() =>
                                  abrirConfirmacao(
                                    obra
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center"
                      >
                        Nenhuma obra encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>

        <Dialog
          open={open}
          onClose={fecharConfirmacao}
        >
          <DialogTitle>
            Confirmar exclusão
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a obra{" "}
              <strong>{obraSelecionada?.titulo}</strong>?
              <br />
              Essa ação não poderá ser desfeita.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={fecharConfirmacao}
              color="inherit"
            >
              Cancelar
            </Button>

            <Button
              onClick={excluir}
              variant="contained"
              color="error"
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