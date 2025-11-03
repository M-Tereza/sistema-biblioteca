import React from 'react';

import ListagemClientes from './views/listagem-clientes';
import ListagemExemplares from './views/listagem-exemplares';
import ListagemMultas from './views/listagem-multas';


import Login from './views/login';
import CadastroCliente from './views/cadastro-cliente';
import CadastroExemplar from './views/cadastro-exemplar';
import CadastroMulta from './views/cadastro-multa';


import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='/cadastro-cliente/:idParam?'
          element={<CadastroCliente />}
        />
        <Route
          path='/cadastro-exemplar/:idParam?'
          element={<CadastroExemplar />}
        />
        <Route
          path='/cadastro-multa/:idParam?'
          element={<CadastroMulta />}
        />

        <Route path='/listagem-clientes' element={<ListagemClientes />} />
        <Route path='/listagem-exemplares' element={<ListagemExemplares />} />
        <Route path='/listagem-multas' element={<ListagemMultas />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
