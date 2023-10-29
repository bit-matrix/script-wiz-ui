import React from 'react';
import { createRoot } from 'react-dom/client';
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

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

// Disabling strict mode to avoid uncaught promise with Monaco: https://github.com/suren-atoyan/monaco-react/issues/440
root.render(
  // <React.StrictMode>
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  // </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(co  nsole.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
