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

const EXEMPLARES_URL = `${API_URLS.exemplares}/exemplares`;
const STATUS_EXEMPLARES_URL = `${API_URLS.statusExemplares}/statusExemplar`;
const OBRAS_URL = `${API_URLS.obras}/obras`;

function SelecionarExemplar() {
  const navigate = useNavigate();
  const { idCliente, idObra } = useParams();

  const [exemplares, setExemplares] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [obra, setObra] = useState(null);

  useEffect(() => {
    axios.get(`${OBRAS_URL}/${idObra}`)
      .then((r) => setObra(r.data))
      .catch(() => {});

    axios
      .get(STATUS_EXEMPLARES_URL)
      .then((res) => setStatusList(res.data))
      .catch(() => {
        mensagemErro("Erro ao carregar status dos exemplares");
      });

    axios
      .get(EXEMPLARES_URL)
      .then((res) =>
        setExemplares(res.data.filter((ex) => Number(ex.idObra) === Number(idObra)))
      )
      .catch(() => {
        mensagemErro("Erro ao carregar exemplares");
      });
  }, [idObra]);

  const voltar = () => navigate(`/selecionar-obra/${idCliente}`);

  const statusName = (idStatus) => {
    const s = statusList.find((st) => st.id === idStatus);
    return s ? s.nome : `Status ${idStatus}`;
  };

  const selecionar = (exemplar) => {
    if (exemplar.idStatus !== 1) {
      mensagemErro(`Exemplar indisponível: ${statusName(exemplar.idStatus)}`);
      return;
    }
    mensagemSucesso("Exemplar selecionado — siga para confirmação");
    navigate(`/confirmar-emprestimo/${idCliente}/${idObra}/${exemplar.id}`);
  };

  return (
    <div className="container">
      <Card
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton aria-label="voltar" onClick={voltar}>
              <ArrowBackIosIcon />
            </IconButton>
            <span>Selecionar Exemplar {obra ? `— ${obra.titulo}` : ""}</span>
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
                <th>Data Aquisição</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {exemplares.map((ex) => {
                const disponivel = ex.idStatus === 1;
                return (
                  <tr key={ex.id}>
                    <td>{ex.id}</td>
                    <td>{ex.dataAquisicao}</td>
                    <td>{statusName(ex.idStatus)}</td>
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
