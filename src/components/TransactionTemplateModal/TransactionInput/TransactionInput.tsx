import React from 'react';
import { TxInput } from '@script-wiz/lib-core';
import { Input, Radio } from 'rsuite';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { validHex } from '../../../utils/helper';
import CloseIcon from '../../Svg/Icons/Close';
import './TransactionInput.scss';

type Props = {
  txInputOnChange: (input: TxInput, index: number, checked: boolean) => void;
  txInput: { input: TxInput; index: number; checked: boolean };
  removeInput: (index: number) => void;
};

const TransactionInput: React.FC<Props> = ({ txInputOnChange, txInput, removeInput }) => {
  const isValidPreviousTxId =
    (txInput.input.previousTxId.length !== 64 && txInput.input.previousTxId.length !== 0) || !validHex(txInput.input.previousTxId)
      ? TX_TEMPLATE_ERROR_MESSAGE.PREVIOUS_TX_ID_ERROR
      : '';

  const isValidVout = txInput.input.vout.length !== 8 && txInput.input.vout.length !== 0 ? TX_TEMPLATE_ERROR_MESSAGE.VOUT_ERROR : '';

  const isValidSequence =
    (txInput.input.sequence.length !== 8 && txInput.input.sequence.length !== 0) || !validHex(txInput.input.sequence)
      ? TX_TEMPLATE_ERROR_MESSAGE.SEQUENCE_ERROR
      : '';

  const isValidAmount =
    (txInput.input.amount.length !== 16 && txInput.input.amount.length !== 0) || !validHex(txInput.input.amount)
      ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
      : '';

  const isValidAssetId =
    (txInput.input.assetId?.length !== 64 && txInput.input.assetId?.length !== 0) || !validHex(txInput.input.assetId)
      ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR
      : '';

  return (
    <div className="tx-input-main">
      <div className="tx-input-header">
        <div className="tx-input-index">Index #{txInput.index}</div>
        <Radio
          onChange={(value: any, checked: boolean) => {
            txInputOnChange(txInput.input, txInput.index, checked);
          }}
          value={txInput.index}
          checked={txInput.checked}
        >
          Current Input Index
        </Radio>
        <div className="tx-input-close-icon" onClick={() => removeInput(txInput.index)}>
          <CloseIcon width="1rem" height="1rem" />
        </div>
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
              txInput.checked,
            );
          }}
        />
        <div className="tx-error-line">{isValidPreviousTxId}</div>
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
                txInput.checked,
              );
            }}
          />
          <div className="tx-error-line">{isValidVout}</div>
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
                txInput.checked,
              );
            }}
          />
          <div className="tx-error-line">{isValidSequence}</div>
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
              txInput.checked,
            );
          }}
        />
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">Amount (LE64):</div>
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
              txInput.checked,
            );
          }}
        />
        <div className="tx-error-line">{isValidAmount}</div>
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
              txInput.checked,
            );
          }}
        />
        <div className="tx-error-line">{isValidAssetId}</div>
      </div>
    </div>
  );
};

export default TransactionInput;
