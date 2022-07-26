import { FC, useState } from 'react';
import { TxOutputLiquid } from '@script-wiz/lib-core';
import { Button } from 'rsuite';
import TransactionOutput from '../TransactionOutput/TransactionOutput';
import CloseIcon from '../../Svg/Icons/Close';
import './TransactionOutputsContainer.scss';

type Props = {
  txOutputOnChange: (value: TxOutputLiquid) => void;
  txOutputsValue: TxOutputLiquid[];
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
  assetommitment: '',
  valueCommitment: '',
  confidental: false,
};

const TransactionOutputsContainer: FC<Props> = ({ txOutputOnChange, txOutputsValue }) => {
  const [txOutputs, setTxOutputs] = useState<TxOutputLiquid[]>([txOutputInitial]);

  const outputValues = txOutputsValue ? txOutputsValue : txOutputs;

  return (
    <div className="tx-outputs-container">
      <div className="tx-outputs-container-header">
        <p>Outputs</p>
      </div>
      {outputValues.map((output: TxOutputLiquid, index: number) => {
        const txOutput = { output, index };
        return (
          <div className="tx-outputs-container-box">
            <div className="tx-outputs-container-index">Index #{txOutput.index}</div>

            <div
              className="tx-outputs-container-close-icon"
              onClick={() => {
                const newTxOutputs = [...txOutputs];
                if (txOutputs.length > 1) {
                  newTxOutputs.splice(txOutput.index, 1);
                  setTxOutputs(newTxOutputs);
                }
              }}
            >
              <CloseIcon width="1rem" height="1rem" />
            </div>

            <TransactionOutput txOutputOnChange={(value: TxOutputLiquid) => txOutputOnChange(value)} txOutput={txOutput} />
          </div>
        );
      })}

      <Button
        className="tx-outputs-container-button"
        onClick={() => {
          const newTxOutput = txOutputInitial;
          const newTxOutputs = [...txOutputs];
          newTxOutputs.push(newTxOutput);
          setTxOutputs(newTxOutputs);
        }}
      >
        + Add New Output
      </Button>
    </div>
  );
};

export default TransactionOutputsContainer;
