import { FC } from 'react';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import { TxInputLiquid } from '@script-wiz/lib-core';
import { VM, VM_NETWORK } from '@script-wiz/lib';
import { Checkbox } from 'rsuite';
import { validHex } from '../../../../utils/helper';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import TransactionCustomInput from '../../TransactionCustomInput/TransactionCustomInput';
import { VALUE_TYPES } from '../../../../utils/enum/VALUE_TYPES';
import './TransactionInput.scss';

type Props = {
  lastBlock: any;
  version: string;
  blockHeight: string;
  blockTimestamp: string;
  txInputOnChange: (input: TxInputLiquid, index: number, checked: boolean) => void;
  txInput: { input: TxInputLiquid; index: number; isCurrentInputIndex: boolean };
  vm: VM;
};

const TransactionInput: FC<Props> = ({ lastBlock, version, blockHeight, blockTimestamp, txInputOnChange, txInput, vm }) => {
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

  const isValidSequence = (): string | undefined => {
    if (lastBlock) {
      const sequenceValue = txInput.input.sequence;

      if (sequenceValue.length && (sequenceValue.length !== 8 || !validHex(sequenceValue))) return TX_TEMPLATE_ERROR_MESSAGE.SEQUENCE_ERROR;

      if (sequenceValue) {
        if (Number(version) < 2) return 'Version must be greater than 1';

        const sequenceHexLE = WizData.fromHex(hexLE(sequenceValue));

        if (Number(sequenceHexLE.bin[0]) !== 0) return 'Disable flag must be 0';

        if (Number(sequenceHexLE.bin[0]) === 0) {
          if (Number(sequenceHexLE.bin[9]) === 1) {
            const blockUnitValue = parseInt(sequenceHexLE.bin.slice(16, 33), 2);
            const secondUnitValue = blockUnitValue * 512;

            if (blockTimestamp) {
              const blockTimestampValue = Number(blockTimestamp);
              const timestampDifference = lastBlock.timestamp - blockTimestampValue;

              if (timestampDifference > secondUnitValue) return 'Age must not be bigger than block timestamp';
            }
          } else if (Number(sequenceHexLE.bin[9]) === 0) {
            const blockUnitValue = parseInt(sequenceHexLE.bin.slice(16, 33), 2);

            if (blockHeight) {
              const blockHeightValue = Number(blockHeight);

              if (blockHeight) {
                const blockDifference = lastBlock.height - blockHeightValue;

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
      <div>
        {vm.network === VM_NETWORK.LIQUID && (
          <Checkbox
            onChange={(value: any, checked: boolean) => {
              txInputOnChange(
                {
                  ...txInput.input,
                  confidental: checked,
                },
                txInput.index,
                txInput.isCurrentInputIndex,
              );
            }}
            checked={txInput.input.confidental}
            value={txInput.input.confidental ? 'true' : 'false'}
          >
            <span className="tx-input-confidental">Confidental</span>
          </Checkbox>
        )}

        <TransactionCustomInput
          name="previousTxId"
          label="Previous Tx Id:"
          value={txInput.input.previousTxId}
          valueOnChange={(value: string) => {
            txInputOnChange(
              {
                ...txInput.input,
                previousTxId: value,
              },
              txInput.index,
              txInput.isCurrentInputIndex,
            );
          }}
          placeholder="32-bytes"
        />
        <div className="tx-input-error-line">{isValidPreviousTxId}</div>
      </div>

      <TransactionCustomInput
        name="vout"
        label="Vout:"
        value={txInput.input.vout}
        valueOnChange={(value: string) => {
          txInputOnChange(
            {
              ...txInput.input,
              vout: value,
            },
            txInput.index,
            txInput.isCurrentInputIndex,
          );
        }}
      />

      <div>
        <TransactionCustomInput
          name="sequence"
          label="Sequence:"
          value={txInput.input.sequence}
          valueOnChange={(value) => {
            txInputOnChange(
              {
                ...txInput.input,
                sequence: value,
              },
              txInput.index,
              txInput.isCurrentInputIndex,
            );
          }}
          defaultValueType={VALUE_TYPES.BE}
        />
        {isValidSequence() && <div className="tx-input-error-line">{isValidSequence()}</div>}
      </div>

      <TransactionCustomInput
        name="scriptPubKey"
        label="ScriptPubKey:"
        value={txInput.input.scriptPubKey}
        valueOnChange={(value: string) => {
          txInputOnChange(
            {
              ...txInput.input,
              scriptPubKey: value,
            },
            txInput.index,
            txInput.isCurrentInputIndex,
          );
        }}
      />

      {!txInput.input.confidental && (
        <TransactionCustomInput
          name="amount"
          label="Amount:"
          value={txInput.input.amount}
          valueOnChange={(value: string) => {
            txInputOnChange(
              {
                ...txInput.input,
                amount: value,
              },
              txInput.index,
              txInput.isCurrentInputIndex,
            );
          }}
          defaultValueType={VALUE_TYPES.DECIMAL}
        />
      )}

      {vm.network === VM_NETWORK.LIQUID && (
        <div>
          {!txInput.input.confidental && (
            <div>
              <TransactionCustomInput
                name="assetId"
                label="Asset Id:"
                value={txInput.input.assetId as string}
                valueOnChange={(value: string) => {
                  txInputOnChange(
                    {
                      ...txInput.input,
                      assetId: value,
                    },
                    txInput.index,
                    txInput.isCurrentInputIndex,
                  );
                }}
                placeholder="32-bytes"
              />
              <div className="tx-input-error-line">{isValidAssetId}</div>
            </div>
          )}

          {txInput.input.confidental && (
            <div>
              <TransactionCustomInput
                name="assetCommitment"
                label={'Asset Commitment:'}
                value={txInput.input.assetCommitment as string}
                valueOnChange={(value: string) => {
                  txInputOnChange({ ...txInput.input, assetCommitment: value }, txInput.index, txInput.isCurrentInputIndex);
                }}
              />

              <TransactionCustomInput
                name="valueCommitment"
                label={'Value Commitment:'}
                value={txInput.input.valueCommitment as string}
                valueOnChange={(value: string) => {
                  txInputOnChange({ ...txInput.input, valueCommitment: value }, txInput.index, txInput.isCurrentInputIndex);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionInput;
