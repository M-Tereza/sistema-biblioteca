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

  const [dados, setDados] = useState([]);

  const [id, setId] = useState(null);
  const [nome, setNome] = useState(null);
  const [cpf, setCpf] = useState(null);
  const [dataNascimento, setDataNascimento] = useState(null);
  const [email, setEmail] = useState(null);
  const [telefone, setTelefone] = useState(null);
  const [cep, setCep] = useState(null);
  const [logradouro, setLogradouro] = useState(null);
  const [numero, setNumero] = useState(null);
  const [complemento, setComplemento] = useState(null);
  const [bairro, setBairro] = useState(null);
  const [cidade, setCidade] = useState(null);
  const [estado, setEstado] = useState(null);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setCpf('');
      setDataNascimento('');
      setEmail('');
      setTelefone('');
      setCep('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
    } else {
      setId(dados.id);
      setNome(dados.nome);
      setCpf(dados.cpf);
      setDataNascimento(dados.dataNascimento);
      setEmail(dados.email);
      setTelefone(dados.telefone);
      setCep(dados.cep);
      setLogradouro(dados.logradouro);
      setNumero(dados.numero);
      setComplemento(dados.complemento);
      setBairro(dados.bairro);
      setCidade(dados.cidade);
      setEstado(dados.estado);
    }
  }

  const voltar = () => {
    if (idParam == null) {
      navigate(`/listagem-clientes`);
    } else {
      navigate(`/perfil-cliente/${dados.id}`);
    }
  };

  async function salvar() {
    let data = {
      id,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    };

    try {
      if (!idParam) {
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

    } catch {
      mensagemErro("Erro ao salvar cliente.");
    }
  }

  async function buscar() {
    await axios.get(`${baseURL}/${idParam}`)
      .then(response => {
        setDados(response.data);
      })
      .catch(() => {
        mensagemErro("Erro ao buscar cliente.");
      });

    setId(dados.id);
    setNome(dados.nome);
    setCpf(dados.cpf);
    setDataNascimento(dados.dataNascimento);
    setEmail(dados.email);
    setTelefone(dados.telefone);
    setCep(dados.cep);
    setLogradouro(dados.logradouro);
    setNumero(dados.numero);
    setComplemento(dados.complemento);
    setBairro(dados.bairro);
    setCidade(dados.cidade);
    setEstado(dados.estado);
  }

  useEffect(() => {
    if (idParam) {
      buscar();
    } // eslint-disable-next-line
  }, [id]);

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
                  maxLength="14"
                  id="inputCpf"
                  value={cpf}
                  className="form-control"
                  onChange={(e) => setCpf(e.target.value)}
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

              <FormGroup label="Email:" htmlFor="inputEmail">
                <input
                  type="email"
                  id="inputEmail"
                  value={email}
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
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

              <FormGroup label="CEP:" htmlFor="inputCep">
                <input
                  type="text"
                  id="inputCep"
                  value={cep}
                  className="form-control"
                  onChange={(e) => setCep(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Logradouro:" htmlFor="inputLogradouro">
                <input
                  type="text"
                  id="inputLogradouro"
                  value={logradouro}
                  className="form-control"
                  onChange={(e) => setLogradouro(e.target.value)}
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

              <FormGroup label="Complemento:" htmlFor="inputComplemento">
                <input
                  type="text"
                  id="inputComplemento"
                  value={complemento}
                  className="form-control"
                  onChange={(e) => setComplemento(e.target.value)}
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

export default CadastroCliente;
