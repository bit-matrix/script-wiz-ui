import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from './ROUTE_PATH';
import { Helper } from '../pages/Helper/Helper';
import { Home } from '../pages/Home/Home';
import { SignatureTools } from '../pages/SignatureTools/SignatureTools';
import FourZeroFour from '../components/FourZeroFour';
import { Helmet } from 'react-helmet';
import logo192 from '../images/logo192.png';

export const AppRouter = (): JSX.Element => {
  const descriptionHome = 'Online Bitcoin Script Editor. Script Wizard makes it easy to design and compile custom Liquid scripts';
  return (
    <Router>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="icon" href={logo192} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={descriptionHome} />
        <meta name="author" content="https://www.linkedin.com/company/bitmatrix/" />
        <meta name="robots" content="nofollow, noindex" />
        <link rel="apple-touch-icon" href={logo192} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH7VQK0DKJ"></script>
        <link rel="manifest" crossOrigin="use-credentials" href="/manifest.json" />
        <title>Script Wiz</title>
      </Helmet>
      <Switch>
        <Route exact path={ROUTE_PATH.HOME} component={Home} />
        <Route exact path={ROUTE_PATH.HELPER} component={Helper} />
        <Route exact path={ROUTE_PATH.SIGNATURE_TOOLS} component={SignatureTools} />
        <Route exact path="*" component={FourZeroFour} />
      </Switch>
    </Router>
  );
};
