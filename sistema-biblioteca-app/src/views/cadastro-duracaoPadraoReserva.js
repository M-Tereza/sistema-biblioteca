import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "dayjs/locale/pt-br";

import Card from "../components/card";
import FormGroup from "../components/form-group";

import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS}/duracaoPadraoReservas`;

function CadastroDuracaoPadraoReserva() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [diasUteis, setDiasUteis] = useState(0);
  const [dataHoraAlteracao, setDataHoraAlteracao] = useState("");

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId("");
      setDiasUteis(0);
      setDataHoraAlteracao("");
    } else {
      setId(dados.id);
      setDiasUteis(dados.diasUteis);
      setDataHoraAlteracao(dados.dataHoraAlteracao);
    }
  }

  const voltar = () => {
    navigate("/listagem-duracaoPadraoReservas");
  };

  async function salvar() {

    if (diasUteis === "" || !Number.isInteger(diasUteis) || diasUteis <= 0
    ) {
      mensagemErro("Informe uma quantidade de dias úteis maior que zero.");
      return;
    }

    try {
      const resposta = await axios.get(baseURL);

      const ultimoValor = [...(resposta.data || [])]
        .sort((a, b) => b.id - a.id)[0];

      if (
        ultimoValor &&
        ultimoValor.diasUteis === diasUteis
      ) {
        mensagemErro("O valor informado já é a duração padrão vigente.");
        return;
      }

      let data = { id, diasUteis, dataHoraAlteracao };

      data = JSON.stringify(data);

      if (idParam == null) {
        console.log(data);
        console.log(typeof diasUteis);
        await axios.post(baseURL, data, {
          headers: { "Content-Type": "application/json" }
        });

        mensagemSucesso(
          `Duração padrão alterada para ${diasUteis} dias úteis com sucesso!`
        );
      } else {
        console.log(data);
        console.log(typeof diasUteis);
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" }
        });

        mensagemSucesso(
          `Duração padrão alterada para ${diasUteis} dias úteis com sucesso!`
        );
      }

      navigate("/listagem-duracaoPadraoReservas");
    } catch (error) {
      mensagemErro(
        error.response?.data || "Erro ao salvar valor diário para reservas."
      );
    }
  }

  async function buscar() {
    await axios
      .get(`${baseURL}/${idParam}`)
      .then((response) => {
        setDados(response.data);
      })
      .catch(() => {
        mensagemErro("Erro ao buscar duração padrão para reservas.");
      });

    setId(dados.id);
    setDiasUteis(dados.diasUteis);
    setDataHoraAlteracao(dados.dataHoraAlteracao);
  }

  useEffect(() => {
    if (idParam) {
      buscar();
    }
    // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

  return (
    <div className="container">
      <Card title="Cadastro de Duração Padrão para Reservas">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">

              <FormGroup label="Dias Úteis *" htmlFor="inputValor">
                <input
                  type="number"
                  min="1"
                  id="inputValor"
                  value={diasUteis}
                  className="form-control"
                  name="diasUteis"
                  onChange={(e) => {
                    const valor = e.target.value;
                    setDiasUteis(valor === "" ? "" : Number(valor));
                  }}
                />
              </FormGroup>

              <Stack spacing={1} padding={1} direction="row">
                <button
                  onClick={salvar}
                  type="button"
                  className="btn btn-success"
                >
                  Salvar
                </button>

                <button
                  onClick={voltar}
                  type="button"
                  className="btn btn-danger"
                >
                  Cancelar
                </button>
              </Stack>

            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroDuracaoPadraoReserva;