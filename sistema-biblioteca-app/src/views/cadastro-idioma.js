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

import axios from "../config/axios";
import { API_URLS } from "../config/api";

function CadastroIdioma() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${API_URLS}/idiomas`;

  const [id, setId] = useState('');
  const [nomeIdioma, setNomeIdioma] = useState('');

  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNomeIdioma('');
    } else {
      setId(dados.id);
      setNomeIdioma(dados.nomeIdioma);
    }
  }

  async function salvar() {
    let data = { id, nomeIdioma};
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Idioma ${nomeIdioma} cadastrado com sucesso!`);
          navigate(`/listagem-idiomas`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Idioma ${nomeIdioma} alterado com sucesso!`);
          navigate(`/listagem-idiomas`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
  }

  async function buscar() {
    await axios.get(`${baseURL}/${idParam}`).then((response) => {
      setDados(response.data);
    });
    setId(dados.id);

    setNomeIdioma(dados.nomeIdioma);
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Idioma'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Idioma: *' htmlFor='inputNomeIdioma'>
                <input
                  type='text'
                  maxLength='30'
                  id='inputNomeIdioma'
                  value={nomeIdioma}
                  className='form-control'
                  name='nomeIdioma'
                  onChange={(e) => setNomeIdioma(e.target.value)}
                />
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
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

export default CadastroIdioma;