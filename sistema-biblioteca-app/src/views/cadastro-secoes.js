import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/pt-br';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroSecoes() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/secoes`;

  const [id, setId] = useState('');
  const [idNomeSecao, setIdNomeSecao] = useState(0);
  const [link, setLink] = useState('');

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setIdNomeSecao(0);
      setLink('');
    } else {
      setId(dados.id);
      setIdNomeSecao(dados.idNomeIdioma);
      setLink(dados.link);
    }
  }

  async function salvar() {
    let data = {
      id,
      idNomeSecao: idNomeSecao,
      link,
    };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(
            `Seção ${idNomeIdioma} cadastrada com sucesso!`
          );
          navigate(`/listagem-secoes`);
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
          mensagemSucesso(
            `Seção ${titulo} alterada com sucesso!`
          );
          navigate(`/listagem-secoes`);
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
    setIdNomeSecao(dados.idNomeSecao);
    setLink(dados.link);
  }

  const [dadosSecoes, setDadosSecoes] = React.useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/secoes`).then((response) => {
      setDadosSecoes(response.data);
    });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosSecoes) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Seções'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome da Seção: *' htmlFor='selectSecao'>
                <select
                  class='form-select'
                  id='selectSecao'
                  name='idNomeSecao'
                  value={idNomeSecao}
                  onChange={(e) => setIdNomeSecao(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosSecoes.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.secao}
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup label='Link:' htmlFor='inputLink'>
                <input
                  type='text'
                  id='inputLink'
                  value={link}
                  className='form-control'
                  name='link'
                  onChange={(e) => setLink(e.target.value)}
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

export default CadastroSecoes;
