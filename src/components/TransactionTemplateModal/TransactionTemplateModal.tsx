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
  const [txInputs, setTxInputs] = useState<TxInput[]>([]);
  const [txOutputs, setTxOutputs] = useState<TxOutput[]>([]);
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
              <TransactionInput />
              <Button className="tx-template-button" onClick={() => {}}>
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
