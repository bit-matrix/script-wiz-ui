import React from 'react';
import { TxOutput } from '@script-wiz/lib';
import { Icon, IconButton, Input } from 'rsuite';
import './TransactionOutput.scss';

type Props = {
  txOutputOnChange: (output: TxOutput, index: number) => void;
  txOutput: { output: TxOutput; index: number };
  removeOutput: (index: number) => void;
};

const TransactionOutput: React.FC<Props> = ({ txOutputOnChange, txOutput, removeOutput }) => {
  return (
    <div className="tx-output-main">
      <div className="tx-output-header">
        <p className="tx-output-index">Index #{txOutput.index}</p>
        <IconButton className="tx-output-close-icon" icon={<Icon icon="close" />} size="sm" onClick={() => removeOutput(txOutput.index)} />
      </div>
      <div className="tx-output-item">
        <div className="tx-modal-label">scriptPubkey:</div>
        <Input
          value={txOutput.output.scriptPubKey}
          onChange={(value: string) => {
            txOutputOnChange(
              {
                scriptPubKey: value,
                amount: txOutput.output.amount,
                assetId: txOutput.output.assetId,
              },
              txOutput.index,
            );
          }}
        />
      </div>
      <div className="tx-output-item">
        <div className="tx-modal-label">Amount:</div>
        <Input
          value={txOutput.output.amount}
          placeholder="8-bytes"
          onChange={(value: string) => {
            txOutputOnChange(
              {
                scriptPubKey: txOutput.output.scriptPubKey,
                amount: value,
                assetId: txOutput.output.assetId,
              },
              txOutput.index,
            );
          }}
        />
      </div>
      <div className="tx-output-item">
        <div className="tx-modal-label">Asset ID:</div>
        <Input
          value={txOutput.output.assetId}
          placeholder="32-bytes"
          onChange={(value: string) => {
            txOutputOnChange(
              {
                scriptPubKey: txOutput.output.scriptPubKey,
                amount: txOutput.output.amount,
                assetId: value,
              },
              txOutput.index,
            );
          }}
        />
      </div>
    </div>
  );
};

export default TransactionOutput;
