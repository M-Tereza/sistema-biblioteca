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

function CadastroIdiomas() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/idiomas`;

  const [id, setId] = useState('');
  const [idNomeIdioma, setIdNomeIdioma] = useState(0);
  const [link, setLink] = useState('');

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setIdNomeIdioma(0);
      setLink('');
    } else {
      setId(dados.id);
      setIdNomeIdioma(dados.idNomeIdioma);
      setLink(dados.link);
    }
  }

  async function salvar() {
    let data = {
      id,
      idNomeIdioma: idNomeIdioma,
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
            `Idioma ${idNomeIdioma} cadastrado com sucesso!`
          );
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
          mensagemSucesso(
            `Idioma ${titulo} alterado com sucesso!`
          );
          navigate(`/listagem-idiomas`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
  }

  async function buscar() {
    if(idParam != null){
    await axios.get(`${baseURL}/${idParam}`).then((response) => {
      setDados(response.data);
    });
    setId(dados.id);
    setIdNomeIdioma(dados.idNomeIdioma);
    setLink(dados.link);
    }
  }

  const [dadosIdiomas, setDadosIdiomas] = React.useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/idiomas`).then((response) => {
      setDadosIdiomas(response.data);
    });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosIdiomas) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Idiomas'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Idioma: *' htmlFor='selectIdioma'>
                <select
                  class='form-select'
                  id='selectIdioma'
                  name='idNomeIdioma'
                  value={idNomeIdioma}
                  onChange={(e) => setIdNomeIdioma(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosIdiomas.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.idioma}
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

export default CadastroIdiomas;
