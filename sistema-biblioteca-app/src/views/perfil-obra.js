import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

import { Button, Stack } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const baseURL = `${API_URLS.obras}/obras`;
const editorasURL = `${API_URLS.editoras}/editoras`;

function PerfilObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [obra, setObra] = React.useState(null);
  const [editoras, setEditoras] = React.useState({});
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    axios.get(`${baseURL}/${id}`).then((response) => {
      setObra(response.data);
    });

    axios.get(editorasURL).then((response) => {
      const mapa = {};
      response.data.forEach((e) => {
        mapa[e.id] = e.nome;
      });
      setEditoras(mapa);
    });
  }, [id]);

  const editar = () => {
    navigate(`/cadastro-obra/${id}`);
  };

  const abrirConfirmacao = () => setOpen(true);
  const fecharConfirmacao = () => setOpen(false);

  const excluir = async () => {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso("Obra excluída com sucesso!");
        navigate("/listagem-obras");
      })
      .catch(() => {
        mensagemErro("Erro ao excluir a obra");
      })
      .finally(fecharConfirmacao);
  };

  if (!obra) return null;

  return (
    <div className="container">
      <Card title="Perfil da Obra">
        <p><strong>Título:</strong> {obra.titulo}</p>
        <p><strong>ISBN:</strong> {obra.isbn}</p>
        <p><strong>Edição:</strong> {obra.edicao}</p>

        <p>
          <strong>Editora:</strong>{" "}
          {editoras[obra.idEditora] || "Editora não cadastrada"}
        </p>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={editar}>
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={abrirConfirmacao}
          >
            Excluir
          </Button>
        </Stack>

        <Dialog open={open} onClose={fecharConfirmacao}>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a obra{" "}
              <strong>{obra.titulo}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharConfirmacao}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={excluir}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default PerfilObra;
