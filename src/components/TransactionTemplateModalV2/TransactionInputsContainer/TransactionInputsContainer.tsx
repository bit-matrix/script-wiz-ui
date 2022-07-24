import { FC } from 'react';
import { TxInput } from '@script-wiz/lib-core';
import { Button } from 'rsuite';
import TransactionInput from '../TransactionInput/TransactionInput';
import './TransactionInputsContainer.scss';

type Props = {
  lastBlock: any;
  version: string;
};

const TransactionInputsContainer: FC<Props> = ({ lastBlock, version }) => {
  return (
    <div className="tx-inputs-container">
      <div className="tx-inputs-container-header">
        <p>Inputs</p>
      </div>

      <TransactionInput lastBlock={lastBlock} version={version} txInputOnChange={(value: TxInput) => console.log(value)} />

      <Button className="tx-inputs-container-button" onClick={() => {}}>
        + Add New Input
      </Button>
    </div>
  );
};

export default TransactionInputsContainer;
