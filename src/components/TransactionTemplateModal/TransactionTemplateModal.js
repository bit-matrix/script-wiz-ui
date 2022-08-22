import React, { useEffect, useState, useCallback } from 'react';
import { Button, Divider, Input, InputGroup, Message, Modal, Radio, RadioGroup, toaster } from 'rsuite';
import TransactionInput from './TransactionInput/TransactionInput';
import TransactionOutput from './TransactionOutput/TransactionOutput';
import { useLocalStorageData } from '../../hooks/useLocalStorage';
import {  VM_NETWORK } from '@script-wiz/lib';
import { upsertVM } from '../../helper';
import axios from 'axios';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import CloseIcon from '../Svg/Icons/Close';
import './TransactionTemplateModal.scss';


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

enum Networks {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

let message;

const TransactionTemplateModal = ({ showModal, scriptWiz, showModalCallBack }) => {
  const [txInputs, setTxInputs] = useState([txInputInitial]);
  const [txOutputs, setTxOutputs] = useState([txOutputInitial]);
  const [version, setVersion] = useState('');
  const [timelock, setTimeLock] = useState('');
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [lastBlock, setLastBlock] = useState();
  const [transactionId, setTransactionId] = useState('');
  const [networkValue, setNetworkValue] = useState(Networks.MAINNET);

  const { clearTxLocalData: clearTxLocalDataEx } = useLocalStorageData('txData');
  const { getTxLocalData, setTxLocalData, clearTxLocalData } = useLocalStorageData('txData2');

  useEffect(() => {
    clearTxLocalDataEx();

    const localStorageData = getTxLocalData();

    if (localStorageData) {
      const currentDataVersion = localStorageData.find((lsd) => lsd.vm.ver === scriptWiz.vm.ver && lsd.vm.network === scriptWiz.vm.network);

      if (currentDataVersion) {
        if (showModal) {
          setTxInputs(currentDataVersion.txData.inputs);
          setTxOutputs(currentDataVersion.txData.outputs);
          setVersion(currentDataVersion.txData.version);
          setTimeLock(currentDataVersion.txData.timelock);
          setCurrentInputIndex(currentDataVersion.txData.currentInputIndex);
        } else {
          scriptWiz.parseTxData(currentDataVersion.txData);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, scriptWiz]);

  const txInputOnChange = (input, index, checked) => {
    const newTxInputs = [...txInputs];
    const relatedInputIndex = txInputs.findIndex((input, i) => i === index);

    const newInput = {
      previousTxId: input.previousTxId,
      vout: input.vout,
      sequence: input.sequence,
      scriptPubKey: input.scriptPubKey,
      amount: input.amount,
      assetId: input.assetId,
      blockHeight: input.blockHeight,
      blockTimestamp: input.blockTimestamp,
    };

    newTxInputs[relatedInputIndex] = newInput;
    setTxInputs(newTxInputs);

    if (checked) setCurrentInputIndex(index);
  };

  const txOutputOnChange = (output, index) => {
    const newTxOutputs = [...txOutputs];
    const relatedOutputIndex = txOutputs.findIndex((output, i) => i === index);
    const newOutput = {
      scriptPubKey: output.scriptPubKey,
      amount: output.amount,
      assetId: output.assetId,
    };
    newTxOutputs[relatedOutputIndex] = newOutput;
    setTxOutputs(newTxOutputs);
  };

  const closeModal = () => {
    setTxInputs([txInputInitial]);
    setTxOutputs([txOutputInitial]);
    setVersion('');
    setTimeLock('');
    setTransactionId('');
    setCurrentInputIndex(0);

    showModalCallBack(false);
  };

  const clearButtonClick = () => {
    scriptWiz.parseTxData();

    const localStorageData = getTxLocalData();

    if (localStorageData) {
      if (localStorageData.length === 1) clearTxLocalData();
      else {
        const newLocalStorageData = [...localStorageData];
        const currentIndex = newLocalStorageData.findIndex((cd) => cd.vm.ver === scriptWiz.vm.ver && cd.vm.network === scriptWiz.vm.network);

        newLocalStorageData.splice(currentIndex, 1);

        setTxLocalData(newLocalStorageData);
      }
    }
    closeModal();
  };

  const saveButtonClick = () => {
    const txData = {
      vm: scriptWiz.vm,
      txData: {
        inputs: txInputs,
        outputs: txOutputs,
        version: version,
        timelock: timelock,
        currentInputIndex,
      },
    };
    scriptWiz.parseTxData(txData.txData);

    const previousLocalStorageData = getTxLocalData();
    const newLocalStorageData = upsertVM(txData, previousLocalStorageData);
    setTxLocalData(newLocalStorageData);
    showModalCallBack(false);
  };

  const fetchBlocks = useCallback(() => {
    const api =
      scriptWiz.vm.network === VM_NETWORK.BTC
        ? networkValue === Networks.MAINNET
          ? 'https://blockstream.info/api/blocks/'
          : 'https://blockstream.info/testnet/api/blocks/'
        : networkValue === Networks.MAINNET
        ? 'https://blockstream.info/liquid/api/blocks'
        : 'https://blockstream.info/liquidtestnet/api/blocks/';

    axios(api).then((res) => {
      setLastBlock(res.data[0]);
    });
  }, [scriptWiz.vm.network, networkValue]);

  useEffect(() => {
    if (showModal) fetchBlocks();
  }, [fetchBlocks, showModal]);

  const fetchTransaction = () => {
    const api =
      scriptWiz.vm.network === VM_NETWORK.BTC
        ? networkValue === Networks.MAINNET
          ? `https://blockstream.info/api/tx/${transactionId}`
          : `https://blockstream.info/testnet/api/tx/${transactionId}`
        : networkValue === Networks.MAINNET
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

        let txOutput;
        let txInput;
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

        setTxInputs(newTxInputs);

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

        setTxOutputs(newTxOutputs);

        setTimeLock(transactionData.locktime);
        setVersion(transactionData.version);
      })
      .catch((err) => {
        message = (
          <Message showIcon type="warning">
            Invalid transaction id.
          </Message>
        );
        toaster.push(message);

        setTxInputs([txInputInitial]);
        setTxOutputs([txOutputInitial]);
        setVersion('');
        setTimeLock('');
        setCurrentInputIndex(0);
        setLastBlock(undefined);
        setTransactionId('');
      });
  };

  const timelockValidation = () => {
    if (lastBlock) {
      const LOCKTIME_THRESHOLD = 500000000;
      const timelockNumber = Number(timelock);
      let lastBlockHeight = 0;
      let lastBlockTimestamp= 0;

      if (isNaN(timelockNumber)) return 'must be a number';

      lastBlockHeight = lastBlock.height;
      lastBlockTimestamp = lastBlock.timestamp;

      if (timelockNumber < LOCKTIME_THRESHOLD) {
        if (timelockNumber > lastBlockHeight) return 'must be less than last block height';
      } else {
        if (timelockNumber > lastBlockTimestamp) return 'must be less than last block timestamp';
      }
    }
  };

  return (
    <Modal
      className="tx-template-modal"
      size="lg"
      open={showModal}
      backdrop={false}
      onClose={() => {
        closeModal();
      }}
    >
      <Modal.Header className="tx-template-modal-header">
        <div className="tx-template-import">
          <div className="tx-template-networks">
            <RadioGroup
              inline
              name="radioList"
              value={networkValue}
              onChange={(value) => {
                setNetworkValue(value );
              }}
            >
              <Radio value={Networks.MAINNET}>{Networks.MAINNET}</Radio>
              <Radio value={Networks.TESTNET}>{Networks.TESTNET}</Radio>
            </RadioGroup>
          </div>
          <InputGroup className="tx-template-input-group">
            <Input value={transactionId} onChange={(value) => setTransactionId(value)}></Input>
            <div onClick={() => setTransactionId('')}>
              <CloseIcon width="1rem" height="1rem" />
            </div>
          </InputGroup>
          <Button onClick={fetchTransaction}>Import</Button>
        </div>
        <Divider />
        <div className="tx-template-header">
          <p>Inputs</p>
          <p>Outputs</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="tx-template-main">
            <div className="tx-inputs">
              {txInputs.map((input, index) => {
                const txInput = { input, index, checked: currentInputIndex === index };
                return (
                  <TransactionInput
                    key={index}
                    txInput={txInput}
                    txInputOnChange={txInputOnChange}
                    vm={scriptWiz.vm}
                    removeInput={(index) => {
                      const newTxInputs = [...txInputs];
                      if (txInputs.length > 1) {
                        newTxInputs.splice(index, 1);
                        setTxInputs(newTxInputs);
                      }
                    }}
                    version={version}
                    lastBlock={lastBlock}
                  />
                );
              })}
              <Button
                className="tx-template-button"
                onClick={() => {
                  const newTxInput = txInputInitial;
                  const newTxInputs = [...txInputs];
                  newTxInputs.push(newTxInput);
                  setTxInputs(newTxInputs);
                }}
              >
                + Add New Input
              </Button>
            </div>
            <div className="vertical-line"></div>
            <div className="tx-outputs">
              {txOutputs.map((output, index) => {
                const txOutput = { output, index };
                return (
                  <TransactionOutput
                    key={index}
                    txOutput={txOutput}
                    txOutputOnChange={txOutputOnChange}
                    vm={scriptWiz.vm}
                    removeOutput={(index) => {
                      const newTxOutputs = [...txOutputs];
                      if (txOutputs.length > 1) {
                        newTxOutputs.splice(index, 1);
                        setTxOutputs(newTxOutputs);
                      }
                    }}
                  />
                );
              })}
              <Button
                className="tx-template-button"
                onClick={() => {
                  const newTxOutput = txOutputInitial;
                  const newTxOutputs = [...txOutputs];
                  newTxOutputs.push(newTxOutput);
                  setTxOutputs(newTxOutputs);
                }}
              >
                + Add New Output
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="tx-template-modal-footer">
          <div className="tx-item">
            <div className="tx-modal-label">Tx Version:</div>
            <Input value={version} onChange={(value) => setVersion(value)} />
            {/* <div className="tx-error-line">{isValidVersion}</div> */}
          </div>
          <div className="tx-item">
            <div className="tx-modal-label">Tx Timelock:</div>
            <Input
              value={timelock}
              onChange={(value) => {
                setTimeLock(value);
              }}
            />
            {timelockValidation() && <div className="tx-error-line">{timelockValidation()}</div>}
          </div>
        </div>
        <Button onClick={clearButtonClick}>Clear</Button>
        <Button className="tx-modal-save-button" appearance="subtle" onClick={saveButtonClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
