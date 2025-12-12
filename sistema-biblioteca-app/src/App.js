import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'toastr/build/toastr.min.css';
import Navbar from './components/navbar';
import Rotas from './rotas';

class App extends React.Component {
  render() {
    return (
      <div className='container'>
        <Navbar />
        <Rotas />
      </div>
    );
  }
}

export default App;
