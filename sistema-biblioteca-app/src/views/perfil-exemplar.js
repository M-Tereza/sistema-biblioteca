import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import { Button, Stack, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";
import { formatarData } from "../utils/formatadores";

const exemplaresURL = `${API_URLS.exemplares}/exemplares`;
const obrasURL = `${API_URLS.obras}/obras`;
const secoesURL = `${API_URLS.secoes}/secoes`;
const clientesURL = `${API_URLS.clientes}/clientes`;
const emprestimosURL = `${API_URLS.emprestimos}/emprestimos`;

function PerfilExemplar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exemplar, setExemplar] = useState(null);
  const [obra, setObra] = useState(null);
  const [secao, setSecao] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);

  const [openExcluir, setOpenExcluir] = useState(false);

  useEffect(() => {
    axios.get(`${exemplaresURL}/${id}`)
      .then((res) => setExemplar(res.data))
      .catch(() => mensagemErro("Erro ao carregar exemplar"));

    axios.get(secoesURL)
      .then((res) => setSecao(res.data))
      .catch(() => setSecao([]));

    axios.get(obrasURL)
      .then((res) => setObra(res.data))
      .catch(() => setObra(null));

    axios.get(clientesURL)
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]));
  }, [id]);


  useEffect(() => {
    if (!exemplar) return;

    axios.get(emprestimosURL)
      .then((res) => {
        const filtrados = res.data.filter(e => e.idExemplar === exemplar.id);
        setEmprestimos(filtrados);
      })
      .catch(() => setEmprestimos([]));
  }, [exemplar]);

  const nomeObra = () => {
    if (!obra || !exemplar) return "Obra não encontrada";
    const o = obra.find((o) => o.id === exemplar.idObra);
    return o ? o.titulo : "Obra não encontrada";
  };

  const nomeSecao = () => {
    if (!secao || !exemplar) return "Seção não informada";
    const s = secao.find((s) => s.id === exemplar.idSecao);
    return s ? s.nome : "Seção não informada";
  };

  const nomeCliente = (idCliente) => {
    const c = clientes.find((c) => c.id === idCliente);
    return c ? c.nome : "Cliente não encontrado";
  };

  const statusExemplar = () => {
    if (!exemplar) return "Indefinido";
    if (exemplar.idStatus === 1) return "Disponível";
    if (exemplar.idStatus === 2) return "Emprestado";
    return "Indefinido";
  };

  const excluir = async () => {
    if (!exemplar) return;
    try {
      await axios.delete(`${exemplaresURL}/${exemplar.id}`);
      mensagemSucesso("Exemplar excluído com sucesso!");
      navigate(-1);
    } catch {
      mensagemErro("Erro ao excluir exemplar");
    } finally {
      setOpenExcluir(false);
    }
  };

  const editar = () => {
    navigate(`/edicao-exemplar/${exemplar.id}`);
  };

  const voltar = () => navigate(-1);

  if (!exemplar) return null;

  const emprestimosAtivos = emprestimos.filter((e) => !e.dataEntrega);
  const emprestimosFinalizados = emprestimos.filter((e) => e.dataEntrega);

  return (
    <div className="container">
      <Card
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={voltar}>
              <ArrowBackIosIcon />
            </IconButton>
            <span>Perfil do Exemplar</span>
          </Stack>
        }
      >
        <table className="table table-bordered mb-2">
          <tbody>
            <tr><th>Código</th><td>{exemplar.id}</td></tr>
            <tr><th>Status</th><td>{statusExemplar()}</td></tr>
            <tr><th>Seção</th><td>{nomeSecao()}</td></tr>
            <tr><th>Obra</th><td>{nomeObra()}</td></tr>
          </tbody>
        </table>

        <Stack spacing={1} direction="row" justifyContent="flex-end" className="mb-4">
          <IconButton onClick={editar}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setOpenExcluir(true)}>
            <DeleteIcon />
          </IconButton>
        </Stack>

        <h4>Histórico de Clientes</h4>
        {emprestimosAtivos.length + emprestimosFinalizados.length === 0 ? (
          <p>Nenhum cliente realizou empréstimo deste exemplar.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data Empréstimo</th>
                <th>Data Devolução</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosAtivos.map((e) => (
                <tr key={e.id}>
                  <td>{nomeCliente(e.idCliente)}</td>
                  <td>{formatarData(e.dataEmprestimo)}</td>
                  <td>—</td>
                </tr>
              ))}
              {emprestimosFinalizados.map((e) => (
                <tr key={e.id}>
                  <td>{nomeCliente(e.idCliente)}</td>
                  <td>{formatarData(e.dataEmprestimo)}</td>
                  <td>{formatarData(e.dataEntrega)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Dialog open={openExcluir} onClose={() => setOpenExcluir(false)}>
          <DialogTitle>Excluir Exemplar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o exemplar de código <strong>{exemplar.id}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExcluir(false)}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={excluir}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default PerfilExemplar;
