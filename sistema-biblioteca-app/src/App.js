import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
import 'toastr/build/toastr.min.css';
import 'toastr/build/toastr.css';
import Navbar from './components/navbar';
import Rotas from './rotas';

class App extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <Rotas />
        </div>
      </>
    );
  }
}

export default App;
