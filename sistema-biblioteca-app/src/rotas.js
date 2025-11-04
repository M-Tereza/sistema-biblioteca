import React from 'react';

import ListagemClientes from './views/listagem-clientes';
import ListagemExemplares from './views/listagem-exemplares';
import ListagemMultas from './views/listagem-multas';
import ListagemObras from './views/listagem-obras';


import CadastroCliente from './views/cadastro-cliente';
import CadastroObra from './views/cadastro-obra';
import CadastroExemplar from './views/cadastro-exemplar';
import CadastroMulta from './views/cadastro-multa';


import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/cadastro-cliente/:idParam?'
          element={<CadastroCliente />}
        />
        <Route
          path='/cadastro-obra/:idParam?'
          element={<CadastroObra />}
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
         <Route path='/listagem-obras' element={<ListagemObras />} />
        <Route path='/listagem-exemplares' element={<ListagemExemplares />} />
        <Route path='/listagem-multas' element={<ListagemMultas />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
