import React from 'react';
import { Input } from 'rsuite';
import './TransactionInput.scss';

const TransactionInput = () => {
  return (
    <div className="tx-input-main">
      <p className="tx-input-index">Index #0</p>
      <div className="tx-input-modal-item">
        <div className="tx-modal-label">Previous TX ID:</div>
        <Input placeholder="32-bytes" onChange={(value: string) => {}} />
      </div>
      <div className="tx-input-item-double">
        <div className="tx-input-label">
          <div className="tx-input-item">Vout:</div>
          <Input placeholder="4-bytes" onChange={(value: string) => {}} />
        </div>
        <div className="tx-input-label">
          <div className="tx-input-item">Sequence:</div>
          <Input placeholder="4-bytes" onChange={(value: string) => {}} />
        </div>
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">scriptPubkey:</div>
        <Input onChange={(value: string) => {}} />
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">Amount:</div>
        <Input placeholder="8-bytes" onChange={(value: string) => {}} />
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">Asset ID:</div>
        <Input placeholder="32-bytes" onChange={(value: string) => {}} />
      </div>
    </div>
  );
};

export default TransactionInput;
