import React from "react";

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

const baseURL = `${API_URLS.clientes}/clientes`;
const emprestimosURL = `${API_URLS.exemplares}/emprestimo`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;

function PerfilCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dado, setDado] = React.useState(null);
  const [emprestimos, setEmprestimos] = React.useState([]);
  const [exemplares, setExemplares] = React.useState([]);

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
        setEmprestimos(
          responseEmprestimos.data.filter((e) => e.idCliente === id)
        );

        const responseExemplares = await axios.get(exemplaresURL);
        setExemplares(responseExemplares.data);
      } catch (error) {
        mensagemErro("Erro ao carregar os dados do cliente");
      }
    }

    carregar();
  }, [id]);

  if (!dado) return null;

  const emprestimosAtivos = emprestimos.filter((e) => !e.dataDevolucao);
  const emprestimosFinalizados = emprestimos.filter((e) => e.dataDevolucao);

  const getExemplarNome = (idExemplar) => {
    const ex = exemplares.find((x) => x.id === idExemplar);
    return ex ? `Exemplar ${ex.id} da obra ${ex.idObra}` : "Exemplar não encontrado";
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
            <tr><th>Nome</th><td>{dado.nome}</td></tr>
            <tr><th>CPF</th><td>{dado.cpf}</td></tr>
            <tr><th>Data de Nascimento</th><td>{dado.dataNascimento}</td></tr>
            <tr><th>Email</th><td>{dado.email}</td></tr>
            <tr><th>Telefone</th><td>{dado.telefone}</td></tr>
            <tr><th>CEP</th><td>{dado.cep}</td></tr>
            <tr><th>Logradouro</th><td>{dado.logradouro}</td></tr>
            <tr><th>Número</th><td>{dado.numero}</td></tr>
            <tr><th>Complemento</th><td>{dado.complemento}</td></tr>
            <tr><th>Bairro</th><td>{dado.bairro}</td></tr>
            <tr><th>Cidade</th><td>{dado.cidade}</td></tr>
            <tr><th>Estado</th><td>{dado.estado}</td></tr>
          </tbody>
        </table>

        <Stack spacing={1} padding={0} direction='row' justifyContent="flex-end">
          <IconButton aria-label='edit' onClick={() => editar(dado.id)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label='delete' onClick={() => excluir(dado.id)}>
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
                <th>Exemplar</th>
                <th>Data Empréstimo</th>
                <th>Data Prevista Devolução</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosAtivos.map((e) => (
                <tr key={e.id}>
                  <td>{getExemplarNome(e.idExemplar)}</td>
                  <td>{e.dataEmprestimo}</td>
                  <td>{e.dataDevolucao || "—"}</td>
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
                <th>Exemplar</th>
                <th>Data Empréstimo</th>
                <th>Data Devolução</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosFinalizados.map((e) => (
                <tr key={e.id}>
                  <td>{getExemplarNome(e.idExemplar)}</td>
                  <td>{e.dataEmprestimo}</td>
                  <td>{e.dataDevolucao}</td>
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
