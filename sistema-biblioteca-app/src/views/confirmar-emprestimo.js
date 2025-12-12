import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/card";
import Button from "@mui/material/Button";
import axios from "axios";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import { API_URLS } from "../config/axios";

const emprestimosURL = `${API_URLS.emprestimo}/emprestimo`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;
const obrasURL = `${API_URLS.obras}/obras`;
const autoresURL = `${API_URLS.autores}/autores`;
const editorasURL = `${API_URLS.editoras}/editoras`;

function ConfirmarEmprestimo() {
  const navigate = useNavigate();
  const { idCliente, idExemplar } = useParams();

  const [exemplar, setExemplar] = useState(null);
  const [obra, setObra] = useState(null);
  const [autor, setAutor] = useState(null);
  const [editora, setEditora] = useState(null);

  useEffect(() => {
    async function carregar() {
      const exResponse = await axios.get(`${exemplaresURL}/${idExemplar}`);
      const ex = exResponse.data;
      setExemplar(ex);

      const obraResponse = await axios.get(`${obrasURL}/${ex.idObra}`);
      const obraData = obraResponse.data;
      setObra(obraData);

      const autorResponse = await axios.get(`${autoresURL}/${obraData.idAutor}`);
      setAutor(autorResponse.data);

      const editoraResponse = await axios.get(`${editorasURL}/${obraData.idEditora}`);
      setEditora(editoraResponse.data);
    }

    carregar();
  }, [idExemplar]);

  if (!exemplar || !obra || !autor || !editora) return <p>Carregando...</p>;

  async function confirmar() {
    const payload = {
      idCliente,
      idExemplar,
      dataEmprestimo: new Date().toISOString().split("T")[0],
      dataDevolucao: null,
    };

    try {
      await axios.post(emprestimosURL, payload);
      mensagemSucesso("Empréstimo registrado com sucesso!");
      navigate(`/perfil-cliente/${idCliente}`);
    } catch (err) {
      mensagemErro("Erro ao registrar o empréstimo");
    }
  }

  return (
    <div className="container">
      <Card title="Confirmar Empréstimo">

        <h4>Dados do Exemplar</h4>
        <table className="table table-bordered mb-4">
          <tbody>
            <tr><th>Código</th><td>{exemplar.id}</td></tr>
            <tr><th>Título</th><td>{obra.titulo}</td></tr>
            <tr><th>Autor</th><td>{autor.nome}</td></tr>
            <tr><th>Editora</th><td>{editora.nome}</td></tr>
          </tbody>
        </table>

        <div className="d-flex justify-content-end">
          <Button
            variant="contained"
            color="success"
            onClick={confirmar}
          >
            Confirmar Empréstimo
          </Button>
        </div>

      </Card>
    </div>
  );
}

export default ConfirmarEmprestimo;
