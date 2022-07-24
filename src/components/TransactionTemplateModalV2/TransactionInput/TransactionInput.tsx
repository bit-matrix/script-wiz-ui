import { FC, useState } from 'react';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { VALUE_TYPES } from '../../../utils/enum/VALUE_TYPES';
import { validHex } from '../../../utils/helper';
import TransactionCustomInput from '../TransactionCustomInput/TransactionCustomInput';
import './TransactionInput.scss';

type Props = {
  lastBlock: any;
  version: string;
};

const TransactionInput: FC<Props> = ({ lastBlock, version }) => {
  const [previousTxId, setPreviousTxId] = useState<string>('');
  const [vout, setVout] = useState<string>('');
  const [sequence, setSequence] = useState<string>('');
  const [blockHeight, setBlockHeight] = useState<string | undefined>('');
  const [blockTimestamp, setBlockTimestamp] = useState<string | undefined>('');
  const [scriptPubKey, setScriptPubKey] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [assetId, setAssetId] = useState<string | undefined>('');

  const isValidPreviousTxId =
    (previousTxId.length !== 64 && previousTxId.length !== 0) || !validHex(previousTxId) ? TX_TEMPLATE_ERROR_MESSAGE.PREVIOUS_TX_ID_ERROR : '';

  const isValidAssetId = (assetId?.length !== 64 && assetId?.length !== 0) || !validHex(assetId) ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR : '';

  // const isValidVout = txInput.input.vout.length !== 8 && txInput.input.vout.length !== 0 ? TX_TEMPLATE_ERROR_MESSAGE.VOUT_ERROR : '';

  // const isValidAmount =
  //   (txInput.input.amount.length !== 16 && txInput.input.amount.length !== 0) || !validHex(txInput.input.amount)
  //     ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
  //     : '';

  const isValidSequence = (): string | undefined => {
    if (lastBlock) {
      const sequenceValue = sequence;

      if (sequenceValue.length && (sequenceValue.length !== 8 || !validHex(sequenceValue))) return TX_TEMPLATE_ERROR_MESSAGE.SEQUENCE_ERROR;

      if (sequenceValue) {
        if (Number(version) < 2) return 'Version must be greater than 1';

        const sequenceHexLE = WizData.fromHex(hexLE(sequence));

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
    <div className="tx-input">
      <TransactionCustomInput
        name="previousTxId"
        label="Previous Tx Id:"
        value={previousTxId}
        valueOnChange={(value) => setPreviousTxId(value)}
        placeholder="32-bytes"
      />
      <div className="tx-input-error-line">{isValidPreviousTxId}</div>
      <TransactionCustomInput name="vout" label="Vout:" value={vout} valueOnChange={(value) => setVout(value)} />
      <TransactionCustomInput
        name="sequence"
        label="Sequence:"
        value={sequence}
        valueOnChange={(value) => setSequence(value)}
        defaultValueType={VALUE_TYPES.BE}
      />
      {isValidSequence() && <div className="tx-input-error-line">{isValidSequence()}</div>}
      <TransactionCustomInput
        name="blockHeight"
        label="Block Height:"
        value={blockHeight as string}
        valueOnChange={(value) => setBlockHeight(value)}
      />
      <TransactionCustomInput
        name="blockTimestamp"
        label="Block Timestamp:"
        value={blockTimestamp as string}
        valueOnChange={(value) => setBlockTimestamp(value)}
      />
      <TransactionCustomInput name="scriptPubKey" label="ScriptPubKey:" value={scriptPubKey} valueOnChange={(value) => setScriptPubKey(value)} />
      <TransactionCustomInput
        name="amount"
        label="Amount:"
        value={amount}
        valueOnChange={(value) => setAmount(value)}
        defaultValueType={VALUE_TYPES.DECIMAL}
      />
      <TransactionCustomInput
        name="assetId"
        label="Asset Id:"
        value={assetId as string}
        valueOnChange={(value) => setAssetId(value)}
        placeholder="32-bytes"
      />
      <div className="tx-input-error-line">{isValidAssetId}</div>
    </div>
  );
};

export default TransactionInput;
