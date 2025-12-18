import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import { TextField, Button, Stack } from "@mui/material";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.clientes}/clientes`;

function EdicaoCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    axios
      .get(`${baseURL}/${id}`)
      .then((res) => setCliente(res.data))
      .catch(() => mensagemErro("Erro ao carregar cliente"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const salvar = async () => {
    try {
      await axios.put(`${baseURL}/${id}`, cliente);
      mensagemSucesso("Cliente atualizado com sucesso!");
      navigate(`/perfil-cliente/${id}`);
    } catch (error) {
      mensagemErro("Erro ao atualizar cliente");
    }
  };

  const cancelar = () => {
    navigate(`/perfil-cliente/${id}`);
  };

  return (
    <div className="container">
      <Card title="Editar Cliente">

        <Stack spacing={2}>
          <TextField
            label="Nome"
            name="nome"
            value={cliente.nome}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="CPF"
            name="cpf"
            value={cliente.cpf}
            onChange={handleChange}
            fullWidth
            disabled
          />

          <TextField
            label="Data de Nascimento"
            name="dataNascimento"
            type="date"
            value={cliente.dataNascimento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Telefone"
            name="telefone"
            value={cliente.telefone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="CEP"
            name="cep"
            value={cliente.cep}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Logradouro"
            name="logradouro"
            value={cliente.logradouro}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Número"
            name="numero"
            value={cliente.numero}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Complemento"
            name="complemento"
            value={cliente.complemento}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Bairro"
            name="bairro"
            value={cliente.bairro}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Cidade"
            name="cidade"
            value={cliente.cidade}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Estado"
            name="estado"
            value={cliente.estado}
            onChange={handleChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2} mt={4}>
          <Button variant="contained" onClick={salvar}>
            Salvar
          </Button>

          <Button variant="outlined" onClick={cancelar}>
            Cancelar
          </Button>
        </Stack>

      </Card>
    </div>
  );
}

export default EdicaoCliente;
