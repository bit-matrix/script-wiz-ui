import React from 'react';
import { TxInput } from '@script-wiz/lib';
import { Icon, IconButton, Input } from 'rsuite';
import './TransactionInput.scss';

type Props = {
  txInputOnChange: (input: TxInput, index: number) => void;
  txInput: { input: TxInput; index: number };
  removeInput: (index: number) => void;
};

const TransactionInput: React.FC<Props> = ({ txInputOnChange, txInput, removeInput }) => {
  return (
    <div className="tx-input-main">
      <div className="tx-input-header">
        <p className="tx-input-index">Index #{txInput.index}</p>
        <IconButton className="tx-input-close-icon" icon={<Icon icon="close" />} size="sm" onClick={() => removeInput(txInput.index)} />
      </div>
      <div className="tx-input-modal-item">
        <div className="tx-modal-label">Previous TX ID:</div>
        <Input
          value={txInput.input.previousTxId}
          placeholder="32-bytes"
          onChange={(value: string) => {
            txInputOnChange(
              {
                previousTxId: value,
                vout: txInput.input.vout,
                sequence: txInput.input.sequence,
                scriptPubKey: txInput.input.scriptPubKey,
                amount: txInput.input.amount,
                assetId: txInput.input.assetId,
              },
              txInput.index,
            );
          }}
        />
      </div>
      <div className="tx-input-item-double">
        <div className="tx-input-label">
          <div className="tx-input-item">Vout:</div>
          <Input
            value={txInput.input.vout}
            placeholder="4-bytes"
            onChange={(value: string) => {
              txInputOnChange(
                {
                  previousTxId: txInput.input.previousTxId,
                  vout: value,
                  sequence: txInput.input.sequence,
                  scriptPubKey: txInput.input.scriptPubKey,
                  amount: txInput.input.amount,
                  assetId: txInput.input.assetId,
                },
                txInput.index,
              );
            }}
          />
        </div>
        <div className="tx-input-label">
          <div className="tx-input-item">Sequence:</div>
          <Input
            value={txInput.input.sequence}
            placeholder="4-bytes"
            onChange={(value: string) => {
              txInputOnChange(
                {
                  previousTxId: txInput.input.previousTxId,
                  vout: txInput.input.vout,
                  sequence: value,
                  scriptPubKey: txInput.input.scriptPubKey,
                  amount: txInput.input.amount,
                  assetId: txInput.input.assetId,
                },
                txInput.index,
              );
            }}
          />
        </div>
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">scriptPubkey:</div>
        <Input
          value={txInput.input.scriptPubKey}
          onChange={(value: string) => {
            txInputOnChange(
              {
                previousTxId: txInput.input.previousTxId,
                vout: txInput.input.vout,
                sequence: txInput.input.sequence,
                scriptPubKey: value,
                amount: txInput.input.amount,
                assetId: txInput.input.assetId,
              },
              txInput.index,
            );
          }}
        />
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">Amount:</div>
        <Input
          value={txInput.input.amount}
          placeholder="8-bytes"
          onChange={(value: string) => {
            txInputOnChange(
              {
                previousTxId: txInput.input.previousTxId,
                vout: txInput.input.vout,
                sequence: txInput.input.sequence,
                scriptPubKey: txInput.input.scriptPubKey,
                amount: value,
                assetId: txInput.input.assetId,
              },
              txInput.index,
            );
          }}
        />
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">Asset ID:</div>
        <Input
          value={txInput.input.assetId}
          placeholder="32-bytes"
          onChange={(value: string) => {
            txInputOnChange(
              {
                previousTxId: txInput.input.previousTxId,
                vout: txInput.input.vout,
                sequence: txInput.input.sequence,
                scriptPubKey: txInput.input.scriptPubKey,
                amount: txInput.input.amount,
                assetId: value,
              },
              txInput.index,
            );
          }}
        />
      </div>
    </div>
  );
};

export default TransactionInput;
