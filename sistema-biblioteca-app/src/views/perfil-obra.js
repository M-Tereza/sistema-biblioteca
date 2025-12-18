import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

import {
  Button,
  Stack,
  Divider
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const obrasURL = `${API_URLS.obras}/obras`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;
const secoesURL = `${API_URLS.secoes}/secoes`;

function PerfilObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [obra, setObra] = React.useState(null);
  const [exemplares, setExemplares] = React.useState([]);
  const [secoes, setSecoes] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    axios.get(`${obrasURL}/${id}`).then((res) => {
      setObra(res.data);
    });

    axios.get(exemplaresURL).then((res) => {
      const filtrados = res.data.filter(
        (ex) => ex.idObra === Number(id)
      );
      setExemplares(filtrados);
    });

    axios.get(secoesURL).then((res) => {
      setSecoes(res.data);
    });
  }, [id]);

  const nomeSecao = (idSecao) => {
    const secao = secoes.find((s) => s.id === idSecao);
    return secao ? secao.nome : "Seção não cadastrada";
  };

  const editar = () => {
    navigate(`/cadastro-obra/${id}`);
  };

  const irParaPerfilExemplar = (idExemplar) => {
    navigate(`/perfil-exemplar/${idExemplar}`);
  };

  const abrirConfirmacao = () => setOpen(true);
  const fecharConfirmacao = () => setOpen(false);

  const excluir = async () => {
    await axios
      .delete(`${obrasURL}/${id}`)
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
        <p><strong>Código da Obra:</strong> {obra.id}</p>
        <p><strong>Título:</strong> {obra.titulo}</p>
        <p><strong>ISBN:</strong> {String(obra.isbn)}</p>
        <p><strong>Edição:</strong> {obra.edicao}</p>

        <Divider sx={{ my: 3 }} />

        <h5>Exemplares</h5>

        {exemplares.length > 0 ? (
          exemplares.map((ex) => (
            <div key={ex.id}>
              <p>
                <strong>Código do Exemplar:</strong> {ex.id}<br />
                <strong>Status:</strong> {ex.status}<br />
                <strong>Seção:</strong> {nomeSecao(ex.idSecao)}
              </p>

              <Button
                size="small"
                variant="outlined"
                onClick={() => irParaPerfilExemplar(ex.id)}
              >
                Ver Exemplar
              </Button>

              <Divider sx={{ my: 2 }} />
            </div>
          ))
        ) : (
          <p>Nenhum exemplar cadastrado para esta obra.</p>
        )}

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={editar}>
            Editar Obra
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={abrirConfirmacao}
          >
            Excluir Obra
          </Button>
        </Stack>

        <Dialog open={open} onClose={fecharConfirmacao}>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a obra{" "}
              <strong>{obra.titulo}</strong>?
              <br />
              Essa ação não poderá ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharConfirmacao}>
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

export default PerfilObra;
