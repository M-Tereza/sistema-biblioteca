import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/navbar';
import Rotas from './rotas';

const theme = createTheme({
  palette: {
    primary: { main: '#4caf50' },   // verde
    secondary: { main: '#ff9800' }, // laranja
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='container'>
          <Navbar />
          <Rotas />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
