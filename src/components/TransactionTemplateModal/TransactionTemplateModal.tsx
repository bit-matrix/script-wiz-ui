import React, { useState } from 'react';
import { Button, Input, Modal } from 'rsuite';
import TransactionInput from './TransactionInput/TransactionInput';
import TransactionOutput from './TransactionOutput/TransactionOutput';
import './TransactionTemplateModal.scss';

type TxInput = {
  previousTxId: string;
  vout: string;
  sequence: string;
  scriptPubKey: string;
  amount: string;
  assetId?: string;
};

type TxOutput = {
  scriptPubKey: string;
  amount: string;
  assetId?: string;
};

type Props = {
  showModal: boolean;
  showModalCallBack: (show: boolean) => void;
};

const TransactionTemplateModal: React.FC<Props> = ({ showModal, showModalCallBack }) => {
  const [txInputs, setTxInputs] = useState<TxInput[]>([
    {
      previousTxId: '',
      vout: '',
      sequence: '',
      scriptPubKey: '',
      amount: '',
      assetId: '',
    },
  ]);
  const [txOutputs, setTxOutputs] = useState<TxOutput[]>([]);

  const txInputOnChange = (input: TxInput, index: number) => {
    const newTxInputs = [...txInputs];
    const relatedInput = txInputs.findIndex((input, i) => i === index);
    const newInput = {
      previousTxId: input.previousTxId,
      vout: input.vout,
      sequence: input.sequence,
      scriptPubKey: input.scriptPubKey,
      amount: input.amount,
      assetId: input.assetId,
    };
    newTxInputs[relatedInput] = newInput;
    setTxInputs(newTxInputs);
  };

  return (
    <Modal className="tx-template-modal" size="lg" show={showModal} backdrop={false} onHide={() => showModalCallBack(false)}>
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
                const txInput = { input, index };
                return (
                  <TransactionInput
                    txInput={txInput}
                    txInputOnChange={txInputOnChange}
                    removeInput={(index: number) => {
                      const newTxInputs = [...txInputs];
                      newTxInputs.splice(index, 1);
                      setTxInputs(newTxInputs);
                    }}
                  />
                );
              })}
              <Button
                className="tx-template-button"
                onClick={() => {
                  const newTxInput = {
                    previousTxId: '',
                    vout: '',
                    sequence: '',
                    scriptPubKey: '',
                    amount: '',
                    assetId: '',
                  };
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
              <TransactionOutput />
              <Button className="tx-template-button" onClick={() => {}}>
                + Add New Output
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="tx-template-modal-footer">
        <div className="tx-item">
          <div className="tx-modal-label">Tx Version:</div>
          <Input placeholder="4-bytes" onChange={(value: string) => {}} />
        </div>
        <div className="tx-item">
          <div className="tx-modal-label">Tx Timelock:</div>
          <Input placeholder="4-bytes" onChange={(value: string) => {}} />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
