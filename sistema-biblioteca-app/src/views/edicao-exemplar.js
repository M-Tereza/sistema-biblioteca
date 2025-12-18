import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import { TextField, Button, Stack, MenuItem } from "@mui/material";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.exemplares}/exemplares`;
const obrasURL = `${API_URLS.obras}/obras`;
const secoesURL = `${API_URLS.secoes}/secoes`;

function EdicaoExemplar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exemplar, setExemplar] = useState({
    idObra: "",
    idSecao: "",
    idStatus: 1
  });

  const [obras, setObras] = useState([]);
  const [secoes, setSecoes] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/${id}`)
      .then(res => setExemplar(res.data))
      .catch(() => mensagemErro("Erro ao carregar exemplar"));

    axios.get(obrasURL)
      .then(res => setObras(res.data))
      .catch(() => setObras([]));

    axios.get(secoesURL)
      .then(res => setSecoes(res.data))
      .catch(() => setSecoes([]));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExemplar({ ...exemplar, [name]: value });
  };

  const salvar = async () => {
    try {
      await axios.put(`${baseURL}/${id}`, exemplar);
      mensagemSucesso("Exemplar atualizado com sucesso!");
      navigate(`/perfil-exemplar/${id}`);
    } catch (error) {
      mensagemErro("Erro ao atualizar exemplar");
    }
  };

  const cancelar = () => {
    navigate(`/perfil-exemplar/${id}`);
  };

  return (
    <div className="container">
      <Card title="Editar Exemplar">
        <Stack spacing={2}>

          <TextField
            select
            label="Obra"
            name="idObra"
            value={exemplar.idObra}
            onChange={handleChange}
            fullWidth
          >
            {obras.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.titulo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Seção"
            name="idSecao"
            value={exemplar.idSecao}
            onChange={handleChange}
            fullWidth
          >
            {secoes.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nome}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            name="idStatus"
            value={exemplar.idStatus}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value={1}>Disponível</MenuItem>
            <MenuItem value={2}>Emprestado</MenuItem>
            <MenuItem value={2}>Extraviado</MenuItem>
          </TextField>

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

export default EdicaoExemplar;
