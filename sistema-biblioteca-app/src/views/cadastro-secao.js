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
import api from "../config/axios";
import { API_URLS } from "../config/api";

const baseURL = `${API_URLS.secoes}/secoes`;

function CadastroSecao() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${API_URLS}/secoes`;

  const [id, setId] = useState("");
  const [idNomeSecao, setIdNomeSecao] = useState('');

  const [dados, setDados] = useState({});
  const [dadosSecoes, setDadosSecoes] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId("");
      setIdNomeSecao('');
    } else {
      setId(dados.id);
      setIdNomeSecao(dados.idNomeSecao);
    }
  }

  async function salvar() {
    let data = {
      id,
      idNomeSecao: idNomeSecao,
    };
    data = JSON.stringify(data);
    const secaoSelecionada = dadosSecoes.find(
      (d) => d.id === parseInt(idNomeSecao)
    );

    if (idParam == null) {
      await api
        .post(baseURL, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then(function () {
          mensagemSucesso(
            `Seção ${secaoSelecionada?.secao || ""} cadastrada com sucesso!`
          );
          navigate(`/listagem-secoes`);
        })
        .catch(function (error) {
          mensagemErro(error.response?.data || "Erro ao cadastrar seção.");
        });
    } else {
      await api
        .put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then(function () {
          mensagemSucesso(
            `Seção ${secaoSelecionada?.secao || ""} alterada com sucesso!`
          );
          navigate(`/listagem-secoes`);
        })
        .catch(function (error) {
          mensagemErro(error.response?.data || "Erro ao alterar seção.");
        });
    }
  }

  async function buscar() {
    if (idParam != null) {
      await api
        .get(`${baseURL}/${idParam}`)
        .then((response) => {
          const dadosSecao = response.data;
          setDados(dadosSecao);
          setId(dadosSecao.id);
          setIdNomeSecao(dadosSecao.idNomeSecao);
        })
        .catch((error) => {
          mensagemErro("Erro ao buscar dados da seção.");
        });
    }
  }

  useEffect(() => {
    api.get(`${API_URLS}/secoes`).then((response) => {
      setDadosSecoes(response.data);
    });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idParam]);

  if (!dadosSecoes) return null;

  return (
    <div className="container">
      <Card title="Cadastro de Seções">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <FormGroup label="Nome da Seção: *" htmlFor="inputNomeSecao">
                <div>
                  <input
                    type='text'
                    className="form-control"
                    id="inputNomeSecao"
                    name="idNomeSecao"
                    value={idNomeSecao}
                    onChange={(e) => setIdNomeSecao(e.target.value)}
                  >
                  </input>
                </div>
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
                  onClick={inicializar}
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

export default CadastroSecao;
