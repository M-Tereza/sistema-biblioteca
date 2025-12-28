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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { API_URLS } from "../config/axios";
import { formatarData } from "../utils/formatadores";

const baseURL = `${API_URLS.clientes}/clientes`;
const emprestimosURL = `${API_URLS.emprestimos}/emprestimos`;
const reservasURL = `${API_URLS.reservas}/reservas`;
const statusReservasURL = `${API_URLS.statusReservas}/statusReservas`;
const exemplaresURL = `${API_URLS.exemplares}/exemplares`;
const obrasURL = `${API_URLS.obras}/obras`;

function PerfilCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dados, setDados] = useState(null);
  const [dadosEmprestimos, setDadosEmprestimos] = useState([]);
  const [dadosReservas, setDadosReservas] = useState([]);
  const [dadosStatusReservas, setDadosStatusReservas] = useState([]);
  const [dadosExemplares, setDadosExemplares] = useState([]);
  const [dadosObras, setDadosObras] = useState([]);

  const [open, setOpen] = useState(false);

  const editar = () => navigate(`/edicao-cliente/${id}`);
  const voltar = () => navigate("/listagem-clientes");
  const adicionarEmprestimo = () => navigate(`/selecionar-obra/${id}`);
  const adicionarReserva = () => navigate(`/selecionar-obra/${id}?tipo=reserva`);

  const abrirConfirmacao = () => setOpen(true);
  const fecharConfirmacao = () => setOpen(false);

  const excluir = async () => {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso("Cliente excluído com sucesso!");
        navigate("/listagem-clientes");
      })
      .catch(() => {
        mensagemErro("Erro ao excluir cliente");
      })
      .finally(fecharConfirmacao);
  };

  const excluirReserva = async (reserva) => {
    if (!reserva) return;
    await axios
      .delete(`${reservasURL}/${reserva.id}`)
      .then(() => {
        mensagemSucesso("Reserva excluída com sucesso!");
        setDadosReservas(prev => prev.filter(r => r.id !== reserva.id));
      })
      .catch(() => {
        mensagemErro("Erro ao excluir reserva");
      });
  };

  useEffect(() => {
    async function carregar() {
      try {
        const responseCliente = await axios.get(`${baseURL}/${id}`);
        setDados(responseCliente.data);

        const responseEmprestimos = await axios.get(emprestimosURL);
        setDadosEmprestimos(responseEmprestimos.data.filter(e => e.idCliente === Number(id)));

        const responseReservas = await axios.get(reservasURL);
        setDadosReservas(responseReservas.data.filter(e => e.idCliente === Number(id)));

        const responseStatusReservas = await axios.get(statusReservasURL);
        setDadosStatusReservas(responseStatusReservas.data);

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

  const emprestimosAtivos = dadosEmprestimos.filter(e => !e.dataEntrega);
  const emprestimosFinalizados = dadosEmprestimos.filter(e => e.dataEntrega);

  const reservasAtivas = dadosReservas.filter(
    e => e.idStatus === 1 || e.idStatus === 3
  );

  const getObraPorId = (idObra) => dadosObras.find(o => o.id === idObra);
  const getTituloObra = (idObra) => getObraPorId(idObra)?.titulo ?? "Obra não encontrada";
  const getTituloObraPorIdExemplar = (idExemplar) => {
    const exemplar = dadosExemplares.find(e => e.id === idExemplar);
    if (!exemplar) return "Exemplar não encontrado";
    return getTituloObra(exemplar.idObra);
  };

  const nomeStatusReserva = (idStatus) => {
    const status = dadosStatusReservas.find(s => s.id === idStatus);
    return status ? status.nome : "Status não cadastrado";
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
        <table className="table table-bordered mb-2">
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

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={editar}>
            Editar Cliente
          </Button>

          <Button variant="contained" color="error" onClick={abrirConfirmacao}>
            Excluir Cliente
          </Button>
        </Stack>

        <div className="d-flex justify-content-center mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={adicionarEmprestimo}
            style={{ marginRight: "10px" }}
          >
            Adicionar Empréstimo
          </Button>
 
          <Button
            variant="contained"
            color="secondary"
            onClick={adicionarReserva}
          >
            Fazer Reserva
          </Button>
        </div>

        <h4>Reservas</h4>
        {reservasAtivas.length === 0 ? (
          <p>Nenhuma reserva ativa.</p>
        ) : (
          <table className="table table-striped mb-5">
            <thead>
              <tr>
                <th>Obra</th>
                <th>Data Reserva</th>
                <th>Posição na fila</th>
                <th>Prazo para retirada</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservasAtivas.map((e) => (
                <tr key={e.id}>
                  <td>{getTituloObra(e.idObra)}</td>
                  <td>{formatarData(e.dataReserva)}</td>
                  <td>{e.posicaoFila}</td>
                  <td>{formatarData(e.dataReserva)}</td>
                  <td>{nomeStatusReserva(e.idStatus)}</td>
                  <td>
                    <IconButton aria-label="delete" onClick={() => excluirReserva(e)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4>Empréstimos Ativos</h4>
        {emprestimosAtivos.length === 0 ? (
          <p>Nenhum empréstimo ativo.</p>
        ) : (
          <table className="table table-striped mb-5">
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
                  <td>{getTituloObraPorIdExemplar(e.idExemplar)}</td>
                  <td>{e.idExemplar}</td>
                  <td>{formatarData(e.dataEmprestimo)}</td>
                  <td>{formatarData(e.dataEntrega) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4 className="mt-4">Empréstimos Finalizados</h4>
        {emprestimosFinalizados.length === 0 ? (
          <p>Nenhum empréstimo finalizado.</p>
        ) : (
          <table className="table table-striped mb-5">
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
                  <td>{getTituloObraPorIdExemplar(e.idExemplar)}</td>
                  <td>{e.idExemplar}</td>
                  <td>{formatarData(e.dataEmprestimo)}</td>
                  <td>{formatarData(e.dataEntrega)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Dialog open={open} onClose={fecharConfirmacao}>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o cliente{" "}
              <strong>{dados.nome}</strong>?
              <br />
              Essa ação não poderá ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharConfirmacao}>Cancelar</Button>
            <Button onClick={excluir} color="error" variant="contained">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default PerfilCliente;
