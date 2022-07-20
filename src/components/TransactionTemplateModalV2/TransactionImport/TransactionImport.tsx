import { useCallback, useEffect, useState } from 'react';
import { TxData, TxInput, TxOutput } from '@script-wiz/lib-core';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import { ScriptWiz, VM_NETWORK } from '@script-wiz/lib';
import axios from 'axios';
import { Button, Divider, Input, InputGroup, Message, RadioGroup, toaster } from 'rsuite';
import Radio, { ValueType } from 'rsuite/esm/Radio';
import CloseIcon from '../../Svg/Icons/Close';
import './TransactionImport.scss';

type Props = {
  txData: (value: TxData) => void;
  scriptWiz: ScriptWiz;
  lastBlock: (value: string) => void;
};

enum Networks {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

const txInputInitial = {
  previousTxId: '',
  vout: '',
  sequence: '',
  scriptPubKey: '',
  amount: '',
  assetId: '',
  blockHeight: '',
  blockTimestamp: '',
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
};

const TransactionImport: React.FC<Props> = ({ txData, scriptWiz, lastBlock }) => {
  const [network, setNetwork] = useState<Networks>(Networks.MAINNET);
  const [transactionId, setTransactionId] = useState<string>('');

  const fetchTransaction = () => {
    const api: string =
      scriptWiz.vm.network === VM_NETWORK.BTC
        ? network === Networks.MAINNET
          ? `https://blockstream.info/api/tx/${transactionId}`
          : `https://blockstream.info/testnet/api/tx/${transactionId}`
        : network === Networks.MAINNET
        ? `https://blockstream.info/liquid/api/tx/${transactionId}`
        : `https://blockstream.info/liquidtestnet/api/tx/${transactionId}`;

    axios
      .get(api)
      .then((res) => {
        const transactionData = res.data;
        const transactionDataInputs = res.data.vin;
        const transactionDataOutputs = res.data.vout;
        const transactionDataInputBlockHeight = res.data.status.block_height;
        const transactionDataInputBlockTime = res.data.status.block_time;

        let txOutput: TxOutput;
        let txInput: TxInput;
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
            amount: transactionDataInputs[i].prevout.value !== undefined ? transactionDataInputs[i].prevout.value : '',
            assetId: transactionDataInputs[i].issuance?.asset_id ? transactionDataInputs[i].issuance.asset_id : '',
            blockHeight: transactionDataInputBlockHeight,
            blockTimestamp: transactionDataInputBlockTime,
          };

          newTxInputs.push(txInput);
        }

        for (let i = 0; i < transactionDataOutputs.length; i++) {
          if (transactionDataOutputs[i].scriptpubkey_type !== 'fee') {
            txOutput = {
              scriptPubKey: transactionDataOutputs[i].scriptpubkey ? transactionDataOutputs[i].scriptpubkey : '',
              amount: transactionDataOutputs[i].value !== undefined ? transactionDataOutputs[i].value : '',
              assetId: transactionDataOutputs[i].asset ? transactionDataOutputs[i].asset : '',
            };

            newTxOutputs.push(txOutput);
          }
        }

        txData({
          inputs: newTxInputs,
          outputs: newTxOutputs,
          version: transactionData.version,
          timelock: transactionData.locktime,
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
          currentInputIndex: 0,
        });
        setTransactionId('');
      });
  };

  const fetchBlocks = useCallback(() => {
    const api: string =
      scriptWiz.vm.network === VM_NETWORK.BTC
        ? network === Networks.MAINNET
          ? 'https://blockstream.info/api/blocks/'
          : 'https://blockstream.info/testnet/api/blocks/'
        : network === Networks.MAINNET
        ? 'https://blockstream.info/liquid/api/blocks'
        : 'https://blockstream.info/liquidtestnet/api/blocks/';

    axios(api).then((res) => {
      lastBlock(res.data[0]);
    });
  }, [scriptWiz.vm.network, network, lastBlock]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  return (
    <div>
      <div className="tx-import-content">
        <div className="tx-import-networks">
          <RadioGroup
            inline
            name="radioList"
            value={network}
            onChange={(value: ValueType) => {
              setNetwork(value as Networks);
            }}
          >
            <Radio value={Networks.MAINNET}>{Networks.MAINNET}</Radio>
            <Radio value={Networks.TESTNET}>{Networks.TESTNET}</Radio>
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
