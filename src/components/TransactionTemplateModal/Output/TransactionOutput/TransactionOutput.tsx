import { FC } from 'react';
import { TxOutputLiquid } from '@script-wiz/lib-core';
import { VM, VM_NETWORK } from '@script-wiz/lib';
import { Checkbox } from 'rsuite';
import { TX_TEMPLATE_ERROR_MESSAGE } from '../../../../utils/enum/TX_TEMPLATE_ERROR_MESSAGE';
import { VALUE_TYPES } from '../../../../utils/enum/VALUE_TYPES';
import { validHex } from '../../../../utils/helper';
import TransactionCustomInput from '../../TransactionCustomInput/TransactionCustomInput';
import './TransactionOutput.scss';

type Props = {
  txOutputOnChange: (value: TxOutputLiquid, index: number) => void;
  txOutput: { output: TxOutputLiquid; index: number };
  vm: VM;
};

const TransactionOutput: FC<Props> = ({ txOutputOnChange, txOutput, vm }) => {
  // const isValidAmount =
  //   (txOutput.output.amount.length !== 16 && txOutput.output.amount.length !== 0) || !validHex(txOutput.output.amount)
  //     ? TX_TEMPLATE_ERROR_MESSAGE.AMOUNT_ERROR
  //     : '';

  const isValidAssetId =
    (txOutput.output.assetId?.length !== 64 && txOutput.output.assetId?.length !== 0) || !validHex(txOutput.output.assetId)
      ? TX_TEMPLATE_ERROR_MESSAGE.ASSET_ID_ERROR
      : '';

  return (
    <div className="tx-output">
      {vm.network === VM_NETWORK.LIQUID && (
        <Checkbox
          onChange={(value: any, checked: boolean) => {
            txOutputOnChange(
              {
                ...txOutput.output,
                confidental: checked,
              },
              txOutput.index,
            );
          }}
          checked={txOutput.output.confidental}
          value={txOutput.output.confidental ? 'true' : 'false'}
        >
          <span className="tx-output-confidental">Confidental</span>
        </Checkbox>
      )}

      <TransactionCustomInput
        name="scriptPubKey"
        label="ScriptPubKey:"
        value={txOutput.output.scriptPubKey}
        valueOnChange={(value: string) => {
          txOutputOnChange({ ...txOutput.output, scriptPubKey: value }, txOutput.index);
        }}
        placeholder="32-bytes"
      />

      {!txOutput.output.confidental && (
        <TransactionCustomInput
          name="amount"
          label="Amount:"
          value={txOutput.output.amount}
          valueOnChange={(value: string) => {
            txOutputOnChange({ ...txOutput.output, amount: value }, txOutput.index);
          }}
          defaultValueType={VALUE_TYPES.DECIMAL}
        />
      )}

      {vm.network === VM_NETWORK.LIQUID && (
        <div>
          {!txOutput.output.confidental && (
            <div>
              <TransactionCustomInput
                name="assetId"
                label="Asset Id:"
                value={txOutput.output.assetId as string}
                valueOnChange={(value: string) => {
                  txOutputOnChange({ ...txOutput.output, assetId: value }, txOutput.index);
                }}
                placeholder="32-bytes"
              />
              <div className="tx-output-error-line">{isValidAssetId}</div>
            </div>
          )}

          {txOutput.output.confidental && (
            <div>
              <TransactionCustomInput
                name="assetCommitment"
                label={'Asset Commitment:'}
                value={txOutput.output.assetCommitment as string}
                valueOnChange={(value: string) => {
                  txOutputOnChange({ ...txOutput.output, assetCommitment: value }, txOutput.index);
                }}
              />

              <TransactionCustomInput
                name="valueCommitment"
                label={'Value Commitment:'}
                value={txOutput.output.valueCommitment as string}
                valueOnChange={(value: string) => {
                  txOutputOnChange({ ...txOutput.output, valueCommitment: value }, txOutput.index);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionOutput;
