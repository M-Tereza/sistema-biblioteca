import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import axios, { API_URLS } from "../config/axios";

import { Button, Stack, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const obrasURL = `${API_URLS}/obras`;
const exemplaresURL = `${API_URLS}/exemplares`;

function PerfilObra() {

  const { id } = useParams();
  const navigate = useNavigate();

  const voltar = () => navigate("/listagem-obras");

  const [obra, setObra] = React.useState(null);
  const [exemplares, setExemplares] = React.useState([]);
  const [openExcluirObra, setOpenExcluirObra] = React.useState(false);
  const [openExcluirExemplar, setOpenExcluirExemplar] = React.useState(false);
  const [exemplarSelecionado, setExemplarSelecionado] = React.useState(null);

  React.useEffect(() => {

    axios.get(`${obrasURL}/${id}`)
      .then((res) => {
        setObra(res.data);
      })
      .catch(() => {
        mensagemErro("Erro ao carregar obra.");
      });

    axios.get(exemplaresURL)
      .then((res) => {

        const lista = (res.data || []).filter(
          (exemplar) => exemplar.idObra === Number(id)
        );

        setExemplares(lista);

      })
      .catch(() => {
        setExemplares([]);
      });

  }, [id]);

  const editar = () => navigate(`/cadastro-obra/${id}`);

  const cadastrarExemplar = () =>
    navigate(`/cadastro-exemplar?idObra=${obra.id}`);

  const verExemplar = (idExemplar) =>
    navigate(`/perfil-exemplar/${idExemplar}`);

  const excluirObra = async () => {

    await axios.delete(`${obrasURL}/${id}`)
      .then(() => {

        mensagemSucesso("Obra excluída com sucesso!");
        navigate("/listagem-obras");

      })
      .catch(() => {

        mensagemErro("Erro ao excluir a obra");

      })
      .finally(() => {

        setOpenExcluirObra(false);

      });

  };

  const excluirExemplar = async () => {

    if (!exemplarSelecionado) {
      return;
    }

    await axios.delete(`${exemplaresURL}/${exemplarSelecionado.id}`)
      .then(() => {

        mensagemSucesso("Exemplar excluído com sucesso!");

        setExemplares((prev) =>
          prev.filter((e) => e.id !== exemplarSelecionado.id)
        );

      })
      .catch(() => {

        mensagemErro("Erro ao excluir exemplar");

      })
      .finally(() => {

        setOpenExcluirExemplar(false);
        setExemplarSelecionado(null);

      });

  };

  if (!obra) {
    return null;
  }

  return (
    <div className="container">
      <Card
        title={
          <Stack direction="row" spacing={1} alignItems="left">
            <IconButton aria-label="voltar" onClick={voltar}>
              <ArrowBackIosIcon />
            </IconButton>
            <span>Perfil da Obra</span>
          </Stack>
        }
      >
                <p><strong>Código:</strong> {obra.id}</p>
        <p><strong>Título:</strong> {obra.titulo}</p>
        <p><strong>ISBN:</strong> {obra.isbn}</p>
        <p><strong>Edição:</strong> {obra.edicao}</p>

        <p>
          <strong>Autores:</strong>{" "}
          {obra.autores && obra.autores.length > 0
            ? obra.autores.join(", ")
            : "Nenhum autor cadastrado"}
        </p>

        <p>
          <strong>Editoras:</strong>{" "}
          {obra.editoras && obra.editoras.length > 0
            ? obra.editoras.join(", ")
            : "Nenhuma editora cadastrada"}
        </p>

        <p>
          <strong>Gêneros:</strong>{" "}
          {obra.generos && obra.generos.length > 0
            ? obra.generos.join(", ")
            : "Nenhum gênero cadastrado"}
        </p>

        <p>
          <strong>Idiomas:</strong>{" "}
          {obra.idiomas && obra.idiomas.length > 0
            ? obra.idiomas.join(", ")
            : "Nenhum idioma cadastrado"}
        </p>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={editar}>
            Editar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenExcluirObra(true)}
          >
            Excluir Obra
          </Button>
        </Stack>

        <hr />

        <div className="d-flex justify-content-between align-items-center mt-4">
          <h5>Exemplares</h5>

          <Button
            variant="contained"
            color="warning"
            onClick={cadastrarExemplar}
          >
            Novo Exemplar
          </Button>
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Seção</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {exemplares.length > 0 ? (
              exemplares.map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.id}</td>

                  <td>{ex.nomeSecao || "Seção não cadastrada"}</td>

                  <td>{ex.nomeStatusExemplar}</td>

                  <td>
                    <IconButton onClick={() => verExemplar(ex.id)}>
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        setExemplarSelecionado(ex);
                        setOpenExcluirExemplar(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Nenhum exemplar cadastrado para esta obra
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Dialog
          open={openExcluirObra}
          onClose={() => setOpenExcluirObra(false)}
        >
          <DialogTitle>Excluir Obra</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a obra{" "}
              <strong>{obra.titulo}</strong>?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenExcluirObra(false)}>
              Cancelar
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={excluirObra}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openExcluirExemplar}
          onClose={() => setOpenExcluirExemplar(false)}
        >
          <DialogTitle>Excluir Exemplar</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Deseja excluir o exemplar de ID{" "}
              <strong>{exemplarSelecionado?.id}</strong>?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenExcluirExemplar(false)}>
              Cancelar
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={excluirExemplar}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

      </Card>
    </div>
  );
}

export default PerfilObra;