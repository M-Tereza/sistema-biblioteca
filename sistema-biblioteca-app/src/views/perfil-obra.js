import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

import {
  Button,
  Stack,
  IconButton
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const obrasURL = `${API_URLS.obras}/obras`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;
const autoresURL = `${API_URLS.autores}/autores`;
const editorasURL = `${API_URLS.editoras}/editoras`;
const secoesURL = `${API_URLS.secoes}/secoes`;

function PerfilObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [obra, setObra] = React.useState(null);
  const [autor, setAutor] = React.useState(null);
  const [editora, setEditora] = React.useState(null);
  const [exemplares, setExemplares] = React.useState([]);
  const [secoes, setSecoes] = React.useState([]);

  const [openExcluirObra, setOpenExcluirObra] = React.useState(false);
  const [openExcluirExemplar, setOpenExcluirExemplar] = React.useState(false);
  const [exemplarSelecionado, setExemplarSelecionado] = React.useState(null);

  React.useEffect(() => {
    axios.get(`${obrasURL}/${id}`).then((res) => {
      setObra(res.data);

      if (res.data.idAutor) {
        axios
          .get(`${autoresURL}/${res.data.idAutor}`)
          .then((r) => setAutor(r.data))
          .catch(() => setAutor(null));
      }

      if (res.data.idEditora) {
        axios
          .get(`${editorasURL}/${res.data.idEditora}`)
          .then((r) => setEditora(r.data))
          .catch(() => setEditora(null));
      }
    });

    axios
      .get(`${exemplaresURL}?idObra=${id}`)
      .then((res) => setExemplares(res.data || []));

    axios.get(secoesURL).then((res) => setSecoes(res.data || []));
  }, [id]);

  const nomeSecao = (idSecao) => {
    const secao = secoes.find((s) => s.id === idSecao);
    return secao ? secao.nome : "Seção não cadastrada";
  };

  const nomeStatus = (status) => {
    if (status === 1) return "Disponível";
    if (status === 2) return "Emprestado";
    return "Indefinido";
  };

  const editar = () => navigate(`/cadastro-obra/${id}`);
  const cadastrarExemplar = () =>
    navigate(`/cadastro-exemplar/${obra.id}`);

  const verExemplar = (idExemplar) =>
    navigate(`/perfil-exemplar/${idExemplar}`);

  const excluirObra = async () => {
    await axios
      .delete(`${obrasURL}/${id}`)
      .then(() => {
        mensagemSucesso("Obra excluída com sucesso!");
        navigate("/listagem-obras");
      })
      .catch(() => mensagemErro("Erro ao excluir a obra"))
      .finally(() => setOpenExcluirObra(false));
  };

  const excluirExemplar = async () => {
    if (!exemplarSelecionado) return;

    await axios
      .delete(`${exemplaresURL}/${exemplarSelecionado.id}`)
      .then(() => {
        mensagemSucesso("Exemplar excluído com sucesso!");
        setExemplares((prev) =>
          prev.filter((e) => e.id !== exemplarSelecionado.id)
        );
      })
      .catch(() => mensagemErro("Erro ao excluir exemplar"))
      .finally(() => {
        setOpenExcluirExemplar(false);
        setExemplarSelecionado(null);
      });
  };

  if (!obra) return null;

  return (
    <div className="container">
      <Card title="Perfil da Obra">
        <p><strong>ID:</strong> {obra.id}</p>
        <p><strong>Título:</strong> {obra.titulo}</p>
        <p><strong>ISBN:</strong> {obra.isbn}</p>
        <p><strong>Edição:</strong> {obra.edicao}</p>
        <p><strong>Autor:</strong> {autor?.nome || "Autor não cadastrado"}</p>
        <p><strong>Editora:</strong> {editora?.nome || "Editora não cadastrada"}</p>

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
              <th>Status</th>
              <th>Seção</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {exemplares.length > 0 ? (
              exemplares.map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.id}</td>
                  <td>{nomeStatus(ex.idStatus)}</td>
                  <td>{nomeSecao(ex.idSecao)}</td>
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

        {/* Dialog excluir obra */}
        <Dialog open={openExcluirObra} onClose={() => setOpenExcluirObra(false)}>
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
            <Button color="error" variant="contained" onClick={excluirObra}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog excluir exemplar */}
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
            <Button color="error" variant="contained" onClick={excluirExemplar}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default PerfilObra;
