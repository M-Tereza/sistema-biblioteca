import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { mensagemErro, mensagemSucesso } from "../components/toastr";
import { API_URLS } from "../config/axios";

const EXEMPLARES_URL = `${API_URLS}/exemplares`;
const OBRAS_URL = `${API_URLS}/obras`;

function SelecionarExemplar() {
  const navigate = useNavigate();
  const { idCliente, idObra } = useParams();

  const [exemplares, setExemplares] = useState([]);
  const [obra, setObra] = useState(null);

  useEffect(() => {
    axios
      .get(`${OBRAS_URL}/${idObra}`)
      .then((res) => setObra(res.data))
      .catch(() => {});

    axios
      .get(EXEMPLARES_URL)
      .then((res) =>
        setExemplares(
          res.data.filter((ex) => Number(ex.idObra) === Number(idObra))
        )
      )
      .catch(() => mensagemErro("Erro ao carregar exemplares"));
  }, [idObra]);

  const voltar = () => navigate(`/selecionar-obra/${idCliente}`);

  const selecionar = (exemplar) => {
    if (exemplar.idStatusExemplar !== 1) {
      mensagemErro(`Exemplar indisponível: ${exemplar.nomeStatusExemplar}`);
      return;
    }

    mensagemSucesso("Exemplar selecionado — siga para confirmação");

    navigate(
      `/confirmar-emprestimo/${idCliente}/${idObra}/${exemplar.id}`
    );
  };

  return (
    <div className="container">
      <Card
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={voltar}>
              <ArrowBackIosIcon />
            </IconButton>
            <span>Selecionar Exemplar{obra ? ` — ${obra.titulo}` : ""}</span>
          </Stack>
        }
      >
        {exemplares.length === 0 ? (
          <p>Nenhum exemplar cadastrado para esta obra.</p>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data/Hora Aquisição</th>
                <th>Seção</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {exemplares.map((ex) => {
                const disponivel = ex.idStatusExemplar === 1;

                return (
                  <tr key={ex.id}>
                    <td>{ex.id}</td>
                    <td>{ex.dataHoraAquisicao}</td>
                    <td>{ex.nomeSecao || "-"}</td>
                    <td>{ex.nomeStatusExemplar}</td>
                    <td>
                      <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => selecionar(ex)}
                        disabled={!disponivel}
                      >
                        {disponivel ? "Selecionar" : "Indisponível"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default SelecionarExemplar;