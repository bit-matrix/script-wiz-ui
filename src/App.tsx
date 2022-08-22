/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { AppRouter } from './router/AppRouter';
import 'react-mosaic-component/react-mosaic-component.css';
import './App.scss';

type Props = {
  extension?: any;
  ff?: any;
};

const App: React.FC<Props> = ({ extension, ff }): JSX.Element => {
  console.log('ff:', ff);
  return <AppRouter extension={extension} />;
};

export default App;
