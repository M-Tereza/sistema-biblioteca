import React, { useState, useEffect } from "react";

import Card from "../components/card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";
import "toastr/build/toastr.min.css";

import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS}/clientes`;

function PerfilCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dados, setDados] = useState(null);
  const [open, setOpen] = useState(false);

  const editar = () => navigate(`/edicao-cliente/${id}`);
  const voltar = () => navigate("/listagem-clientes");

  const adicionarEmprestimo = () =>
    navigate(`/selecionar-obra/${id}`);

  const adicionarReserva = () =>
    navigate(`/selecionar-obra/${id}?tipo=reserva`);

  const abrirConfirmacao = () => setOpen(true);
  const fecharConfirmacao = () => setOpen(false);

  const formatarData = (data) => {
    if (!data) return "—";

    const valor = data.includes("T")
      ? data.split("T")[0]
      : data;

    const [ano, mes, dia] = valor.split("-");

    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return "—";

    const [data, hora] = dataHora.split("T");
    const [ano, mes, dia] = data.split("-");
    const [h, m] = hora.split(":");

    return `${dia}/${mes}/${ano} ${h}:${m}`;
  };

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
      .delete(`${API_URLS}/reservas/${reserva.id}`)
      .then(() => {
        mensagemSucesso("Reserva excluída com sucesso!");

        setDados((prev) => ({
          ...prev,
          reservas: prev.reservas.filter(
            (r) => r.id !== reserva.id
          ),
        }));
      })
      .catch(() => {
        mensagemErro("Erro ao excluir reserva");
      });
  };

  useEffect(() => {
    async function carregar() {
      try {
        const response = await axios.get(
          `${baseURL}/${id}`
        );

        setDados(response.data);
      } catch {
        mensagemErro(
          "Erro ao carregar dados do cliente"
        );
      }
    }

    carregar();
  }, [id]);

  if (!dados) return null;

  const emprestimos = dados.emprestimos || [];
  const reservas = dados.reservas || [];

  const emprestimosAtivos = emprestimos.filter(
    (e) => !e.dataHoraEntrega
  );

  const emprestimosFinalizados = emprestimos.filter(
    (e) => e.dataHoraEntrega
  );

  const reservasAtivas = reservas.filter(
    (e) =>
      e.idStatusReserva === 1 ||
      e.idStatusReserva === 3
  );

  return (
    <div className="container">
      <Card
        title={
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <IconButton
              aria-label="voltar"
              onClick={voltar}
            >
              <ArrowBackIosIcon />
            </IconButton>

            <span>Perfil do Cliente</span>
          </Stack>
        }
      >
        <table className="table table-bordered mb-2">
          <tbody>
            <tr>
              <th>Nome</th>
              <td>{dados.nome}</td>
            </tr>

            <tr>
              <th>CPF</th>
              <td>{dados.cpf}</td>
            </tr>

            <tr>
              <th>Data de Nascimento</th>
              <td>
                {formatarData(
                  dados.dataNascimento
                )}
              </td>
            </tr>

            <tr>
              <th>Email</th>
              <td>{dados.email}</td>
            </tr>

            <tr>
              <th>Telefone</th>
              <td>{dados.telefone}</td>
            </tr>

            <tr>
              <th>CEP</th>
              <td>{dados.cep}</td>
            </tr>

            <tr>
              <th>Logradouro</th>
              <td>{dados.logradouro}</td>
            </tr>

            <tr>
              <th>Número</th>
              <td>{dados.numero}</td>
            </tr>

            <tr>
              <th>Complemento</th>
              <td>{dados.complemento}</td>
            </tr>

            <tr>
              <th>Bairro</th>
              <td>{dados.bairro}</td>
            </tr>

            <tr>
              <th>Cidade</th>
              <td>{dados.cidade}</td>
            </tr>

            <tr>
              <th>Estado</th>
              <td>{dados.estado}</td>
            </tr>
          </tbody>
        </table>

        <Stack
          direction="row"
          spacing={2}
          mt={3}
        >
          <Button
            variant="contained"
            onClick={editar}
          >
            Editar Cliente
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={abrirConfirmacao}
          >
            Excluir Cliente
          </Button>
        </Stack>

        <div className="d-flex justify-content-center mb-4 mt-4">
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
                  <td>{e.tituloObra}</td>

                  <td>
                    {formatarDataHora(
                      e.dataHoraReserva
                    )}
                  </td>

                  <td>{e.posicaoFila}</td>

                  <td>
                    {formatarData(
                      e.dataMaximaPrevistaColeta
                    )}
                  </td>

                  <td>
                    {e.nomeStatusReserva}
                  </td>

                  <td>
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        excluirReserva(e)
                      }
                    >
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
                <th>Exemplar</th>
                <th>Data Empréstimo</th>
                <th>Data Prevista Devolução</th>
                <th>Multa Atual</th>
              </tr>
            </thead>

            <tbody>
              {emprestimosAtivos.map((e) => (
                <tr key={e.id}>
                  <td>{e.tituloObra}</td>

                  <td>{e.idExemplar}</td>

                  <td>
                    {formatarDataHora(
                      e.dataHoraEmprestimo
                    )}
                  </td>

                  <td>
                    {formatarData(
                      e.dataPrevistaDevolucao
                    )}
                  </td>

                  <td>
                    R$ {Number(
                      e.multa || 0
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4 className="mt-4">
          Empréstimos Finalizados
        </h4>

        {emprestimosFinalizados.length === 0 ? (
          <p>
            Nenhum empréstimo finalizado.
          </p>
        ) : (
          <table className="table table-striped mb-5">
            <thead>
              <tr>
                <th>Obra</th>
                <th>Exemplar</th>
                <th>Data Empréstimo</th>
                <th>Data Entrega</th>
                <th>Multa</th>
              </tr>
            </thead>

            <tbody>
              {emprestimosFinalizados.map((e) => (
                <tr key={e.id}>
                  <td>{e.tituloObra}</td>

                  <td>{e.idExemplar}</td>

                  <td>
                    {formatarDataHora(
                      e.dataHoraEmprestimo
                    )}
                  </td>

                  <td>
                    {formatarDataHora(
                      e.dataHoraEntrega
                    )}
                  </td>

                  <td>
                    R$ {Number(
                      e.multa || 0
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Dialog
          open={open}
          onClose={fecharConfirmacao}
        >
          <DialogTitle>
            Confirmar exclusão
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir
              o cliente{" "}
              <strong>{dados.nome}</strong>?
              <br />
              Essa ação não poderá ser
              desfeita.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={fecharConfirmacao}
            >
              Cancelar
            </Button>

            <Button
              onClick={excluir}
              color="error"
              variant="contained"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default PerfilCliente;
