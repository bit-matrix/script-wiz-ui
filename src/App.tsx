/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { AppRouter } from './router/AppRouter';
import 'react-mosaic-component/react-mosaic-component.css';
import './Appstyle.scss';
import { ScriptWiz, VM } from '@script-wiz/lib';

type Props = {
  vm: VM;
  scriptWiz?: ScriptWiz;
  setVm: (vm: VM) => void;
};

const App: React.FC<Props> = ({ vm, scriptWiz, setVm }): JSX.Element => {
  return <AppRouter scriptWiz={scriptWiz} vm={vm} setVm={setVm} />;
};

export default App;
