import React, { useState, useEffect } from "react";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";
import 'toastr/build/toastr.min.css';

import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBack';

import axios from "axios";
import { API_URLS } from "../config/axios";
import {formatarData} from "../utils/formatadores.js"

const baseURL = `${API_URLS.clientes}/clientes`;
const emprestimosURL = `${API_URLS.emprestimos}/emprestimos`;
const exemplaresURL = `${API_URLS.clientes}/exemplares`;
const obrasURL = `${API_URLS.obras}/obras`;

function PerfilCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dados, setDado] = React.useState(null);
  const [dadosEmprestimos, setDadosEmprestimos] = React.useState([]);
  const [dadosExemplares, setDadosExemplares] = React.useState([]);
  const [dadosObras, setDadosObras] = React.useState([]);

  const editar = () => {
    navigate(`/cadastro-cliente/${id}`);
  };

  async function excluir() {
    try {
      await axios.delete(`${baseURL}/${id}`);
      mensagemSucesso("Cliente excluído com sucesso!");
      navigate("/listagem-clientes");
    } catch (error) {
      mensagemErro("Erro ao excluir o cliente");
    }
  }

  const voltar = () => {
    navigate("/listagem-clientes");
  };

  const adicionarEmprestimo = () => {
    navigate(`/selecionar-obra/${id}`);
  };


  React.useEffect(() => {
    async function carregar() {
      try {
        const responseCliente = await axios.get(`${baseURL}/${id}`);
        setDado(responseCliente.data);

        const responseEmprestimos = await axios.get(emprestimosURL);
        setDadosEmprestimos(
          responseEmprestimos.data.filter((e) => e.idCliente === Number(id))
        );

        const responseExemplares = await axios.get(exemplaresURL);
        setDadosExemplares(responseExemplares.data);

        const responseObras = await axios.get(obrasURL);
        setDadosObras(responseObras.data);
      } catch (error) {
        mensagemErro("Erro ao carregar dados do cliente");
      }
    }

    carregar();
  }, [id]);

  if (!dados) return null;

  const emprestimosAtivos = dadosEmprestimos.filter((e) => !e.dataEntrega);
  const emprestimosFinalizados = dadosEmprestimos.filter((e) => e.dataEntrega);

  const getTituloObra = (idExemplar) => {
    const obra = dadosExemplares.find((x) => x.id === idExemplar);
    const ex = dadosObras.find((x) => x.id === obra.id);
    return ex ? `${ex.titulo}` : "Obra não encontrada";
  };

  return (
    <div className="container">

      <Card title={
        <Stack direction="row" spacing={1} alignItems="left">
          <IconButton aria-label="voltar" onClick={voltar}>
            <ArrowBackIosIcon />
          </IconButton>
          <span>Perfil do Cliente</span>
        </Stack>
      }>

        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="contained"
            color="primary"
            onClick={adicionarEmprestimo}
          >
            Adicionar Empréstimo
          </Button>
        </div>

        <table className="table table-bordered mb-5">
          <tbody>
            <tr><th>Nome</th><td>{dados.nome}</td></tr>
            <tr><th>CPF</th><td>{dados.cpf}</td></tr>
            <tr><th>Data de Nascimento</th><td>{dados.dataNascimento}</td></tr>
            <tr><th>Email</th><td>{dados.email}</td></tr>
            <tr><th>Telefone</th><td>{dados.telefone}</td></tr>
            <tr><th>CEP</th><td>{dados.cep}</td></tr>
            <tr><th>Logradouro</th><td>{dados.logradouro}</td></tr>
            <tr><th>Número</th><td>{dados.numero}</td></tr>
            <tr><th>Complemento</th><td>{dados.complemento}</td></tr>
            <tr><th>Bairro</th><td>{dados.bairro}</td></tr>
            <tr><th>Cidade</th><td>{dados.cidade}</td></tr>
            <tr><th>Estado</th><td>{dados.estado}</td></tr>
          </tbody>
        </table>

        <Stack spacing={1} padding={0} direction='row' justifyContent="flex-end">
          <IconButton aria-label='edit' onClick={() => editar(dados.id)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label='delete' onClick={() => excluir(dados.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>

        <h4>Empréstimos Ativos</h4>
        {emprestimosAtivos.length === 0 ? (
          <p>Nenhum empréstimo ativo.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Obra</th>
                <th>Código do Exemplar</th>
                <th>Data Empréstimo</th>
                <th>Data Prevista Devolução</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosAtivos.map((e) => (
                <tr key={e.id}>
                  <td>{getTituloObra(e.idExemplar)}</td>
                  <td>{e.idExemplar}</td>
                  <td>{formatarData(e.dataEmprestimo)}</td>
                  <td>{formatarData(e.dataEntrega) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4 className="mt-4">Histórico de Empréstimos</h4>
        {emprestimosFinalizados.length === 0 ? (
          <p>Nenhum empréstimo finalizado.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Obra</th>
                <th>Código do Exemplar</th>
                <th>Data Empréstimo</th>
                <th>Data Devolução</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosFinalizados.map((e) => (
                <tr key={e.id}>
                  <td>{getTituloObra(e.idExemplar)}</td>
                  <td>{e.idExemplar}</td>
                  <td>{formatarData(e.dataEmprestimo)}</td>
                  <td>{formatarData(e.dataEntrega)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </Card>
    </div>
  );
}

export default PerfilCliente;
