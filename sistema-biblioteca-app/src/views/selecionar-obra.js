import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";
import { mensagemErro } from "../components/toastr";
import { API_URLS } from "../config/axios";

const OBRAS_URL = `${API_URLS.obras}/obras`;

function SelecionarObra() {
  const navigate = useNavigate();
  const { idCliente } = useParams();
  const [obras, setObras] = useState([]);

  useEffect(() => {
    axios
      .get(OBRAS_URL)
      .then((res) => setObras(res.data))
      .catch(() => {
        mensagemErro("Erro ao carregar obras");
      });
  }, []);

  const voltar = () => navigate(`/perfil-cliente/${idCliente}`);

  const selecionarObra = (obra) => {
    navigate(`/selecionar-exemplar/${idCliente}/${obra.id}`);
  };

  return (
    <div className="container">
      <Card
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton aria-label="voltar" onClick={voltar}>
              <ArrowBackIosIcon />
            </IconButton>
            <span>Selecionar Obra</span>
          </Stack>
        }
      >
        {obras.length === 0 ? (
          <p>Nenhuma obra encontrada.</p>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Título</th>
                <th>Edição</th>
                <th>ISBN</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((obra) => (
                <tr key={obra.id}>
                  <td>{obra.titulo}</td>
                  <td>{obra.edicao}</td>
                  <td>{obra.isbn}</td>
                  <td>
                    <Button
                      variant="contained"
                      onClick={() => selecionarObra(obra)}
                    >
                      Selecionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default SelecionarObra;
