import { FC, useEffect, useState } from 'react';
import { TxInputLiquid } from '@script-wiz/lib-core';
import { VM } from '@script-wiz/lib';
import { Button, Radio } from 'rsuite';
import TransactionInput from '../TransactionInput/TransactionInput';
import CloseIcon from '../../Svg/Icons/Close';
import './TransactionInputsContainer.scss';

type Props = {
  lastBlock: any;
  version: string;
  blockHeight: string;
  blockTimestamp: string;
  txInputOnChange: (input: TxInputLiquid, index: number, checked: boolean) => void;
  txInputsValue: TxInputLiquid[];
  currentInputIndexOnChange: (value: number) => void;
  currentInputIndexValue: number;
  vm: VM;
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

const TransactionInputsContainer: FC<Props> = ({
  lastBlock,
  version,
  blockHeight,
  blockTimestamp,
  txInputOnChange,
  txInputsValue,
  currentInputIndexOnChange,
  currentInputIndexValue,
  vm,
}) => {
  const [txInputs, setTxInputs] = useState<TxInputLiquid[]>([txInputInitial]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);

  useEffect(() => {
    setTxInputs(txInputsValue);
    setCurrentInputIndex(currentInputIndexValue);
  }, [currentInputIndexValue, txInputsValue]);

  return (
    <div className="tx-inputs">
      <div className="tx-inputs-container-main">
        <div className="tx-inputs-container">
          {txInputs.map((input: TxInputLiquid, index: number) => {
            const txInput = { input, index, checked: currentInputIndex === index };
            return (
              <div className="tx-inputs-container-box" key={index}>
                <div className="tx-inputs-header">
                  <div className="tx-inputs-container-index">Index #{txInput.index}</div>

                  <Radio
                    onChange={(value: any, checked: boolean) => {
                      txInputOnChange(txInput.input, txInput.index, checked);
                      currentInputIndexOnChange(value);
                    }}
                    value={txInput.index}
                    checked={txInput.checked}
                  >
                    Current Input Index
                  </Radio>

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
                </div>

                <TransactionInput
                  lastBlock={lastBlock}
                  version={version}
                  blockHeight={blockHeight}
                  blockTimestamp={blockTimestamp}
                  txInputOnChange={txInputOnChange}
                  txInput={{ input: txInput.input, index: txInput.index, isCurrentInputIndex: txInput.checked }}
                  vm={vm}
                />
              </div>
            );
          })}
        </div>
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
