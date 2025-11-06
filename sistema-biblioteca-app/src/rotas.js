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


// import CadastroCliente from './views/cadastro-clientes';
// import CadastroObra from './views/cadastro-obras';
// import CadastroExemplar from './views/cadastro-exemplares';
// import CadastroMulta from './views/cadastro-multas';
// import CadastroGenero from './views/cadastro-generos';
import CadastroIdioma from './views/cadastro-idioma';
import CadastroSecoes from './views/cadastro-secoes';
// import CadastroAutor from './views/cadastro-autores';
// import CadastroEditora from './views/cadastro-editoras';


import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path='/cadastro-clientes/:idParam?'
          element={<CadastroCliente />}
        />
        <Route
          path='/cadastro-obras/:idParam?'
          element={<CadastroObra />}
        />
        <Route
          path='/cadastro-exemplares/:idParam?'
          element={<CadastroExemplar />}
        />
        <Route
          path='/cadastro-multas/:idParam?'
          element={<CadastroMulta />}
        />
        <Route
          path='/cadastro-generos/:idParam?'
          element={<CadastroGenero />
        /> */}
        <Route
          path='/cadastro-idioma/:idParam?'
          element={<CadastroIdioma />}
        />
        <Route
          path='/cadastro-secoes/:idParam?'
          element={<CadastroSecoes />}
        />
        {/* <Route
          path='/cadastro-autores/:idParam?'
          element={<CadastroAutor />}
        />
        <Route
          path='/cadastro-editoras/:idParam?'
          element={<CadastroEditora />}
        /> */}

        <Route path='/listagem-clientes' element={<ListagemClientes />} />
        <Route path='/listagem-obras' element={<ListagemObras />} />
        <Route path='/listagem-exemplares' element={<ListagemExemplares />} />
        <Route path='/listagem-multas' element={<ListagemMultas />} />
        <Route path='/listagem-generos' element={<ListagemGeneros />} />
        <Route path='/listagem-idiomas' element={<ListagemIdiomas />} />
        <Route path='/listagem-secoes' element={<ListagemSecoes />} />
        <Route path='/listagem-autores' element={<ListagemAutores />} />
        <Route path='/listagem-editoras' element={<ListagemEditoras />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
