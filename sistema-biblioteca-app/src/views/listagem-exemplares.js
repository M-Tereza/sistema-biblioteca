// import React from "react";

// import Card from "../components/card";
// import { mensagemSucesso, mensagemErro } from "../components/toastr";

// import "../custom.css";
// import { useNavigate } from "react-router-dom";

// import Stack from "@mui/material/Stack";
// import { IconButton, Button } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";

// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";

// import axios from "../config/axios";
// import { API_URLS } from "../config/axios";

// const baseURL = `${API_URLS.exemplares}/exemplares`;

// function ListagemExemplares() {
//   const navigate = useNavigate();

//   const [dados, setDados] = React.useState(null);
//   const [open, setOpen] = React.useState(false);
//   const [exemplarSelecionado, setExemplarSelecionado] = React.useState(null);

//   const cadastrar = () => {
//     navigate("/cadastro-exemplar");
//   };

//   const editar = (id) => {
//     navigate(`/cadastro-exemplar/${id}`);
//   };

//   const abrirConfirmacao = (exemplar) => {
//     setExemplarSelecionado(exemplar);
//     setOpen(true);
//   };

//   const fecharConfirmacao = () => {
//     setOpen(false);
//     setExemplarSelecionado(null);
//   };

//   async function excluir() {
//     if (!exemplarSelecionado) return;

//     let url = `${baseURL}/${exemplarSelecionado.id}`;

//     await axios
//       .delete(url, {
//         headers: { "Content-Type": "application/json" },
//       })
//       .then(() => {
//         mensagemSucesso("Exemplar excluído com sucesso!");
//         setDados(
//           dados.filter(
//             (dado) => dado.id !== exemplarSelecionado.id
//           )
//         );
//         fecharConfirmacao();
//       })
//       .catch(() => {
//         mensagemErro("Erro ao excluir o exemplar");
//         fecharConfirmacao();
//       });
//   }

//   React.useEffect(() => {
//     axios.get(baseURL).then((response) => {
//       setDados(response.data);
//     });
//   }, []);

//   if (!dados) return null;

//   return (
//     <div className="container">
//       <Card title="Listagem de Exemplares">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="bs-component">
//               <button
//                 type="button"
//                 className="btn btn-warning"
//                 onClick={cadastrar}
//               >
//                 Novo Exemplar
//               </button>

//               <table className="table table-hover mt-3">
//                 <thead>
//                   <tr>
//                     <th scope="col">Código</th>
//                     <th scope="col">Data de Aquisição</th>
//                     <th scope="col">Seção</th>
//                     <th scope="col">Status</th>
//                     <th scope="col">Ações</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {dados.map((dado) => (
//                     <tr key={dado.id}>
//                       <td>{dado.id}</td>
//                       <td>{dado.dataAquisicao}</td>
//                       <td>{dado.idSecao}</td>
//                       <td>{dado.idStatus}</td>
//                       <td>
//                         <Stack spacing={1} direction="row">
//                           <IconButton
//                             aria-label="edit"
//                             onClick={() => editar(dado.id)}
//                           >
//                             <EditIcon />
//                           </IconButton>

//                           <IconButton
//                             aria-label="delete"
//                             onClick={() => abrirConfirmacao(dado)}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </Stack>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <Dialog open={open} onClose={fecharConfirmacao}>
//           <DialogTitle>Confirmar exclusão</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Tem certeza que deseja excluir o exemplar{" "}
//               <strong>#{exemplarSelecionado?.id}</strong>?
//               <br />
//               Essa ação não poderá ser desfeita.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={fecharConfirmacao} color="inherit">
//               Cancelar
//             </Button>
//             <Button
//               onClick={excluir}
//               color="error"
//               variant="contained"
//             >
//               Excluir
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Card>
//     </div>
//   );
// }

// export default ListagemExemplares;
