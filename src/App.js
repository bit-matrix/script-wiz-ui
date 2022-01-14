/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { AppRouter } from './router/AppRouter';
import { Helmet } from 'react-helmet';
import './App.scss';

const App = () => {
  const description = "Online Bitcoin Script Editor. Script Wizard makes it easy to design and compile custom Liquid scripts";
  return (
    <div>
      <Helmet>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />           
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={description} />
        <meta name="author" content="https://www.linkedin.com/company/bitmatrix/" />
        <meta name="robots" content="nofollow, noindex" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH7VQK0DKJ"></script>
        <link rel="manifest" crossorigin="use-credentials" href="%PUBLIC_URL%/manifest.json" />
        <title>Script Wiz</title>
      </Helmet>
      <AppRouter />
    </div>
  );
};

export default App;
