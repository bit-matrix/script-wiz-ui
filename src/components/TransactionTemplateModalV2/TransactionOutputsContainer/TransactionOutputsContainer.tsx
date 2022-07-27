import { FC, useEffect, useState } from 'react';
import { TxOutputLiquid } from '@script-wiz/lib-core';
import { VM } from '@script-wiz/lib';
import { Button } from 'rsuite';
import TransactionOutput from '../TransactionOutput/TransactionOutput';
import CloseIcon from '../../Svg/Icons/Close';
import './TransactionOutputsContainer.scss';

type Props = {
  txOutputOnChange: (value: TxOutputLiquid) => void;
  txOutputsValue: TxOutputLiquid[];
  vm: VM;
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
  assetommitment: '',
  valueCommitment: '',
  confidental: false,
};

const TransactionOutputsContainer: FC<Props> = ({ txOutputOnChange, txOutputsValue, vm }) => {
  const [txOutputs, setTxOutputs] = useState<TxOutputLiquid[]>([txOutputInitial]);

  const txOutputsOnChange = (output: TxOutputLiquid, index: number) => {
    const newTxOutputs = [...txOutputs];
    const relatedOutputIndex = txOutputs.findIndex((output, i) => i === index);
    const newOutput = {
      scriptPubKey: output.scriptPubKey,
      amount: output.amount,
      assetId: output.assetId,
      assetCommitment: output.assetCommitment,
      valueCommitment: output.valueCommitment,
      confidental: output.confidental,
    };

    newTxOutputs[relatedOutputIndex] = newOutput;
    setTxOutputs(newTxOutputs);
  };

  useEffect(() => {
    setTxOutputs(txOutputsValue);
  }, [txOutputsValue]);

  return (
    <div className="tx-outputs-container-main">
      <div className="tx-outputs-container-header">
        <p>Outputs</p>
      </div>

      <div className="tx-outputs-container">
        {txOutputs.map((output: TxOutputLiquid, index: number) => {
          const txOutput = { output, index };
          return (
            <div className="tx-outputs-container-box" key={index}>
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

              <TransactionOutput txOutputOnChange={txOutputsOnChange} txOutput={txOutput} vm={vm} />
            </div>
          );
        })}
      </div>
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
