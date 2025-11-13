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

import axios from 'axios';
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.generos}/generos`;

function CadastroGenero() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
    } else {
      setId(dados.id);
      setNome(dados.nome);
    }
  }

  async function salvar() {
    let data = { id, nome };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Gênero ${nome} cadastrado com sucesso!`);
          navigate(`/listagem-generos`);
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
          mensagemSucesso(`Genero ${nome} alterado com sucesso!`);
          navigate(`/listagem-generos`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
  }


  async function buscar() {
    if (idParam != null) {
      await axios
        .get(`${baseURL} / ${idParam}`)
        .then((response) => {
          setDados(response.data);
          setId(dados.id);
          setNome(dados.nome);
        })
        .catch(() => {
          mensagemErro("Erro ao buscar dados do idioma.");
        });
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Genero'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Genero: *' htmlFor='inputNome'>
                <input
                  type='text'
                  maxLength='30'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
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

export default CadastroGenero;