import React, { useState } from 'react';
import { Button, Modal } from 'rsuite';
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
    <Modal size="lg" show={showModal} backdrop={false} onHide={() => showModalCallBack(false)}>
      <Modal.Header />
      <Modal.Body>
        <div>
          <div className="transaction-template-header">
            <p>Inputs</p>
            <p>Outputs</p>
          </div>
          <div className="transaction-template-main">
            <div className="transaction-inputs">a</div>
            <div className="vertical-line"></div>
            <div className="transaction-outputs">b</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => showModalCallBack(false)} appearance="primary">
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
