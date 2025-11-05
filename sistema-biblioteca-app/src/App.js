import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
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
