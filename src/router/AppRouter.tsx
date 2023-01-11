import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from './ROUTE_PATH';
import { Helper } from '../pages/Helper/Helper';
import { Home } from '../pages/Home/Home';
import { SignatureTools } from '../pages/SignatureTools/SignatureTools';
import { TapLeafCalculator } from '../pages/TapleafCalculator/TapLeafCalculator';
import { MastTool } from '../pages/MastTool/MastTool';
import { Sha256Midstate } from '../pages/Sha256d/Sha256Midstate';
import { EcCalculator } from '../pages/EcCalculator/EcCalculator';
import { BitCalculator } from '../pages/256BitCalculator/256BitCalculator';

export const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTE_PATH.HOME} component={Home} />
        <Route exact path={ROUTE_PATH.HELPER} component={Helper} />
        <Route exact path={ROUTE_PATH.SIGNATURE_TOOLS} component={SignatureTools} />
        <Route exact path={ROUTE_PATH.TAPLEAF_CALCULATOR} component={TapLeafCalculator} />
        <Route exact path={ROUTE_PATH.MAST_TOOL} component={MastTool} />
        <Route exact path={ROUTE_PATH.SHA256D} component={Sha256Midstate} />
        <Route exact path={ROUTE_PATH.EC_CALCULATOR} component={EcCalculator} />
        <Route exact path={ROUTE_PATH.CALCULATOR} component={BitCalculator} />
      </Switch>
    </Router>
  );
};
