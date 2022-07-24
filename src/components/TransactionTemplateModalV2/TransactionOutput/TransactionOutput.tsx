import { FC, useState } from 'react';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { VALUE_TYPES } from '../../../utils/enum/VALUE_TYPES';
import { validHex } from '../../../utils/helper';
import TransactionCustomInput from '../TransactionCustomInput/TransactionCustomInput';
import './TransactionOutput.scss';

const TransactionOutput: FC = () => {
  const [previousTxId, setPreviousTxId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [assetId, setAssetId] = useState<string | undefined>('');
  const [assetCommitment, setAssetCommitment] = useState<string | undefined>('');
  const [valueCommitment, setValueCommitment] = useState<string | undefined>('');

  // const isValidAmount =
  //   (txOutput.output.amount.length !== 16 && txOutput.output.amount.length !== 0) || !validHex(txOutput.output.amount)
  //     ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
  //     : '';

  const isValidAssetId = (assetId?.length !== 64 && assetId?.length !== 0) || !validHex(assetId) ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR : '';

  return (
    <div className="tx-output">
      <TransactionCustomInput
        name="previousTxId"
        label="Previous Tx Id:"
        value={previousTxId}
        valueOnChange={(value) => setPreviousTxId(value)}
        placeholder="32-bytes"
      />
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
      <div className="tx-output-error-line">{isValidAssetId}</div>
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
