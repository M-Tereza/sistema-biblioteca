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
import { normalizarStringValorMonetario } from "../utils/formatadores";

import "../custom.css";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS}/valorDiarioMultas`;

function CadastroValorDiarioMulta() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [valorDia, setValorDia] = useState(0);
  const [dataHoraAlteracao, setDataHoraAlteracao] = useState("");

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId("");
      setValorDia(0);
      setDataHoraAlteracao("");
    } else {
      setId(dados.id);
      setValorDia(dados.valorDia);
      setDataHoraAlteracao(dados.dataHoraAlteracao);
    }
  }

  const voltar = () => {
    navigate("/listagem-valorDiarioMultas");
  };

  async function salvar() {
    const valorDiaNormalizado = normalizarStringValorMonetario(valorDia);

    if (valorDiaNormalizado == null) {
      mensagemErro("Informe um valor monetário válido.");
      return;
    }

    const partes = valorDiaNormalizado.split(".");

    if (partes.length > 1 && partes[1].length > 2) {
      mensagemErro("Informe um valor com no máximo 2 casas decimais.");
      return;
    }

    try {
      const resposta = await axios.get(baseURL);

      const ultimoValor = [...(resposta.data || [])]
        .sort((a, b) => b.id - a.id)[0];

      if (
        ultimoValor &&
        Number(ultimoValor.valorDia) === Number(valorDiaNormalizado)
      ) {
        mensagemErro("O valor informado já é o valor diário vigente.");
        return;
      }

      let data = {
        id,
        valorDia: parseFloat(valorDiaNormalizado),
        dataHoraAlteracao
      };

      data = JSON.stringify(data);

      if (idParam == null) {
        await axios.post(baseURL, data, {
          headers: { "Content-Type": "application/json" }
        });

        mensagemSucesso(
          `Valor diario para multas alterado para R$ ${Number(
            valorDiaNormalizado
          ).toFixed(2)} com sucesso!`
        );
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" }
        });

        mensagemSucesso(
          `Valor diario para multas alterado para R$ ${Number(
            valorDiaNormalizado
          ).toFixed(2)} com sucesso!`
        );
      }

      navigate("/listagem-valorDiarioMultas");
    } catch (error) {
      mensagemErro(
        error.response?.data || "Erro ao salvar valor diario para multas."
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
        mensagemErro("Erro ao buscar valor diario para multas.");
      });

    setId(dados.id);
    setValorDia(dados.valorDia);
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
      <Card title="Cadastro de ValorDiarioMulta">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <FormGroup label="Valor da Multa *" htmlFor="inputValor">
                <input
                  type="text"
                  maxLength="30"
                  id="inputValor"
                  value={valorDia}
                  className="form-control"
                  name="valorDia"
                  onChange={(e) => setValorDia(e.target.value)}
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

export default CadastroValorDiarioMulta;