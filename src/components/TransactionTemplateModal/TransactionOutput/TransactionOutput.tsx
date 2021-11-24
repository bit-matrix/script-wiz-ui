import React from 'react';
import { Input } from 'rsuite';
import './TransactionOutput.scss';

const TransactionOutput = () => {
  return (
    <div className="tx-output-main">
      <div className="tx-output-item">
        <div className="compile-modal-label">scriptPubkey:</div>
        <Input onChange={(value: string) => {}} />
      </div>
      <div className="tx-output-item">
        <div className="compile-modal-label">Amount:</div>
        <Input placeholder="8-bytes" onChange={(value: string) => {}} />
      </div>
      <div className="tx-output-item">
        <div className="compile-modal-label">Asset ID:</div>
        <Input placeholder="32-bytes" onChange={(value: string) => {}} />
      </div>
    </div>
  );
};

export default TransactionOutput;
