import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from './ROUTE_PATH';
import { Helper } from '../components/Helper/Helper';
import { Home } from '../pages/Home';

export const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTE_PATH.HOME} component={Home} />
        <Route exact path={ROUTE_PATH.HELPER} component={Helper} />
      </Switch>
    </Router>
  );
};
