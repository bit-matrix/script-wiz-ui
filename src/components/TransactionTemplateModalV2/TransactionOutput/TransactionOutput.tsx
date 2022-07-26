import { FC, useEffect, useState } from 'react';
import { TxOutputLiquid } from '@script-wiz/lib-core';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { VALUE_TYPES } from '../../../utils/enum/VALUE_TYPES';
import { validHex } from '../../../utils/helper';
import TransactionCustomInput from '../TransactionCustomInput/TransactionCustomInput';
import './TransactionOutput.scss';

type Props = {
  txOutputOnChange: (value: TxOutputLiquid) => void;
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
  assetCommitment: '',
  valueCommitment: '',
  confidental: false,
};

const TransactionOutput: FC<Props> = ({ txOutputOnChange }) => {
  const [scriptPubKey, setScriptPubKey] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [assetId, setAssetId] = useState<string | undefined>('');
  const [assetCommitment, setAssetCommitment] = useState<string | undefined>('');
  const [valueCommitment, setValueCommitment] = useState<string | undefined>('');
  const [txOutput, setTxOutput] = useState<TxOutputLiquid>(txOutputInitial);

  useEffect(() => {
    setTxOutput({
      scriptPubKey: scriptPubKey,
      amount: amount,
      assetId: assetId,
      assetCommitment: assetCommitment,
      valueCommitment: valueCommitment,
      confidental: false,
    });

    txOutputOnChange(txOutput);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, assetCommitment, assetId, scriptPubKey, valueCommitment]);

  // const isValidAmount =
  //   (txOutput.output.amount.length !== 16 && txOutput.output.amount.length !== 0) || !validHex(txOutput.output.amount)
  //     ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
  //     : '';

  const isValidAssetId = (assetId?.length !== 64 && assetId?.length !== 0) || !validHex(assetId) ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR : '';

  return (
    <div className="tx-output">
      <TransactionCustomInput
        name="scriptPubKey"
        label="ScriptPubKey:"
        value={scriptPubKey}
        valueOnChange={(value) => setScriptPubKey(value)}
        placeholder="32-bytes"
      />

      <TransactionCustomInput
        name="amount"
        label="Amount:"
        value={amount}
        valueOnChange={(value) => setAmount(value)}
        defaultValueType={VALUE_TYPES.DECIMAL}
      />

      <div>
        <TransactionCustomInput
          name="assetId"
          label="Asset Id:"
          value={assetId as string}
          valueOnChange={(value) => setAssetId(value)}
          placeholder="32-bytes"
        />
        <div className="tx-output-error-line">{isValidAssetId}</div>
      </div>

      <TransactionCustomInput
        name="assetCommitment"
        label={'Asset Commitment:'}
        value={assetCommitment as string}
        valueOnChange={(value) => setAssetCommitment(value)}
      />

      <TransactionCustomInput
        name="valueCommitment"
        label={'Value Commitment:'}
        value={valueCommitment as string}
        valueOnChange={(value: string) => setValueCommitment(value)}
      />
    </div>
  );
};

export default TransactionOutput;
