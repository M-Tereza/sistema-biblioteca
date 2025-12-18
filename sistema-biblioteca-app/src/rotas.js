import React from 'react';

import ListagemClientes from './views/listagem-clientes';
import ListagemExemplares from './views/listagem-exemplares';
import ListagemMultas from './views/listagem-multas';
import ListagemObras from './views/listagem-obras';
import ListagemGeneros from './views/listagem-generos';
import ListagemIdiomas from './views/listagem-idiomas';
import ListagemSecoes from './views/listagem-secoes';
import ListagemAutores from './views/listagem-autores';
import ListagemEditoras from './views/listagem-editoras';
import ListagemEmprestimos from './views/listagem-emprestimos';

import CadastroCliente from './views/cadastro-cliente';
import CadastroObra from './views/cadastro-obra';
import CadastroExemplar from './views/cadastro-exemplar';
import CadastroMulta from './views/cadastro-multa';
import CadastroGenero from './views/cadastro-genero';
import CadastroSecao from './views/cadastro-secao';
import CadastroIdioma from './views/cadastro-idioma';
import CadastroAutor from './views/cadastro-autor';
import CadastroEditora from './views/cadastro-editora';

import PerfilCliente from './views/perfil-cliente';
import PerfilObra from './views/perfil-obra';
import PerfilExemplar from './views/perfil-exemplar';

import SelecionarExemplar from './views/selecionar-exemplar';
import SelecionarObra from './views/selecionar-obra';
import ConfirmarEmprestimo from "./views/confirmar-emprestimo";

import EdicaoCliente from './views/edicao-cliente';


import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/cadastro-cliente/:idParam?' element={<CadastroCliente />} />
        <Route path='/cadastro-obra/:idParam?' element={<CadastroObra />} />
        <Route path='/cadastro-exemplar/:idParam?' element={<CadastroExemplar />} />
        <Route path='/cadastro-multa/:idParam?' element={<CadastroMulta />} />
        <Route path='/cadastro-genero/:idParam?' element={<CadastroGenero />} />
        <Route path='/cadastro-idioma/:idParam?' element={<CadastroIdioma />} />
        <Route path='/cadastro-secao/:idParam?' element={<CadastroSecao />} />
        <Route path='/cadastro-autor/:idParam?' element={<CadastroAutor />} />
        <Route path='/cadastro-editora/:idParam?'element={<CadastroEditora />}/>


        <Route path='/listagem-clientes' element={<ListagemClientes />} />
        <Route path='/listagem-obras' element={<ListagemObras />} />
        <Route path='/listagem-exemplares' element={<ListagemExemplares />} />
        <Route path='/listagem-multas' element={<ListagemMultas />} />
        <Route path='/listagem-generos' element={<ListagemGeneros />} />
        <Route path='/listagem-idiomas' element={<ListagemIdiomas />} />
        <Route path='/listagem-secoes' element={<ListagemSecoes />} />
        <Route path='/listagem-autores' element={<ListagemAutores />} />
        <Route path='/listagem-editoras' element={<ListagemEditoras />} />
        <Route path='/listagem-emprestimos' element={<ListagemEmprestimos />} />

        <Route path='/perfil-cliente/:id' element={<PerfilCliente />} />
        <Route path="/perfil-obra/:id" element={<PerfilObra />} />
        <Route path="/perfil-exemplar/:id" element={<PerfilExemplar />} />


        <Route path="/selecionar-exemplar/:idCliente/:idObra" element={<SelecionarExemplar />} />
        <Route path='/selecionar-obra/:idCliente' element={<SelecionarObra />} />
        <Route path="/confirmar-emprestimo/:idCliente/:idObra/:idExemplar" element={<ConfirmarEmprestimo />} />

        <Route path="/edicao-cliente/:id" element={<EdicaoCliente />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
