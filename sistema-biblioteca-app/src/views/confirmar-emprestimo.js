import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/card";
import Button from "@mui/material/Button";
import axios from "axios";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import { API_URLS } from "../config/axios";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";

const EMPRESTIMOS_URL = `${API_URLS}/emprestimos`;
const EXEMPLARES_URL = `${API_URLS}/exemplares`;
const OBRAS_URL = `${API_URLS}/obras`;

function ConfirmarEmprestimo() {
  const navigate = useNavigate();
  const { idCliente, idObra, idExemplar } = useParams();

  const voltar = () =>
    navigate(`/selecionar-exemplar/${idCliente}/${idObra}`);

  const [exemplar, setExemplar] = useState(null);
  const [obra, setObra] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const { data: ex } = await axios.get(`${EXEMPLARES_URL}/${idExemplar}`);
        setExemplar(ex);

        const { data: obraData } = await axios.get(`${OBRAS_URL}/${ex.idObra}`);
        setObra(obraData);
      } catch {
        mensagemErro("Erro ao carregar dados do exemplar.");
      }
    }

    carregar();
  }, [idExemplar]);

  async function confirmar() {
    try {
      await axios.post(EMPRESTIMOS_URL, {
        idCliente: Number(idCliente),
        idExemplar: Number(idExemplar),
      });

      mensagemSucesso("Empréstimo registrado com sucesso!");
      navigate(`/perfil-cliente/${idCliente}`);
    } catch {
      mensagemErro("Erro ao registrar o empréstimo.");
    }
  }

  if (!exemplar || !obra) {
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Card
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton aria-label="voltar" onClick={voltar}>
              <ArrowBackIosIcon />
            </IconButton>
            <span>Confirmar Empréstimo</span>
          </Stack>
        }
      >
        <h4 className="mb-3">Obra Selecionada</h4>

        <table className="table table-bordered mb-4">
          <tbody>
            <tr>
              <th>Título</th>
              <td>{obra.titulo}</td>
            </tr>
            <tr>
              <th>Autores</th>
              <td>{(obra.autores || []).join(", ")}</td>
            </tr>
            <tr>
              <th>Editoras</th>
              <td>{(obra.editoras || []).join(", ")}</td>
            </tr>
            <tr>
              <th>Gêneros</th>
              <td>{(obra.generos || []).join(", ")}</td>
            </tr>
            <tr>
              <th>Idiomas</th>
              <td>{(obra.idiomas || []).join(", ")}</td>
            </tr>
          </tbody>
        </table>

        <h4 className="mb-3">Exemplar Selecionado</h4>

        <table className="table table-bordered mb-4">
          <tbody>
            <tr>
              <th>Código do Exemplar</th>
              <td>{exemplar.id}</td>
            </tr>
            <tr>
              <th>Seção</th>
              <td>{exemplar.nomeSecao || "-"}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{exemplar.nomeStatusExemplar}</td>
            </tr>
          </tbody>
        </table>

        <div className="d-flex justify-content-end">
          <Button variant="contained" color="success" onClick={confirmar}>
            Confirmar Empréstimo
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ConfirmarEmprestimo;