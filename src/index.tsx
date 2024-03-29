import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import "rsuite/dist/styles/rsuite-dark.css";
import { CustomProvider } from 'rsuite';

declare global {
  interface Window {
    secret: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
