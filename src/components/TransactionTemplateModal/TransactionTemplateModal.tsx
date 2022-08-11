import { FC, useCallback, useEffect, useState } from 'react';
import { ScriptWiz, VM, VM_NETWORK } from '@script-wiz/lib';
import { TxData, TxInputLiquid, TxOutputLiquid } from '@script-wiz/lib-core';
import { Button, Modal } from 'rsuite';
import axios from 'axios';
import { NETWORKS } from '../../utils/enum/NETWORKS';
import { useLocalStorageData } from '../../hooks/useLocalStorage';
import { upsertVM } from '../../helper';
import TransactionImport from './TransactionImport/TransactionImport';
import TransactionInputsContainer from './Input/TransactionInputsContainer/TransactionInputsContainer';
import TransactionOutputsContainer from './Output/TransactionOutputsContainer/TransactionOutputsContainer';
import './TransactionTemplateModal.scss';
import TransactionFooter from './TransactionFooter/TransactionFooter';

type Props = {
  showModal: boolean; //modal acma icin
  showModalCallback: (show: boolean) => void; // modal kapatma icin
  scriptWiz: ScriptWiz;
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
  confidental: false,
};

const txOutputInitial = {
  scriptPubKey: '',
  amount: '',
  assetId: '',
  assetommitment: '',
  valueCommitment: '',
  confidental: false,
};

const TransactionTemplateModal: FC<Props> = ({ showModal, showModalCallback, scriptWiz }) => {
  const [txInputs, setTxInputs] = useState<TxInputLiquid[]>([txInputInitial]);
  const [txOutputs, setTxOutputs] = useState<TxOutputLiquid[]>([txOutputInitial]);
  const [network, setNetwork] = useState<NETWORKS>(NETWORKS.MAINNET);
  const [lastBlock, setLastBlock] = useState<any>();
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimelock] = useState<string>('');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [blockTimestamp, setBlockTimestamp] = useState<string>('');

  const { clearTxLocalData: clearTxLocalDataEx } = useLocalStorageData<TxDataWithVersion[]>('txData2');
  const { getTxLocalData, setTxLocalData, clearTxLocalData } = useLocalStorageData<TxDataWithVersion[]>('tx-template-modal');

  useEffect(() => {
    clearTxLocalDataEx();

    const localStorageData = getTxLocalData();

    if (localStorageData) {
      const currentDataVersion = localStorageData.find((lsd) => lsd.vm.ver === scriptWiz.vm.ver && lsd.vm.network === scriptWiz.vm.network);

      if (currentDataVersion) {
        if (showModal) {
          setTxInputs(currentDataVersion.txData.inputs as TxInputLiquid[]);
          setTxOutputs(currentDataVersion.txData.outputs as TxOutputLiquid[]);
          setVersion(currentDataVersion.txData.version);
          setTimelock(currentDataVersion.txData.timelock);
          setBlockHeight(currentDataVersion.txData.blockHeight);
          setBlockTimestamp(currentDataVersion.txData.blockTimestamp);
          setCurrentInputIndex(currentDataVersion.txData.currentInputIndex);
        } else {
          scriptWiz.parseTxData(currentDataVersion.txData);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, scriptWiz]);

  const txInputsOnChange = (input: TxInputLiquid, index: number, isCurrentInputIndex: boolean) => {
    const newTxInputs = [...txInputs];

    const newInput = {
      previousTxId: input.previousTxId,
      vout: input.vout,
      sequence: input.sequence,
      scriptPubKey: input.scriptPubKey,
      amount: input.amount,
      assetId: input.assetId,
      confidental: input.confidental,
    };

    newTxInputs[index] = newInput;

    setTxInputs(newTxInputs);

    if (isCurrentInputIndex) {
      setCurrentInputIndex(index);
    }
  };

  const txOutputsOnChange = (output: TxOutputLiquid, index: number) => {
    const newTxOutputs = [...txOutputs];
    const relatedOutputIndex = txOutputs.findIndex((output, i) => i === index);
    const newOutput = {
      scriptPubKey: output.scriptPubKey,
      amount: output.amount,
      assetId: output.assetId,
      assetCommitment: output.assetCommitment,
      valueCommitment: output.valueCommitment,
      confidental: output.confidental,
    };

    newTxOutputs[relatedOutputIndex] = newOutput;
    setTxOutputs(newTxOutputs);
  };

  const fetchBlocks = useCallback(() => {
    const api: string =
      scriptWiz.vm.network === VM_NETWORK.BTC
        ? network === NETWORKS.MAINNET
          ? 'https://blockstream.info/api/blocks/'
          : 'https://blockstream.info/testnet/api/blocks/'
        : network === NETWORKS.MAINNET
        ? 'https://blockstream.info/liquid/api/blocks'
        : 'https://blockstream.info/liquidtestnet/api/blocks/';

    axios(api).then((res) => {
      setLastBlock(res.data[0]);
    });
  }, [scriptWiz.vm.network, network]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const closeModal = () => {
    setTxInputs([txInputInitial]);
    setTxOutputs([txOutputInitial]);
    setVersion('');
    setTimelock('');
    setBlockHeight('');
    setBlockTimestamp('');
    setCurrentInputIndex(0);

    showModalCallback(false);
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
        blockHeight: blockHeight,
        blockTimestamp: blockTimestamp,
        currentInputIndex: currentInputIndex,
      },
    };

    scriptWiz.parseTxData(txData.txData);

    const previousLocalStorageData = getTxLocalData();
    const newLocalStorageData = upsertVM(txData, previousLocalStorageData);
    setTxLocalData(newLocalStorageData);
    showModalCallback(false);
  };

  return (
    <Modal className="tx-template-modal" size="lg" open={showModal} backdrop={false} onClose={closeModal}>
      <div className="tx-header-for-close">
        <Modal.Header>
          <TransactionImport
            txData={(value) => {
              setTxInputs(value.inputs as TxInputLiquid[]);
              setTxOutputs(value.outputs as TxInputLiquid[]);
              setTimelock(value.timelock);
              setVersion(value.version);
              setBlockHeight(value.blockHeight);
              setBlockTimestamp(value.blockTimestamp);
            }}
            scriptWiz={scriptWiz}
            networkCallback={(value) => setNetwork(value)}
          />

          <div className="tx-template-header">
            <p>Inputs</p>
            <p>Outputs</p>
          </div>
        </Modal.Header>
      </div>
      <Modal.Body>
        <div className="tx-template-modal-body">
          <div className="tx-template-main">
            <TransactionInputsContainer
              lastBlock={lastBlock}
              version={version}
              blockHeight={blockHeight}
              blockTimestamp={blockTimestamp}
              txInputOnChange={txInputsOnChange}
              txInputsValue={txInputs}
              currentInputIndexValue={currentInputIndex}
              vm={scriptWiz.vm}
              newTxInputsOnChange={(value) => setTxInputs(value)}
            />

            <div className="vertical-line"></div>

            <TransactionOutputsContainer
              txOutputOnChange={txOutputsOnChange}
              txOutputsValue={txOutputs}
              newTxOutputsOnChange={(value) => setTxOutputs(value)}
              vm={scriptWiz.vm}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <TransactionFooter
          lastBlock={lastBlock}
          versionOnChange={(value) => setVersion(value)}
          timelockOnChange={(value) => setTimelock(value)}
          blockHeightOnChange={(value) => setBlockHeight(value)}
          blockTimestampOnChange={(value) => setBlockTimestamp(value)}
          versionValue={version}
          timelockValue={timelock}
          blockHeightValue={blockHeight}
          blockTimestampValue={blockTimestamp}
        />

        <Button onClick={clearButtonClick}>Clear</Button>
        <Button className="tx-modal-save-button" appearance="subtle" onClick={saveButtonClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
