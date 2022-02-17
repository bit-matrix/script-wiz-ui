import React, { useEffect, useMemo, useState } from 'react';
import { TxData, TxInput, TxOutput } from '@script-wiz/lib-core';
import { Button, Input, Modal } from 'rsuite';
import TransactionInput from './TransactionInput/TransactionInput';
import TransactionOutput from './TransactionOutput/TransactionOutput';
import { useLocalStorageData } from '../../hooks/useLocalStorage';
import { ScriptWiz, VM } from '@script-wiz/lib';
import { upsertVM } from '../../helper';
import './TransactionTemplateModal.scss';

type Props = {
  showModal: boolean;
  scriptWiz: ScriptWiz;
  txData?: TxData;
  showModalCallBack: (show: boolean) => void;
};

type TxDataWithVersion = {
  vm: VM;
  txData: TxData;
};

const TransactionTemplateModal: React.FC<Props> = ({ showModal, scriptWiz, showModalCallBack }) => {
  const txInputInitial = useMemo(() => {
    return {
      previousTxId: '',
      vout: '',
      sequence: '',
      scriptPubKey: '',
      amount: '',
      assetId: '',
    };
  }, []);

  const txOutputInitial = useMemo(() => {
    return {
      scriptPubKey: '',
      amount: '',
      assetId: '',
    };
  }, []);

  const [txInputs, setTxInputs] = useState<TxInput[]>([txInputInitial]);
  const [txOutputs, setTxOutputs] = useState<TxOutput[]>([txOutputInitial]);
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimeLock] = useState<string>('');
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);

  const { getTxLocalData, setTxLocalData, clearTxLocalData } = useLocalStorageData<TxDataWithVersion[]>('txData');

  useEffect(() => {
    if (showModal) {
      const localStorageData = getTxLocalData();

      if (localStorageData) {
        const currentDataVersion = localStorageData.find((lsd) => lsd.vm.ver === scriptWiz.vm.ver && lsd.vm.network === scriptWiz.vm.network);

        if (currentDataVersion) {
          setTxInputs(currentDataVersion.txData.inputs);
          setTxOutputs(currentDataVersion.txData.outputs);
          setVersion(currentDataVersion.txData.version);
          setTimeLock(currentDataVersion.txData.timelock);
          setCurrentInputIndex(currentDataVersion.txData.currentInputIndex);
        }
      }
    } else {
      const localStorageData = getTxLocalData();

      if (localStorageData) {
        const currentDataVersion = localStorageData.find((lsd) => lsd.vm.ver === scriptWiz.vm.ver && lsd.vm.network === scriptWiz.vm.network);
        scriptWiz.parseTxData(currentDataVersion?.txData);
      }
    }
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
    };
    newTxInputs[relatedInputIndex] = newInput;
    if (checked) setCurrentInputIndex(index);
    setTxInputs(newTxInputs);
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
    closeModal();
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
    closeModal();
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
      <Modal.Header className="tx-template-modal-header" />
      <Modal.Body>
        <div>
          <div className="tx-template-header">
            <p>Inputs</p>
            <p>Outputs</p>
          </div>

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
            {/* <div className="tx-error-line">{isValidTimelock}</div> */}
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
