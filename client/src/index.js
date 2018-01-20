import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from 'material-ui-next/styles';

const theme = createMuiTheme({
    palette: { 
    }
  });

let WrappedApp = () => (
    <MuiThemeProvider theme={theme}>
       
            <App />
      
    </MuiThemeProvider>
);

ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
