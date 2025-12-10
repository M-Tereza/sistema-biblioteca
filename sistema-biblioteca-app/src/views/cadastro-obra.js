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

const baseURL = `${API_URLS.obras}/obras`;

function CadastroObra() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edicao, setEdicao] = useState('');
  const [idAutor, setIdAutor] = useState('');
  const [idEditora, setIdEditora] = useState('');
  const [idGenero, setIdGenero] = useState('');
  const [idIdioma, setIdIdioma] = useState('');

  const [dados, setDados] = React.useState([]);
  const [dadosAutores, setDadosAutores] = React.useState(null);
  const [dadosEditoras, setDadosEditoras] = React.useState(null);
  const [dadosGeneros, setDadosGeneros] = React.useState(null);
  const [dadosIdiomas, setDadosIdiomas] = React.useState(null);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setTitulo('');
      setIsbn('');
      setEdicao('');
      setIdAutor('');
      setIdEditora('');
      setIdGenero('');
      setIdIdioma('');
    } else {
      setId(dados.id);
      setTitulo(dados.titulo);
      setIsbn(dados.isbn);
      setEdicao(dados.edicao);
      setIdAutor(dados.idAutor);
      setIdEditora(dados.idEditora);
      setIdGenero(dados.idGenero);
      setIdIdioma(dados.idIdioma);
    }
  }

  const voltar = () => {
    navigate(`/listagem-obras`);
  };

  async function salvar() {
    let data = { id, titulo, isbn, edicao, idAutor, idEditora, idGenero, idIdioma };

    data = JSON.stringify(data);

    try {
      if (idParam == null) {
        await axios.post(baseURL, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Obra ${titulo} cadastrada com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Obra ${titulo} alterada com sucesso!`);
      }

      navigate("/listagem-obras");

    } catch (error) {
      mensagemErro(error.response?.data || "Erro ao salvar obra.");
    }
  }


  async function buscar() {
    await axios.get(`${baseURL}/${idParam}`)
      .then(response => {
        setDados(response.data);
      })
      .catch(() => {
        mensagemErro("Erro ao buscar obra.");
      });

    setId(dados.id);
    setTitulo(dados.titulo);
    setIsbn(dados.isbn);
    setEdicao(dados.edicao);
    setIdAutor(dados.idAutor);
    setIdEditora(dados.idEditora);
    setIdGenero(dados.idGenero);
    setIdIdioma(dados.idIdioma);
  }

  useEffect(() => {
    axios.get(`${API_URLS.autores}/autores`).then((response) => {
      setDadosAutores(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URLS.editoras}/editoras`).then((response) => {
      setDadosEditoras(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URLS.generos}/generos`).then((response) => {
      setDadosGeneros(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URLS.idiomas}/idiomas`).then((response) => {
      setDadosIdiomas(response.data);
    });
  }, []);


  useEffect(() => {
      if (idParam) {
        buscar();
      } // eslint-disable-next-line
    }, [id]);

  if (!dados) return null;
  if (!dadosAutores) return null;
  if (!dadosEditoras) return null;
  if (!dadosGeneros) return null;
  if (!dadosIdiomas) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Obra'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
             
              <FormGroup label='Título: *' htmlFor='inputTitulo'>
                <input
                  type='text'
                  id='inputTitulo'
                  value={titulo}
                  className='form-control'
                  name='titulo'
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup label='ISBN: *' htmlFor='inputIsbn'>
                <input
                  type='text'
                  maxLength='13'
                  id='inputIsbn'
                  value={isbn}
                  className='form-control'
                  name='isbn'
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup label='Edição: *' htmlFor='inputEdicao'>
                <input
                  type='text'
                  id='inputEdicao'
                  value={edicao}
                  className='form-control'
                  name='edicao'
                  onChange={(e) => setEdicao(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup label='Editora: *' htmlFor='selectEditora'>
                <select
                  className='form-select'
                  id='selectEditora'
                  name='idEditora'
                  value={idEditora}
                  onChange={(e) => setIdEditora(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosEditoras.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup label='Genero: *' htmlFor='selectGenero'>
                <select
                  className='form-select'
                  id='selectGenero'
                  name='idGenero'
                  value={idGenero}
                  onChange={(e) => setIdGenero(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosGeneros.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup label='Idioma: *' htmlFor='selectIdioma'>
                <select
                  className='form-select'
                  id='selectIdioma'
                  name='idIdioma'
                  value={idIdioma}
                  onChange={(e) => setIdIdioma(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosIdiomas.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <Stack spacing={1} padding={1} direction="row">
                <button onClick={salvar} type="button" className="btn btn-success">
                  Salvar
                </button>
                <button onClick={voltar} type="button" className="btn btn-danger">
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

export default CadastroObra;