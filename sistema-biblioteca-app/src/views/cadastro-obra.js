import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Card from "../components/card";
import FormGroup from "../components/form-group";

import {
  mensagemSucesso,
  mensagemErro
} from "../components/toastr";

import "../custom.css";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS}/obras`;

function CadastroObra() {

  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [isbn, setIsbn] = useState("");
  const [edicao, setEdicao] = useState("");

  const [autoresIds, setAutoresIds] = useState([]);
  const [editorasIds, setEditorasIds] = useState([]);
  const [generosIds, setGenerosIds] = useState([]);
  const [idiomasIds, setIdiomasIds] = useState([]);

  const [dadosAutores, setDadosAutores] =
    useState(null);

  const [dadosEditoras, setDadosEditoras] =
    useState(null);

  const [dadosGeneros, setDadosGeneros] =
    useState(null);

  const [dadosIdiomas, setDadosIdiomas] =
    useState(null);

  const voltar = () => {
    navigate("/listagem-obras");
  };

  async function salvar() {

    if (!titulo || titulo.trim() === "") {
      mensagemErro(
        "O título é obrigatório."
      );
      return;
    }

    if (!isbn || isbn.trim() === "") {
      mensagemErro(
        "O ISBN é obrigatório."
      );
      return;
    }

    if (!edicao || edicao.trim() === "") {
      mensagemErro(
        "A edição é obrigatória."
      );
      return;
    }

    const data = {
      id,
      titulo,
      isbn,
      edicao,
      autoresIds,
      editorasIds,
      generosIds,
      idiomasIds
    };

    try {

      if (idParam == null) {

        await axios.post(
          baseURL,
          data,
          {
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );

        mensagemSucesso(
          `Obra ${titulo} cadastrada com sucesso!`
        );

      } else {

        await axios.put(
          `${baseURL}/${idParam}`,
          data,
          {
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );

        mensagemSucesso(
          `Obra ${titulo} alterada com sucesso!`
        );
      }

      navigate("/listagem-obras");

    } catch (error) {

      mensagemErro(
        error.response?.data ||
        "Erro ao salvar obra."
      );
    }
  }

  async function buscar() {

    try {

      const response =
        await axios.get(
          `${baseURL}/${idParam}`
        );

      const obra =
        response.data;

      setId(
        obra.id
      );

      setTitulo(
        obra.titulo || ""
      );

      setIsbn(
        obra.isbn || ""
      );

      setEdicao(
        obra.edicao || ""
      );

      setAutoresIds(
        obra.autoresIds || []
      );

      setEditorasIds(
        obra.editorasIds || []
      );

      setGenerosIds(
        obra.generosIds || []
      );

      setIdiomasIds(
        obra.idiomasIds || []
      );

    } catch {

      mensagemErro(
        "Erro ao buscar obra."
      );
    }
  }

  useEffect(() => {

    axios
      .get(`${API_URLS}/autores`)
      .then((response) => {
        setDadosAutores(
          response.data
        );
      });

  }, []);

  useEffect(() => {

    axios
      .get(`${API_URLS}/editoras`)
      .then((response) => {
        setDadosEditoras(
          response.data
        );
      });

  }, []);

  useEffect(() => {

    axios
      .get(`${API_URLS}/generos`)
      .then((response) => {
        setDadosGeneros(
          response.data
        );
      });

  }, []);

  useEffect(() => {

    axios
      .get(`${API_URLS}/idiomas`)
      .then((response) => {
        setDadosIdiomas(
          response.data
        );
      });

  }, []);

  useEffect(() => {

    if (idParam) {
      buscar();
    }

  }, [idParam]);

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

              <FormGroup
                label='Título: *'
                htmlFor='inputTitulo'
              >
                <input
                  type='text'
                  id='inputTitulo'
                  value={titulo}
                  className='form-control'
                  name='titulo'
                  onChange={(e) =>
                    setTitulo(
                      e.target.value
                    )
                  }
                />
              </FormGroup>

              <FormGroup
                label='ISBN: *'
                htmlFor='inputIsbn'
              >
                <input
                  type='text'
                  maxLength='13'
                  id='inputIsbn'
                  value={isbn}
                  className='form-control'
                  name='isbn'
                  onChange={(e) =>
                    setIsbn(
                      e.target.value
                    )
                  }
                />
              </FormGroup>

              <FormGroup
                label='Edição: *'
                htmlFor='inputEdicao'
              >
                <input
                  type='text'
                  id='inputEdicao'
                  value={edicao}
                  className='form-control'
                  name='edicao'
                  onChange={(e) =>
                    setEdicao(
                      e.target.value
                    )
                  }
                />
              </FormGroup>

              <FormGroup label='Autores:'>

                <Autocomplete
                  multiple
                  options={dadosAutores}
                  getOptionLabel={
                    (option) =>
                      option.nome
                  }
                  value={
                    dadosAutores.filter(
                      (autor) =>
                        autoresIds.includes(
                          autor.id
                        )
                    )
                  }
                  onChange={(
                    event,
                    novosValores
                  ) =>
                    setAutoresIds(
                      novosValores.map(
                        (a) => a.id
                      )
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Selecione autores'
                    />
                  )}
                />

              </FormGroup>

              <FormGroup label='Editoras:'>

                <Autocomplete
                  multiple
                  options={dadosEditoras}
                  getOptionLabel={
                    (option) =>
                      option.nome
                  }
                  value={
                    dadosEditoras.filter(
                      (editora) =>
                        editorasIds.includes(
                          editora.id
                        )
                    )
                  }
                  onChange={(
                    event,
                    novosValores
                  ) =>
                    setEditorasIds(
                      novosValores.map(
                        (e) => e.id
                      )
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Selecione editoras'
                    />
                  )}
                />

              </FormGroup>

              <FormGroup label='Gêneros:'>

                <Autocomplete
                  multiple
                  options={dadosGeneros}
                  getOptionLabel={
                    (option) =>
                      option.nome
                  }
                  value={
                    dadosGeneros.filter(
                      (genero) =>
                        generosIds.includes(
                          genero.id
                        )
                    )
                  }
                  onChange={(
                    event,
                    novosValores
                  ) =>
                    setGenerosIds(
                      novosValores.map(
                        (g) => g.id
                      )
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Selecione gêneros'
                    />
                  )}
                />

              </FormGroup>

              <FormGroup label='Idiomas:'>

                <Autocomplete
                  multiple
                  options={dadosIdiomas}
                  getOptionLabel={
                    (option) =>
                      option.nome
                  }
                  value={
                    dadosIdiomas.filter(
                      (idioma) =>
                        idiomasIds.includes(
                          idioma.id
                        )
                    )
                  }
                  onChange={(
                    event,
                    novosValores
                  ) =>
                    setIdiomasIds(
                      novosValores.map(
                        (i) => i.id
                      )
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Selecione idiomas'
                    />
                  )}
                />

              </FormGroup>

              <Stack
                spacing={1}
                padding={1}
                direction="row"
              >

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

export default CadastroObra;