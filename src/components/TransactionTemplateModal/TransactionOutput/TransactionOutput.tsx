import React from 'react';
import { TxOutput } from '@script-wiz/lib-core';
import { Input } from 'rsuite';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { validHex } from '../../../utils/helper';
import { CloseIcon } from '../../Svg/Icons/Close';
import { VM, VM_NETWORK } from '@script-wiz/lib';
import './TransactionOutputstyle.scss';

type Props = {
  txOutput: { output: TxOutput; index: number };
  vm: VM;
  txOutputOnChange: (output: TxOutput, index: number) => void;
  removeOutput: (index: number) => void;
};

export const TransactionOutput: React.FC<Props> = ({ txOutput, vm, txOutputOnChange, removeOutput }) => {
  // const isValidAmount =
  //   (txOutput.output.amount.length !== 16 && txOutput.output.amount.length !== 0) || !validHex(txOutput.output.amount)
  //     ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
  //     : '';

  const isValidAssetId =
    (txOutput.output.assetId?.length !== 64 && txOutput.output.assetId?.length !== 0) || !validHex(txOutput.output.assetId)
      ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR
      : '';

  return (
    <div className="tx-output-main">
      <div className="tx-output-header">
        <p className="tx-output-index">Index #{txOutput.index}</p>
        <div className="tx-output-close-icon" onClick={() => removeOutput(txOutput.index)}>
          <CloseIcon width="1rem" height="1rem" />
        </div>
      </div>
      <div className="tx-output-item">
        <div className="tx-modal-label">scriptPubkey:</div>
        <Input
          value={txOutput.output.scriptPubKey}
          onChange={(value: string) => {
            txOutputOnChange({ ...txOutput.output, scriptPubKey: value }, txOutput.index);
          }}
        />
      </div>
      <div className="tx-output-item">
        <div className="tx-modal-label">Amount (Decimal):</div>
        <Input
          value={txOutput.output.amount}
          onChange={(value: string) => {
            txOutputOnChange({ ...txOutput.output, amount: value }, txOutput.index);
          }}
        />
        {/* <div className="tx-error-line">{isValidAmount}</div> */}
      </div>
      {vm.network === VM_NETWORK.LIQUID && (
        <div className="tx-output-item">
          <div className="tx-modal-label">Asset ID:</div>
          <Input
            value={txOutput.output.assetId}
            placeholder="32-bytes"
            onChange={(value: string) => {
              txOutputOnChange({ ...txOutput.output, assetId: value }, txOutput.index);
            }}
          />
          <div className="tx-error-line">{isValidAssetId}</div>
        </div>
      )}
    </div>
  );
};
