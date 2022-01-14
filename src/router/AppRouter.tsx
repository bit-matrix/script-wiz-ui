import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from './ROUTE_PATH';
import { Helper } from '../pages/Helper/Helper';
import { Home } from '../pages/Home/Home';
import { SignatureTools } from '../pages/SignatureTools/SignatureTools';
import FourZeroFour from '../components/FourZeroFour';
import { Helmet } from 'react-helmet';

export const AppRouter = (): JSX.Element => {
  const description = 'Online Bitcoin Script Editor. Script Wizard makes it easy to design and compile custom Liquid scripts';

  return (
    <Router>
      <Switch>
        <Helmet>
          <meta charSet="utf-8" />
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content={description} />
          <meta name="author" content="https://www.linkedin.com/company/bitmatrix/" />
          <meta name="robots" content="nofollow, noindex" />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH7VQK0DKJ"></script>
          <link rel="manifest" crossOrigin="use-credentials" href="%PUBLIC_URL%/manifest.json" />
          <title>Script Wiz</title>
          <Route exact path={ROUTE_PATH.HOME} component={Home} />
        </Helmet>
        <Helmet>
          <Route exact path={ROUTE_PATH.HELPER} component={Helper} />
        </Helmet>
        <Helmet>
          <Route exact path={ROUTE_PATH.SIGNATURE_TOOLS} component={SignatureTools} />
        </Helmet>
        <Helmet>
          <Route exact path="*" component={FourZeroFour} />
        </Helmet>
      </Switch>
    </Router>
  );
};
