import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';

import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const baseURL = `${API_URLS.multas}/multas`;

function ListagemMultas() {
  const navigate = useNavigate();

  const [dados, setDados] = React.useState([]);
  const [openExcluir, setOpenExcluir] = React.useState(false);
  const [multaSelecionada, setMultaSelecionada] = React.useState(null);

  const cadastrar = () => {
    navigate(`/cadastro-multa`);
  };

  const editar = (id) => {
    navigate(`/cadastro-multa/${id}`);
  };

  const abrirExcluir = (multa) => {
    setMultaSelecionada(multa);
    setOpenExcluir(true);
  };

  const fecharExcluir = () => {
    setOpenExcluir(false);
    setMultaSelecionada(null);
  };

  const excluir = async () => {
    if (!multaSelecionada) return;

    try {
      await axios.delete(`${baseURL}/${multaSelecionada.id}`);
      mensagemSucesso('Multa excluída com sucesso!');
      setDados(dados.filter(d => d.id !== multaSelecionada.id));
    } catch (error) {
      mensagemErro('Erro ao excluir a multa');
    } finally {
      fecharExcluir();
    }
  };

  React.useEffect(() => {
    axios.get(baseURL)
      .then(res => setDados(res.data))
      .catch(() => mensagemErro('Erro ao carregar multas'));
  }, []);

  if (!dados) return null;

  return (
    <div className="container">
      <Card title="Listagem de Multas">
        <div className="d-flex mb-3">
          <Button variant="contained" color="warning" onClick={cadastrar}>
            Alterar Valor da Multa
          </Button>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Data da Alteração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.length > 0 ? (
              dados.map(dado => (
                <tr key={dado.id}>
                  <td>{dado.valor}</td>
                  <td>{dado.dataAlteracao || "—"}</td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => editar(dado.id)} aria-label="editar">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => abrirExcluir(dado)} aria-label="excluir">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">Nenhuma multa cadastrada</td>
              </tr>
            )}
          </tbody>
        </table>

        <Dialog open={openExcluir} onClose={fecharExcluir}>
          <DialogTitle>Excluir Multa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a multa de valor R$<strong>{multaSelecionada?.valor}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharExcluir}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={excluir}>Excluir</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default ListagemMultas;
