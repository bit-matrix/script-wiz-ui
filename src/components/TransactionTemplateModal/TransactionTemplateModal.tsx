import React, { useEffect, useState } from 'react';
import { TxData, TxInput, TxOutput } from '@script-wiz/lib-core';
import { Button, Input, Modal } from 'rsuite';
import TransactionInput from './TransactionInput/TransactionInput';
import TransactionOutput from './TransactionOutput/TransactionOutput';
import { useLocalStorageData } from '../../hooks/useLocalStorage';
import { ScriptWiz, VM } from '@script-wiz/lib';
import { upsertVM } from '../../helper';
import TransactionImport from '../TransactionTemplateModalV2/TransactionImport/TransactionImport';
import './TransactionTemplateModal.scss';

type Props = {
  showModal: boolean;
  scriptWiz: ScriptWiz;
  showModalCallBack: (show: boolean) => void;
};

type TxDataWithVersion = {
  vm: VM;
  txData: TxData;
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
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
};

const TransactionTemplateModal: React.FC<Props> = ({ showModal, scriptWiz, showModalCallBack }) => {
  const [txInputs, setTxInputs] = useState<TxInput[]>([txInputInitial]);
  const [txOutputs, setTxOutputs] = useState<TxOutput[]>([txOutputInitial]);
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimeLock] = useState<string>('');
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [lastBlock, setLastBlock] = useState<any>();

  const { clearTxLocalData: clearTxLocalDataEx } = useLocalStorageData<TxDataWithVersion[]>('txData');
  const { getTxLocalData, setTxLocalData, clearTxLocalData } = useLocalStorageData<TxDataWithVersion[]>('txData2');

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

  const txInputOnChange = (input: TxInput, index: number, checked: boolean) => {
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

  const txOutputOnChange = (output: TxOutput, index: number) => {
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
    const txData: TxDataWithVersion = {
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

  const timelockValidation = (): string | undefined => {
    if (lastBlock) {
      const LOCKTIME_THRESHOLD: number = 500000000;
      const timelockNumber = Number(timelock);
      let lastBlockHeight: number = 0;
      let lastBlockTimestamp: number = 0;

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
      <Modal.Header>
        <TransactionImport
          txData={(value) => {
            setTxInputs(value.inputs);
            setTxOutputs(value.outputs);
            setTimeLock(value.timelock);
            setVersion(value.version);
          }}
          scriptWiz={scriptWiz}
          lastBlock={(value) => {
            setLastBlock(value);
          }}
        />
        <div className="tx-template-header">
          <p>Inputs</p>
          <p>Outputs</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="tx-template-main">
            <div className="tx-inputs">
              {txInputs.map((input: TxInput, index: number) => {
                const txInput = { input, index, checked: currentInputIndex === index };
                return (
                  <TransactionInput
                    key={index}
                    txInput={txInput}
                    txInputOnChange={txInputOnChange}
                    vm={scriptWiz.vm}
                    removeInput={(index: number) => {
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
              {txOutputs.map((output: TxOutput, index: number) => {
                const txOutput = { output, index };
                return (
                  <TransactionOutput
                    key={index}
                    txOutput={txOutput}
                    txOutputOnChange={txOutputOnChange}
                    vm={scriptWiz.vm}
                    removeOutput={(index: number) => {
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
            <Input value={version} onChange={(value: string) => setVersion(value)} />
            {/* <div className="tx-error-line">{isValidVersion}</div> */}
          </div>
          <div className="tx-item">
            <div className="tx-modal-label">Tx Timelock:</div>
            <Input
              value={timelock}
              onChange={(value: string) => {
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
