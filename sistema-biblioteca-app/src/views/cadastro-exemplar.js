import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Card from "../components/card";
import FormGroup from "../components/form-group";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";

import axios from 'axios';
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.exemplares}/exemplares`;
const secoesURL = `${API_URLS.secoes}/secoes`;

function CadastroExemplar() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [secao, setSecao] = useState('');
  const [dados, setDados] = useState(null);
  const [secoes, setSecoes] = useState([]);

  const voltar = () => {
    navigate(`/perfil-obra/${idParam}`);
  };

  async function salvar() {
    const data = JSON.stringify({ id, secao });

    try {
      if (idParam == null) {
        await axios.post(baseURL, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Exemplar cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Exemplar alterado com sucesso!`);
      }

      navigate(`/perfil-obra/${idParam}`);

    } catch (error) {
      mensagemErro(error.response?.data || "Erro ao salvar exemplar.");
    }
  }

  async function buscar() {
    if (!idParam) return;

    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      setDados(response.data);
      setId(response.data.id);
      setSecao(response.data.secao);
    } catch {
      mensagemErro("Erro ao buscar exemplar.");
    }
  }

  useEffect(() => {
    buscar();

    axios.get(secoesURL)
      .then(res => setSecoes(res.data))
      .catch(() => mensagemErro("Erro ao carregar seções"));
  }, [idParam]);

  if (!dados && idParam) return <p>Carregando...</p>;

  return (
    <div className='container'>
      <Card title='Cadastro de Exemplar'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>

              <FormGroup label='Seção: *' htmlFor='selectSecao'>
                <select
                  id='selectSecao'
                  className='form-control'
                  value={secao}
                  onChange={(e) => setSecao(e.target.value)}
                >
                  <option value="">Selecione uma seção</option>
                  {secoes.map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
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

export default CadastroExemplar;
