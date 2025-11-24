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


  const [cliente, setCliente] = useState({
    id: '',
    nome: '',
    cpf: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    dataNascimento: '',
    telefone: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    if (idParam) {
      axios
        .get(`${baseURL}/${idParam}`)
        .then((response) => {
          setCliente(response.data);
        })
        .catch((error) => {
          mensagemErro("Erro ao buscar cliente.");
        });
    }
  }, [idParam]);

  async function salvar() {
    try {
      if (!idParam) {
        await axios.post(baseURL, cliente, {
          headers: { "Content-Type": "application/json" },
        });
        mensagemSucesso(`Cliente ${cliente.nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, cliente, {
          headers: { "Content-Type": "application/json" },
        });
        mensagemSucesso(`Cliente ${cliente.nome} alterado com sucesso!`);
      }

      navigate("/listagem-clientes");

    } catch (error) {
      mensagemErro("Erro ao salvar cliente.");
    }
  }

  function inicializar() {
    setCliente({
      id: '',
      nome: '',
      cpf: '',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      complemento: '',
      dataNascimento: '',
      telefone: '',
      cidade: '',
      estado: ''
    });
  }

  return (
    <div className="container">
      <Card title="Cadastro de Cliente">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">

              <FormGroup label="Nome:" htmlFor="inputNome">
                <input
                  type="text"
                  id="inputNome"
                  className="form-control"
                  value={cliente.nome}
                  onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="CPF:" htmlFor="inputCpf">
                <input
                  type="text"
                  maxLength="11"
                  id="inputCpf"
                  className="form-control"
                  value={cliente.cpf}
                  onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="CEP:" htmlFor="inputCep">
                <input
                  type="text"
                  id="inputCep"
                  className="form-control"
                  value={cliente.cep}
                  onChange={(e) => setCliente({ ...cliente, cep: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="Rua:" htmlFor="inputRua">
                <input
                  type="text"
                  id="inputRua"
                  className="form-control"
                  value={cliente.rua}
                  onChange={(e) => setCliente({ ...cliente, rua: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="Número:" htmlFor="inputNumero">
                <input
                  type="text"
                  id="inputNumero"
                  className="form-control"
                  value={cliente.numero}
                  onChange={(e) => setCliente({ ...cliente, numero: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="Bairro:" htmlFor="inputBairro">
                <input
                  type="text"
                  id="inputBairro"
                  className="form-control"
                  value={cliente.bairro}
                  onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="Complemento:" htmlFor="inputComplemento">
                <input
                  type="text"
                  id="inputComplemento"
                  className="form-control"
                  value={cliente.complemento}
                  onChange={(e) =>
                    setCliente({ ...cliente, complemento: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup label="Data de Nascimento:" htmlFor="inputDtNascimento">
                <input
                  type="date"
                  id="inputDtNascimento"
                  className="form-control"
                  value={cliente.dataNascimento}
                  onChange={(e) =>
                    setCliente({ ...cliente, dataNascimento: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup label="Telefone:" htmlFor="inputTelefone">
                <input
                  type="text"
                  id="inputTelefone"
                  className="form-control"
                  value={cliente.telefone}
                  onChange={(e) =>
                    setCliente({ ...cliente, telefone: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup label="Cidade:" htmlFor="inputCidade">
                <input
                  type="text"
                  id="inputCidade"
                  className="form-control"
                  value={cliente.cidade}
                  onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })}
                />
              </FormGroup>

              <FormGroup label="Estado:" htmlFor="inputEstado">
                <input
                  type="text"
                  id="inputEstado"
                  className="form-control"
                  value={cliente.estado}
                  onChange={(e) => setCliente({ ...cliente, estado: e.target.value })}
                />
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
