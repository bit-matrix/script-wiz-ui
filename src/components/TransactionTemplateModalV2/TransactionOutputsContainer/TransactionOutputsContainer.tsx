import { FC } from 'react';
import { TxOutput } from '@script-wiz/lib-core';
import { Button } from 'rsuite';
import TransactionOutput from '../TransactionOutput/TransactionOutput';
import './TransactionOutputsContainer.scss';

type Props = {
  txOutputOnChange: (value: TxOutput) => void;
};

const TransactionOutputsContainer: FC<Props> = ({ txOutputOnChange }) => {
  return (
    <div className="tx-outputs-container">
      <div className="tx-outputs-container-header">
        <p>Outputs</p>
      </div>

      <TransactionOutput txOutputOnChange={(value: TxOutput) => txOutputOnChange(value)} />

      <Button className="tx-outputs-container-button" onClick={() => {}}>
        + Add New Output
      </Button>
    </div>
  );
};

export default TransactionOutputsContainer;
