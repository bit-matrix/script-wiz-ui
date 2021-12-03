import React, { useState } from 'react';
import { TxData, TxInput, TxOutput } from '@script-wiz/lib';
import { Button, Input, Modal } from 'rsuite';
import TransactionInput from './TransactionInput/TransactionInput';
import TransactionOutput from './TransactionOutput/TransactionOutput';
import './TransactionTemplateModal.scss';

type Props = {
  showModal: boolean;
  showModalCallBack: (show: boolean) => void;
  txDataCallBack: (txData: TxData) => void;
};

const TransactionTemplateModal: React.FC<Props> = ({ showModal, showModalCallBack, txDataCallBack }) => {
  const txInputInitial = {
    previousTxId: '',
    vout: '',
    sequence: '',
    scriptPubKey: '',
    amount: '',
    assetId: '',
  };

  const txOutputInitial = {
    scriptPubKey: '',
    amount: '',
    assetId: '',
  };

  const [txInputs, setTxInputs] = useState<TxInput[]>([txInputInitial]);
  const [txOutputs, setTxOutputs] = useState<TxOutput[]>([txOutputInitial]);
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimeLock] = useState<string>('');
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);

  const txInputOnChange = (input: TxInput, index: number, checked: boolean) => {
    const newTxInputs = [...txInputs];
    const relatedInputIndex = txInputs.findIndex((input, i) => i === index);
    const newInput = {
      previousTxId: input.previousTxId,
      vout: input.vout,
      sequence: input.sequence,
      scriptPubKey: input.scriptPubKey,
      amount: input.amount,
      assetId: input.assetId,
    };
    newTxInputs[relatedInputIndex] = newInput;
    if (checked) setCurrentInputIndex(index);
    setTxInputs(newTxInputs);
  };

  const txOutputOnChange = (output: TxOutput, index: number) => {
    const newTxOutputs = [...txOutputs];
    const relatedOutputIndex = txOutputs.findIndex((output, i) => i === index);
    const newOutput = {
      scriptPubKey: output.scriptPubKey,
      amount: output.amount,
      assetId: output.assetId,
    };
    newTxOutputs[relatedOutputIndex] = newOutput;
    setTxOutputs(newTxOutputs);
  };

  return (
    <Modal
      className="tx-template-modal"
      size="lg"
      show={showModal}
      backdrop={false}
      onHide={() => {
        setTxInputs([txInputInitial]);
        setTxOutputs([txOutputInitial]);
        setVersion('');
        setTimeLock('');
        showModalCallBack(false);
      }}
    >
      <Modal.Header className="tx-template-modal-header" />
      <Modal.Body>
        <div>
          <div className="tx-template-header">
            <p>Inputs</p>
            <p>Outputs</p>
          </div>
          <div className="tx-template-main">
            <div className="tx-inputs">
              {txInputs.map((input: TxInput, index: number) => {
                const txInput = { input, index, checked: currentInputIndex === index };
                return (
                  <TransactionInput
                    key={index}
                    txInput={txInput}
                    txInputOnChange={txInputOnChange}
                    removeInput={(index: number) => {
                      const newTxInputs = [...txInputs];
                      if (txInputs.length > 1) {
                        newTxInputs.splice(index, 1);
                        setTxInputs(newTxInputs);
                      }
                    }}
                  />
                );
              })}
              <Button
                className="tx-template-button"
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
            <div className="vertical-line"></div>
            <div className="tx-outputs">
              {txOutputs.map((output: TxOutput, index: number) => {
                const txOutput = { output, index };
                return (
                  <TransactionOutput
                    key={index}
                    txOutput={txOutput}
                    txOutputOnChange={txOutputOnChange}
                    removeOutput={(index: number) => {
                      const newTxOutputs = [...txOutputs];
                      if (txOutputs.length > 1) {
                        newTxOutputs.splice(index, 1);
                        setTxOutputs(newTxOutputs);
                      }
                    }}
                  />
                );
              })}
              <Button
                className="tx-template-button"
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
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="tx-template-modal-footer">
          <div className="tx-item">
            <div className="tx-modal-label">Tx Version:</div>
            <Input value={version} placeholder="4-bytes" onChange={(value: string) => setVersion(value)} />
          </div>
          <div className="tx-item">
            <div className="tx-modal-label">Tx Timelock:</div>
            <Input
              value={timelock}
              placeholder="4-bytes"
              onChange={(value: string) => {
                setTimeLock(value);
              }}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            const txData: TxData = {
              inputs: txInputs,
              outputs: txOutputs,
              version: version,
              timelock: timelock,
              currentInputIndex,
            };
            txDataCallBack(txData);
            showModalCallBack(false);
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
