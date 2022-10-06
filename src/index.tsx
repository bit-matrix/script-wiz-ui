import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { CustomProvider } from 'rsuite';
import { ScriptWiz, VM } from '@script-wiz/lib';
import App from './App';

declare global {
  interface Window {
    vm: VM;
    scriptWiz?: ScriptWiz;
    setVm: (vm: VM) => void;
  }
}

const vm = window.vm;
const scriptWiz = JSON.parse(window.scriptWiz) as unknown as ScriptWiz;
const setVm = window.setVm;

console.log('scriptwiz', scriptWiz);

ReactDOM.hydrate(
  <React.StrictMode>
    <CustomProvider theme="dark">
      <App setVm={setVm} vm={vm} scriptWiz={scriptWiz} />
    </CustomProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
