import { FC, useEffect, useState } from 'react';
import { TxOutputLiquid } from '@script-wiz/lib-core';
import { VM } from '@script-wiz/lib';
import { Button } from 'rsuite';
import CloseIcon from '../../../Svg/Icons/Close';
import TransactionOutput from '../TransactionOutput/TransactionOutput';
import './TransactionOutputsContainer.scss';

type Props = {
  txOutputOnChange: (value: TxOutputLiquid, index: number) => void;
  txOutputsValue: TxOutputLiquid[];
  newTxOutputsOnChange: (value: TxOutputLiquid[]) => void; // when adding new tx outputs
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

const TransactionOutputsContainer: FC<Props> = ({ txOutputOnChange, txOutputsValue, newTxOutputsOnChange, vm }) => {
  const [txOutputs, setTxOutputs] = useState<TxOutputLiquid[]>([txOutputInitial]);

  useEffect(() => {
    setTxOutputs(txOutputsValue);
  }, [txOutputsValue]);

  return (
    <div className="tx-outputs">
      <div className="tx-outputs-container-main">
        <div className="tx-outputs-container">
          {txOutputs.map((output: TxOutputLiquid, index: number) => {
            const txOutput = { output, index };
            return (
              <div className="tx-outputs-container-box" key={index}>
                <div className="tx-outputs-header">
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
                </div>

                <TransactionOutput txOutputOnChange={txOutputOnChange} txOutput={txOutput} vm={vm} />
              </div>
            );
          })}
        </div>
      </div>
      <Button
        className="tx-outputs-container-button"
        onClick={() => {
          const newTxOutput = txOutputInitial;
          const newTxOutputs = [...txOutputs];

          newTxOutputs.push(newTxOutput);
          setTxOutputs(newTxOutputs);

          newTxOutputsOnChange(newTxOutputs);
        }}
      >
        + Add New Output
      </Button>
    </div>
  );
};

export default TransactionOutputsContainer;
