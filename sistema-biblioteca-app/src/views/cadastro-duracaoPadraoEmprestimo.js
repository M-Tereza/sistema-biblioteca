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

const baseURL = `${API_URLS}/duracaoPadraoEmprestimos`;

function CadastroDuracaoPadraoEmprestimo() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [diasUteis, setDiasUteis] = useState("");
  const [dataHoraAlteracao, setDataHoraAlteracao] = useState("");

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId("");
      setDiasUteis("");
      setDataHoraAlteracao("");
    } else {
      setId(dados.id);
      setDiasUteis(dados.diasUteis);
      setDataHoraAlteracao(dados.dataHoraAlteracao);
    }
  }

  const voltar = () => {
    navigate("/listagem-duracaoPadraoEmprestimos");
  };

  async function salvar() {

    if (
      diasUteis === "" ||
      !Number.isInteger(diasUteis) ||
      diasUteis <= 0
    ) {
      mensagemErro("Informe uma quantidade de dias úteis maior que zero.");
      return;
    }

    const data = { id, diasUteis, dataHoraAlteracao, };

    try {
      if (idParam == null) {
        await axios.post(baseURL, data);

        mensagemSucesso(
          `Duração padrão alterada para ${diasUteis} dias úteis com sucesso!`
        );
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);

        mensagemSucesso(
          `Duração padrão alterada para ${diasUteis} dias úteis com sucesso!`
        );
      }

      navigate("/listagem-duracaoPadraoEmprestimos");
    } catch (error) {
      mensagemErro(
        error.response?.data ||
          "Erro ao salvar valor diário para empréstimos."
      );
    }
  }

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);

      const dados = response.data;

      setDados(dados);
      setId(dados.id);
      setDiasUteis(dados.diasUteis);
      setDataHoraAlteracao(dados.dataHoraAlteracao);
    } catch (error) {
      mensagemErro("Erro ao buscar valor diário para empréstimos.");
    }
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
      <Card title="Cadastro de Duração Padrão para Empréstimos">
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

export default CadastroDuracaoPadraoEmprestimo;