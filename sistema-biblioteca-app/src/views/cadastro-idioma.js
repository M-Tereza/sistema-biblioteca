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

const baseURL = `${API_URLS.idiomas}/idiomas`;

function CadastroIdioma() {
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

    try {
      if (idParam == null) {
        await axios.post(baseURL, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Idioma ${nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Idioma ${nome} alterado com sucesso!`);
      }

      navigate("/listagem-idiomas");

    } catch (error) {
      mensagemErro(error.response?.data || "Erro ao salvar idioma.");
    }
  }


  async function buscar() {
    await axios.get(`${baseURL}/${idParam}`)
      .then(response => {
        setDados(response.data);
      })
      .catch(() => {
        mensagemErro("Erro ao buscar idioma.");
      });

    setId(dados.id);
    setNome(dados.nome);
  }

  useEffect(() => {
        if (idParam) {
          buscar();
        } // eslint-disable-next-line
      }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Idioma'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Idioma: *' htmlFor='inputNome'>
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

export default CadastroIdioma;