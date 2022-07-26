import { FC, useState } from 'react';
import { TxInputLiquid } from '@script-wiz/lib-core';
import { Button, Radio } from 'rsuite';
import TransactionInput from '../TransactionInput/TransactionInput';
import CloseIcon from '../../Svg/Icons/Close';
import './TransactionInputsContainer.scss';

type Props = {
  lastBlock: any;
  version: string;
  blockHeight: string;
  blockTimestamp: string;
  txInputOnChange: (value: any) => void;
  txInputsValue: TxInputLiquid[];
};

const txInputInitial = {
  previousTxId: '',
  vout: '',
  sequence: '',
  scriptPubKey: '',
  amount: '',
  assetId: '',
  blockHeight: '',
  blockTimestamp: '',
  confidental: false,
};

const TransactionInputsContainer: FC<Props> = ({ lastBlock, version, blockHeight, blockTimestamp, txInputOnChange, txInputsValue }) => {
  const [txInputs, setTxInputs] = useState<TxInputLiquid[]>([txInputInitial]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);

  const inputValues = txInputsValue ? txInputsValue : txInputs;

  const txInputsOnChange = (input: TxInputLiquid, index: number, isCurrentInputIndex: boolean) => {
    setTxInputs(txInputsValue);
    const newTxInputs = [...txInputs];
    const relatedInputIndex = txInputs.findIndex((input, i) => i === index);

    const newInput = {
      previousTxId: input.previousTxId,
      vout: input.vout,
      sequence: input.sequence,
      scriptPubKey: input.scriptPubKey,
      amount: input.amount,
      assetId: input.assetId,
      confidental: input.confidental,
    };

    newTxInputs[relatedInputIndex] = newInput;
    setTxInputs(newTxInputs);

    if (isCurrentInputIndex) setCurrentInputIndex(index);
  };

  return (
    <div className="tx-inputs-container-main">
      <div className="tx-inputs-container-header">
        <p>Inputs</p>
      </div>
      <div className="tx-inputs-container">
        {inputValues.map((input: TxInputLiquid, index: number) => {
          const txInput = { input, index, checked: currentInputIndex === index };
          return (
            <div className="tx-inputs-container-box" key={index}>
              <div className="tx-inputs-container-index">Index #{txInput.index}</div>

              <div
                className="tx-inputs-container-close-icon "
                onClick={() => {
                  const newTxInputs = [...txInputs];
                  if (txInputs.length > 1) {
                    newTxInputs.splice(txInput.index, 1);
                    setTxInputs(newTxInputs);
                  }
                }}
              >
                <CloseIcon width="1rem" height="1rem" />
              </div>

              <Radio
                onChange={(value: any, checked: boolean) => {
                  txInputsOnChange(txInput.input, txInput.index, checked);
                }}
                value={txInput.index}
                checked={txInput.checked}
              >
                Current Input Index
              </Radio>

              <TransactionInput
                lastBlock={lastBlock}
                version={version}
                blockHeight={blockHeight}
                blockTimestamp={blockTimestamp}
                txInputOnChange={txInputsOnChange}
                txInput={{ input: txInput.input, index: txInput.index, isCurrentInputIndex: txInput.checked }}
              />
            </div>
          );
        })}
      </div>
      <Button
        className="tx-inputs-container-button"
        onClick={() => {
          const newTxInput = txInputInitial;
          const newTxInputs = [...txInputs];
          newTxInputs.push(newTxInput);
          setTxInputs(newTxInputs);
        }}
      >
        + Add New Input
      </Button>
    </div>
  );
};

export default TransactionInputsContainer;
