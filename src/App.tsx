/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { AppRouter } from './router/AppRouter';
import 'react-mosaic-component/react-mosaic-component.css';
import './App.scss';

type Props = {
  extension?: any;
};

const App: React.FC<Props> = ({ extension }): JSX.Element => {
  return <AppRouter extension={extension} />;
};

export default App;
