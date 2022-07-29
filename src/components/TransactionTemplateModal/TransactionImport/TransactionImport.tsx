import { useState } from 'react';
import { TxData, TxInputLiquid, TxOutputLiquid } from '@script-wiz/lib-core';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import { ScriptWiz, VM_NETWORK } from '@script-wiz/lib';
import axios from 'axios';
import { Button, Divider, Input, InputGroup, Message, RadioGroup, toaster } from 'rsuite';
import Radio, { ValueType } from 'rsuite/esm/Radio';
import CloseIcon from '../../Svg/Icons/Close';
import { NETWORKS } from '../../../utils/enum/NETWORKS';
import './TransactionImport.scss';

type Props = {
  txData: (value: TxData) => void;
  scriptWiz: ScriptWiz;
  networkCallback: (value: NETWORKS) => void;
};

const txInputInitial = {
  previousTxId: '',
  vout: '',
  sequence: '',
  scriptPubKey: '',
  amount: '',
  assetId: '',
  blockHeight: '',
  blockTimestamp: '',
  confidental: false,
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
  assetCommitment: '',
  valueCommitment: '',
  confidental: false,
};

const TransactionImport: React.FC<Props> = ({ txData, scriptWiz, networkCallback }) => {
  const [network, setNetwork] = useState<NETWORKS>(NETWORKS.MAINNET);
  const [transactionId, setTransactionId] = useState<string>('');

  const fetchTransaction = () => {
    const api: string =
      scriptWiz.vm.network === VM_NETWORK.BTC
        ? network === NETWORKS.MAINNET
          ? `https://blockstream.info/api/tx/${transactionId}`
          : `https://blockstream.info/testnet/api/tx/${transactionId}`
        : network === NETWORKS.MAINNET
        ? `https://blockstream.info/liquid/api/tx/${transactionId}`
        : `https://blockstream.info/liquidtestnet/api/tx/${transactionId}`;

    axios
      .get(api)
      .then((res) => {
        const transactionDataInputs = res.data.vin;
        const transactionDataOutputs = res.data.vout;
        const transactionDataVersion = res.data.version;
        const transactionDataTimelock = res.data.locktime;
        const transactionDataBlockHeight = res.data.status.block_height;
        const transactionDataBlockTimestamp = res.data.status.block_time;

        let txOutput: TxOutputLiquid;
        let txInput: TxInputLiquid;
        let newTxOutputs = [];
        let newTxInputs = [];

        for (let i = 0; i < transactionDataInputs.length; i++) {
          const transactionDataInputsSequenceHex = WizData.fromNumber(transactionDataInputs[i].sequence).hex;
          const transactionDataInputsSequence = transactionDataInputsSequenceHex.substring(0, transactionDataInputsSequenceHex.length - 2);
          const transactionDataInputsSequenceHexLE = hexLE(transactionDataInputsSequence);

          txInput = {
            vout: transactionDataInputs[i].vout.toString(),
            sequence: transactionDataInputsSequenceHexLE,
            previousTxId: transactionDataInputs[i].txid,
            scriptPubKey: transactionDataInputs[i].prevout.scriptpubkey,
            amount: transactionDataInputs[i].prevout.value !== undefined ? transactionDataInputs[i].prevout?.value : '',
            assetId: transactionDataInputs[i].prevout.asset ? transactionDataInputs[i].prevout?.asset : '',
            confidental: transactionDataInputs[i].prevout.assetcommitment ? true : false,
          };

          newTxInputs.push(txInput);
        }

        for (let i = 0; i < transactionDataOutputs.length; i++) {
          if (transactionDataOutputs[i].scriptpubkey_type !== 'fee') {
            txOutput = {
              scriptPubKey: transactionDataOutputs[i].scriptpubkey ? transactionDataOutputs[i].scriptpubkey : '',
              amount: transactionDataOutputs[i].value !== undefined ? transactionDataOutputs[i].value : '',
              assetId: transactionDataOutputs[i].asset ? transactionDataOutputs[i].asset : '',
              assetCommitment: transactionDataOutputs[i].assetcommitment ? transactionDataOutputs[i].assetcommitment : '',
              valueCommitment: transactionDataOutputs[i].valuecommitment ? transactionDataOutputs[i].valuecommitment : '',
              confidental: transactionDataOutputs[i].assetcommitment ? true : false,
            };

            newTxOutputs.push(txOutput);
          }
        }

        txData({
          inputs: newTxInputs,
          outputs: newTxOutputs,
          version: transactionDataVersion,
          timelock: transactionDataTimelock,
          blockHeight: transactionDataBlockHeight.toString(),
          blockTimestamp: transactionDataBlockTimestamp.toString(),
          currentInputIndex: 0,
        });
      })
      .catch((err) => {
        const message = (
          <Message showIcon type="warning">
            Invalid transaction id.
          </Message>
        );
        toaster.push(message);

        txData({
          inputs: [txInputInitial],
          outputs: [txOutputInitial],
          version: '',
          timelock: '',
          blockHeight: '',
          blockTimestamp: '',
          currentInputIndex: 0,
        });
        setTransactionId('');
      });
  };

  return (
    <div>
      <div className="tx-import-content">
        <div className="tx-import-networks">
          <RadioGroup
            inline
            name="radioList"
            value={network}
            onChange={(value: ValueType) => {
              networkCallback(value as NETWORKS);
              setNetwork(value as NETWORKS);
            }}
          >
            <Radio value={NETWORKS.MAINNET}>{NETWORKS.MAINNET}</Radio>
            <Radio value={NETWORKS.TESTNET}>{NETWORKS.TESTNET}</Radio>
          </RadioGroup>
        </div>
        <InputGroup className="tx-import-input-group">
          <Input value={transactionId} onChange={(value) => setTransactionId(value)}></Input>
          <div onClick={() => setTransactionId('')}>
            <CloseIcon width="1rem" height="1rem" />
          </div>
        </InputGroup>
        <Button onClick={fetchTransaction}>Import</Button>
      </div>
      <Divider />
    </div>
  );
};

export default TransactionImport;
