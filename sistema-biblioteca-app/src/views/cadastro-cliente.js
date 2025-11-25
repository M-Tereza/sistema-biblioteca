import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { API_URLS } from "../config/axios";
const baseURL = `${API_URLS.clientes}/clientes`;

function CadastroCliente() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  // Campos
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [obra, setObra] = useState('');
  const [pendencia, setPendencia] = useState('');
  const [listaObras, setListaObras] = useState([]);
  const [listaPendencias, setListaPendencias] = useState([]);
  const [dados, setDados] = useState([]);

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      setDados(response.data);

      setId(response.data.id);
      setNome(response.data.nome);
      setCpf(response.data.cpf);
      setCep(response.data.cep);
      setRua(response.data.rua);
      setNumero(response.data.numero);
      setBairro(response.data.bairro);
      setComplemento(response.data.complemento);
      setDataNascimento(response.data.dataNascimento);
      setTelefone(response.data.telefone);
      setCidade(response.data.cidade);
      setEstado(response.data.estado);

      setObra(response.data.obras || "");
      setPendencia(response.data.pendencias || "");

    } catch (e) {
      mensagemErro("Erro ao buscar cliente.");
    }
  }

  async function carregarListas() {
    try {
      const response = await axios.get(baseURL);

      const obrasExtraidas = response.data.map(c => c.obras);
      const pendenciasExtraidas = response.data.map(c => c.pendencias);

      setListaObras([...new Set(obrasExtraidas)]);
      setListaPendencias([...new Set(pendenciasExtraidas)]);
    } catch {
      mensagemErro("Erro ao carregar obras e pendências.");
    }
  }

  useEffect(() => {
    carregarListas();

    if (idParam) {
      buscar();
    }
  }, []);

  function inicializar() {
    setId('');
    setNome('');
    setCpf('');
    setCep('');
    setRua('');
    setNumero('');
    setBairro('');
    setComplemento('');
    setDataNascimento('');
    setTelefone('');
    setCidade('');
    setEstado('');
    setObra('');
    setPendencia('');
  }

  async function salvar() {
    let data = {
      id,
      nome,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      complemento,
      dataNascimento,
      telefone,
      cidade,
      estado,
      obras: obra,
      pendencias: pendencia
    };

    try {
      if (idParam == null) {
        await axios.post(baseURL, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Cliente ${nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        mensagemSucesso(`Cliente ${nome} alterado com sucesso!`);
      }

      navigate("/listagem-clientes");

    } catch (error) {
      mensagemErro("Erro ao salvar cliente.");
    }
  }

  if (!dados && idParam) return null;

  return (
    <div className="container">
      <Card title="Cadastro de Cliente">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">

              <FormGroup label="Nome: *" htmlFor="inputNome">
                <input
                  type="text"
                  id="inputNome"
                  value={nome}
                  className="form-control"
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="CPF: *" htmlFor="inputCpf">
                <input
                  type="text"
                  maxLength="11"
                  id="inputCpf"
                  value={cpf}
                  className="form-control"
                  onChange={(e) => setCpf(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="CEP:" htmlFor="inputCep">
                <input
                  type="text"
                  id="inputCep"
                  value={cep}
                  className="form-control"
                  onChange={(e) => setCep(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Rua:" htmlFor="inputRua">
                <input
                  type="text"
                  id="inputRua"
                  value={rua}
                  className="form-control"
                  onChange={(e) => setRua(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Número:" htmlFor="inputNumero">
                <input
                  type="text"
                  id="inputNumero"
                  value={numero}
                  className="form-control"
                  onChange={(e) => setNumero(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Bairro:" htmlFor="inputBairro">
                <input
                  type="text"
                  id="inputBairro"
                  value={bairro}
                  className="form-control"
                  onChange={(e) => setBairro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Complemento:" htmlFor="inputComplemento">
                <input
                  type="text"
                  id="inputComplemento"
                  value={complemento}
                  className="form-control"
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Data de Nascimento:" htmlFor="inputDtNascimento">
                <input
                  type="date"
                  id="inputDtNascimento"
                  value={dataNascimento}
                  className="form-control"
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Telefone:" htmlFor="inputTelefone">
                <input
                  type="text"
                  id="inputTelefone"
                  value={telefone}
                  className="form-control"
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Cidade:" htmlFor="inputCidade">
                <input
                  type="text"
                  id="inputCidade"
                  value={cidade}
                  className="form-control"
                  onChange={(e) => setCidade(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Estado:" htmlFor="inputEstado">
                <input
                  type="text"
                  id="inputEstado"
                  value={estado}
                  className="form-control"
                  onChange={(e) => setEstado(e.target.value)}
                />
              </FormGroup>

              {/* COMBOBOX OBRAS */}
              <FormGroup label="Obra:" htmlFor="selectObra">
                <select
                  id="selectObra"
                  className="form-control"
                  value={obra}
                  onChange={(e) => setObra(e.target.value)}
                >
                  <option value="">Selecione uma obra</option>
                  {listaObras.map((o, index) => (
                    <option key={index} value={o}>{o}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Pendências:" htmlFor="selectPendencia">
                <select
                  id="selectPendencia"
                  className="form-control"
                  value={pendencia}
                  onChange={(e) => setPendencia(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {listaPendencias.map((p, index) => (
                    <option key={index} value={p}>{p}</option>
                  ))}
                </select>
              </FormGroup>

              <Stack spacing={1} padding={1} direction="row">
                <button onClick={salvar} type="button" className="btn btn-success">
                  Salvar
                </button>
                <button onClick={inicializar} type="button" className="btn btn-danger">
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

export default CadastroCliente;
