import React from "react";

import Card from "../components/card";
import "../custom.css";

import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axios from "../config/axios";
import { API_URLS } from "../config/axios";

const obrasURL = `${API_URLS.obras}/obras`;
const editorasURL = `${API_URLS.editoras}/editoras`;

function ListagemObras() {
  const navigate = useNavigate();

  const [obras, setObras] = React.useState([]);
  const [editoras, setEditoras] = React.useState({});
  const [termoBusca, setTermoBusca] = React.useState("");
  const [termoDebounce, setTermoDebounce] = React.useState("");

  const cadastrar = () => {
    navigate("/cadastro-obra");
  };

  const visualizar = (id) => {
    navigate(`/perfil-obra/${id}`);
  };

  React.useEffect(() => {
    axios.get(obrasURL).then((response) => {
      setObras(response.data || []);
    });

    axios.get(editorasURL).then((response) => {
      const mapa = {};
      response.data.forEach((e) => {
        mapa[e.id] = e.nome;
      });
      setEditoras(mapa);
    });
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setTermoDebounce(termoBusca);
    }, 300);

    return () => clearTimeout(timeout);
  }, [termoBusca]);

  const obrasFiltradas = obras.filter((obra) => {
    const termo = termoDebounce.toLowerCase();

    return (
      String(obra.titulo || "")
        .toLowerCase()
        .includes(termo) ||
      String(obra.isbn || "").includes(termo) ||
      String(obra.edicao || "").includes(termo)
    );
  });

  return (
    <div className="container">
      <Card title="Listagem de Obras">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <div className="d-flex gap-3 mb-3">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={cadastrar}
                >
                  Nova Obra
                </button>

                <TextField
                  label="Pesquisar obra"
                  size="small"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>ISBN</th>
                    <th>Edição</th>
                    <th>Editora</th>
                    <th>Ver Obra</th>
                  </tr>
                </thead>

                <tbody>
                  {obrasFiltradas.length > 0 ? (
                    obrasFiltradas.map((obra) => (
                      <tr key={obra.id}>
                        <td>{obra.titulo}</td>
                        <td>{obra.isbn}</td>
                        <td>{obra.edicao}</td>
                        <td>
                          {editoras[obra.idEditora] || "Editora não cadastrada"}
                        </td>
                        <td>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              aria-label="visualizar"
                              onClick={() => visualizar(obra.id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Stack>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Nenhuma obra encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemObras;
