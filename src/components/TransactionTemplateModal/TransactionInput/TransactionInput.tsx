import React from 'react';
import { TxInput } from '@script-wiz/lib-core';
import { Input, Radio } from 'rsuite';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { validHex } from '../../../utils/helper';
import CloseIcon from '../../Svg/Icons/Close';
import { VM, VM_NETWORK } from '@script-wiz/lib';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import TransactionCustomInput from '../../TransactionTemplateModalV2/TransactionCustomInput/TransactionCustomInput';
import { VALUE_TYPES } from '../../../utils/enum/VALUE_TYPES';
import './TransactionInput.scss';

type Props = {
  vm: VM;
  txInput: { input: TxInput; index: number; checked: boolean };
  txInputOnChange: (input: TxInput, index: number, checked: boolean) => void;
  removeInput: (index: number) => void;
  version: string;
  lastBlock?: any;
};

const TransactionInput: React.FC<Props> = ({ txInput, vm, txInputOnChange, removeInput, version, lastBlock }) => {
  const isValidPreviousTxId =
    (txInput.input.previousTxId.length !== 64 && txInput.input.previousTxId.length !== 0) || !validHex(txInput.input.previousTxId)
      ? TX_TEMPLATE_ERROR_MESSAGE.PREVIOUS_TX_ID_ERROR
      : '';

  const isValidAssetId =
    (txInput.input.assetId?.length !== 64 && txInput.input.assetId?.length !== 0) || !validHex(txInput.input.assetId)
      ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR
      : '';

  // const isValidVout = txInput.input.vout.length !== 8 && txInput.input.vout.length !== 0 ? TX_TEMPLATE_ERROR_MESSAGE.VOUT_ERROR : '';

  // const isValidAmount =
  //   (txInput.input.amount.length !== 16 && txInput.input.amount.length !== 0) || !validHex(txInput.input.amount)
  //     ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
  //     : '';

  const sequenceValidation = (): string | undefined => {
    if (lastBlock) {
      const sequence = txInput.input.sequence;

      if (sequence.length && (sequence.length !== 8 || !validHex(sequence))) return TX_TEMPLATE_ERROR_MESSAGE.SEQUENCE_ERROR;

      if (sequence) {
        if (Number(version) < 2) return 'Version must be greater than 1';

        const sequenceHexLE = WizData.fromHex(hexLE(sequence));

        if (Number(sequenceHexLE.bin[0]) !== 0) return 'Disable flag must be 0';

        if (Number(sequenceHexLE.bin[0]) === 0) {
          if (Number(sequenceHexLE.bin[9]) === 1) {
            const blockUnitValue = parseInt(sequenceHexLE.bin.slice(16, 33), 2);
            const secondUnitValue = blockUnitValue * 512;

            if (txInput.input.blockTimestamp) {
              const blockTimestamp = Number(txInput.input.blockTimestamp);
              const timestampDifference = lastBlock.timestamp - blockTimestamp;

              if (timestampDifference > secondUnitValue) return 'Age must not be bigger than block timestamp';
            }
          } else if (Number(sequenceHexLE.bin[9]) === 0) {
            const blockUnitValue = parseInt(sequenceHexLE.bin.slice(16, 33), 2);

            if (txInput.input.blockHeight) {
              const blockHeight = Number(txInput.input.blockHeight);

              if (blockHeight) {
                const blockDifference = lastBlock.height - blockHeight;

                if (blockDifference > blockUnitValue) return 'Age must not be bigger than block height';
              }
            }
          }
        }
      }
    }
  };

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
                ...txInput.input,
                previousTxId: value,
              },
              txInput.index,
              txInput.checked,
            );
          }}
        />
        <div className="tx-error-line">{isValidPreviousTxId}</div>
      </div>
      <div className="tx-input-modal-item">
        <div className="tx-modal-label">Vout:</div>
        <Input
          value={txInput.input.vout}
          onChange={(value: string) => {
            txInputOnChange(
              {
                ...txInput.input,
                vout: value,
              },
              txInput.index,
              txInput.checked,
            );
          }}
        />
      </div>
      <div>
        <TransactionCustomInput
          name="sequence"
          label="Sequence:"
          defaultValueType={VALUE_TYPES.BE}
          valueOnChange={(value) => {
            txInputOnChange(
              {
                ...txInput.input,
                sequence: value,
              },
              txInput.index,
              txInput.checked,
            );
          }}
          value={txInput.input.sequence}
        />

        {sequenceValidation() && <div className="tx-error-line">{sequenceValidation()}</div>}
      </div>
      <div className="tx-input-item-double">
        <div className="tx-input-label">
          <div className="tx-input-item">Block Height:</div>
          <Input
            value={txInput.input.blockHeight}
            onChange={(value: string) => {
              txInputOnChange(
                {
                  ...txInput.input,
                  blockHeight: value,
                },
                txInput.index,
                txInput.checked,
              );
            }}
          />
        </div>
        <div className="tx-input-label">
          <div className="tx-input-item">Block Timestamp:</div>
          <Input
            value={txInput.input.blockTimestamp}
            onChange={(value: string) => {
              txInputOnChange(
                {
                  ...txInput.input,
                  blockTimestamp: value,
                },
                txInput.index,
                txInput.checked,
              );
            }}
          />
          {/* {sequenceValidation() && <div className="tx-error-line">{sequenceValidation()}</div>} */}
        </div>
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">scriptPubkey:</div>
        <Input
          value={txInput.input.scriptPubKey}
          onChange={(value: string) => {
            txInputOnChange(
              {
                ...txInput.input,
                scriptPubKey: value,
              },
              txInput.index,
              txInput.checked,
            );
          }}
        />
      </div>
      <div className="tx-input-item">
        <div className="tx-modal-label">Amount (Decimal):</div>
        <Input
          value={txInput.input.amount}
          onChange={(value: string) => {
            txInputOnChange(
              {
                ...txInput.input,
                amount: value,
              },
              txInput.index,
              txInput.checked,
            );
          }}
        />
        {/* <div className="tx-error-line">{isValidAmount}</div> */}
      </div>
      {vm.network === VM_NETWORK.LIQUID && (
        <div className="tx-input-item">
          <div className="tx-modal-label">Asset ID:</div>
          <Input
            value={txInput.input.assetId}
            placeholder="32-bytes"
            onChange={(value: string) => {
              txInputOnChange(
                {
                  ...txInput.input,
                  assetId: value,
                },
                txInput.index,
                txInput.checked,
              );
            }}
          />
          <div className="tx-error-line">{isValidAssetId}</div>
        </div>
      )}
    </div>
  );
};

export default TransactionInput;
