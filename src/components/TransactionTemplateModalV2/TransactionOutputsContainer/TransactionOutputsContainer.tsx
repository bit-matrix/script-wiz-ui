import { FC } from 'react';
import { TxOutput } from '@script-wiz/lib-core';
import { Button } from 'rsuite';
import TransactionOutput from '../TransactionOutput/TransactionOutput';
import './TransactionOutputsContainer.scss';

const TransactionOutputsContainer: FC = () => {
  return (
    <div className="tx-outputs-container">
      <div className="tx-outputs-container-header">
        <p>Outputs</p>
      </div>

      <TransactionOutput txOutputOnChange={(value: TxOutput) => console.log(value)} />

      <Button className="tx-outputs-container-button" onClick={() => {}}>
        + Add New Output
      </Button>
    </div>
  );
};

export default TransactionOutputsContainer;
