import React from 'react';
import Helmet from 'react-helmet';

const ReactHelmet = () => {
  return (
      <div>
          <Helmet>
            <meta charset="utf-8" />
            <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta name="description" content="Script Wiz, Online Bitcoin Script Editor" />
            <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH7VQK0DKJ"></script>
            <link rel="manifest" crossorigin="use-credentials" href="%PUBLIC_URL%/manifest.json" />
            <title>Script Wiz</title>
          </Helmet>
      </div> 
  );
};

export default Helmet;
