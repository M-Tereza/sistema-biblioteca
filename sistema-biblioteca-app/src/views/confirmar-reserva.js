import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/card";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";

import axios from "axios";

import {
  mensagemErro,
  mensagemSucesso,
} from "../components/toastr";

import { API_URLS } from "../config/axios";

const RESERVAS_URL = `${API_URLS}/reservas`;
const OBRAS_URL = `${API_URLS}/obras`;
const EXEMPLARES_URL = `${API_URLS}/exemplares`;

function ConfirmarReserva() {

  const navigate = useNavigate();

  const {
    idCliente,
    idObra,
  } = useParams();

  const voltar = () =>
    navigate(`/selecionar-obra/${idCliente}?tipo=reserva`);

  const [obra, setObra] = useState(null);
  const [exemplar, setExemplar] = useState(null);

  useEffect(() => {

    async function carregar() {

      try {

        const { data: obraData } =
          await axios.get(`${OBRAS_URL}/${idObra}`);

        setObra(obraData);

        const { data: exemplares } =
          await axios.get(EXEMPLARES_URL);

        const disponivel =
          exemplares.find(
            ex =>
              Number(ex.idObra) === Number(idObra) &&
              ex.idStatusExemplar === 1
          );

        setExemplar(disponivel || null);

      } catch {

        mensagemErro(
          "Erro ao carregar informações da obra."
        );

      }

    }

    carregar();

  }, [idObra]);

  async function confirmar() {

    try {

      await axios.post(
        RESERVAS_URL,
        {
          idCliente: Number(idCliente),
          idObra: Number(idObra),
        }
      );

      mensagemSucesso(
        "Reserva realizada com sucesso!"
      );

      navigate(`/perfil-cliente/${idCliente}`);

    } catch {

      mensagemErro(
        "Erro ao realizar a reserva."
      );

    }

  }

  if (!obra) {

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
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <IconButton
              aria-label="voltar"
              onClick={voltar}
            >
              <ArrowBackIosIcon />
            </IconButton>

            <span>
              Confirmar Reserva
            </span>

          </Stack>
        }
      >

        <h4 className="mb-3">
          Obra Selecionada
        </h4>

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

        <h4 className="mb-3">
          Situação da Reserva
        </h4>

        <table className="table table-bordered mb-4">

          <tbody>

            <tr>

              <th>Exemplar disponível</th>

              <td>

                {
                  exemplar
                    ? `Sim (Código ${exemplar.id})`
                    : "Não"
                }

              </td>

            </tr>

            <tr>

              <th>Resultado</th>

              <td>

                {
                  exemplar
                    ? "Não é possível realizar uma reserva para esta obra."
                    : "A reserva será criada e o cliente entrará na fila de espera."
                }

              </td>

            </tr>

          </tbody>

        </table>

        {

          exemplar &&

          <Alert
            severity="warning"
            sx={{ mb: 3 }}
          >

            Existe um exemplar disponível para empréstimo imediato.

            <br />

            De acordo com as regras da biblioteca, obras com exemplares
            disponíveis não podem ser reservadas. Para obter esta obra,
            realize um empréstimo.

          </Alert>

        }

        <div className="d-flex justify-content-end">

          {

            exemplar ?

              <Button
                variant="contained"
                onClick={voltar}
              >
                Voltar
              </Button>

              :

              <Button
                variant="contained"
                color="secondary"
                onClick={confirmar}
              >
                Confirmar Reserva
              </Button>

          }

        </div>

      </Card>

    </div>

  );

}

export default ConfirmarReserva;