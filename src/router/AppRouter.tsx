import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from './ROUTE_PATH';
import { Helper } from '../pages/Helper/Helper';
import { Home } from '../pages/Home/Home';
import { SignatureTools } from '../pages/SignatureTools/SignatureTools';
import { TapLeafCalculator } from '../pages/TapleafCalculator/TapLeafCalculator';
import { MastTool } from '../pages/MastTool/MastTool';
import { Sha256Midstate } from '../pages/Sha256d/Sha256Midstate';
import { ScriptWiz, VM } from '@script-wiz/lib';

type Props = {
  vm: VM;
  scriptWiz?: ScriptWiz;
  setVm: (vm: VM) => void;
};

export const AppRouter: React.FC<Props> = ({ scriptWiz, vm, setVm }): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTE_PATH.HOME}>
          <Home scriptWiz={scriptWiz} vm={vm} setVm={setVm} />
        </Route>
        <Route exact path={ROUTE_PATH.HELPER} component={Helper} />
        <Route exact path={ROUTE_PATH.SIGNATURE_TOOLS} component={SignatureTools} />
        <Route exact path={ROUTE_PATH.TAPLEAF_CALCULATOR} component={TapLeafCalculator} />
        <Route exact path={ROUTE_PATH.MAST_TOOL} component={MastTool} />
        <Route exact path={ROUTE_PATH.SHA256D} component={Sha256Midstate} />
      </Switch>
    </Router>
  );
};
