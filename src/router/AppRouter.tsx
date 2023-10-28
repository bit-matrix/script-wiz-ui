import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <Routes>
        <Route path={ROUTE_PATH.HOME} element={<Home />} />
        <Route path={ROUTE_PATH.HELPER} element={<Helper />} />
        <Route path={ROUTE_PATH.SIGNATURE_TOOLS} element={<SignatureTools />} />
        <Route path={ROUTE_PATH.TAPLEAF_CALCULATOR} element={<TapLeafCalculator />} />
        <Route path={ROUTE_PATH.MAST_TOOL} element={<MastTool />} />
        <Route path={ROUTE_PATH.SHA256D} element={<Sha256Midstate />} />
        <Route path={ROUTE_PATH.EC_CALCULATOR} element={<EcCalculator />} />
        <Route path={ROUTE_PATH.CALCULATOR} element={<BitCalculator />} />
      </Routes>
    </Router>
  );
};
