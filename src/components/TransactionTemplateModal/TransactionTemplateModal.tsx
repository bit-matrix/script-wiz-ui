import React from 'react';
import { Button, Modal } from 'rsuite';
import './TransactionTemplateModal.scss';

type Props = {
  modalData: { show: boolean; data?: string };
  showModal: (show: boolean) => void;
};

const TransactionTemplateModal: React.FC<Props> = ({ modalData, showModal }) => {
  return (
    <Modal size="lg" show={modalData.show} backdrop={false} onHide={() => showModal(false)}>
      <Modal.Header />
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button onClick={() => showModal(false)} appearance="primary">
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
