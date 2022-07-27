import { FC, useCallback, useEffect, useState } from 'react';
import { ScriptWiz, VM, VM_NETWORK } from '@script-wiz/lib';
import { TxData, TxInputLiquid, TxOutputLiquid } from '@script-wiz/lib-core';
import { Button, Modal } from 'rsuite';
import axios from 'axios';
import TransactionImport from '../TransactionImport/TransactionImport';
import { NETWORKS } from '../../../utils/enum/NETWORKS';
import TransactionCustomInput from '../TransactionCustomInput/TransactionCustomInput';
import TransactionInputsContainer from '../TransactionInputsContainer/TransactionInputsContainer';
import TransactionOutputsContainer from '../TransactionOutputsContainer/TransactionOutputsContainer';
import { useLocalStorageData } from '../../../hooks/useLocalStorage';
import { upsertVM } from '../../../helper';
import './TransactionTemplateModal.scss';

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
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimelock] = useState<string>('');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [blockTimestamp, setBlockTimestamp] = useState<string>('');
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);

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

    console.log(txData);

    scriptWiz.parseTxData(txData.txData);

    const previousLocalStorageData = getTxLocalData();
    const newLocalStorageData = upsertVM(txData, previousLocalStorageData);
    setTxLocalData(newLocalStorageData);
    showModalCallback(false);
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
    <Modal className="tx-template-modal" size="lg" open={showModal} backdrop={false} onClose={() => closeModal}>
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
      </Modal.Header>
      <Modal.Body>
        <div className="tx-template-main">
          <TransactionInputsContainer
            lastBlock={lastBlock}
            version={version}
            blockHeight={blockHeight}
            blockTimestamp={blockTimestamp}
            txInputOnChange={(value) => console.log(value)}
            txInputsValue={txInputs}
            currentInputIndexOnChange={(value) => {
              setCurrentInputIndex(value);
            }}
            currentInputIndexValue={currentInputIndex}
          />

          <div className="vertical-line"></div>

          <TransactionOutputsContainer txOutputOnChange={(value) => console.log(value)} txOutputsValue={txOutputs} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="tx-template-footer">
          <div className="tx-template-items">
            <TransactionCustomInput name="version" label="Tx Version:" value={version} valueOnChange={(value) => setVersion(value)} />
            {/* <div className="tx-error-line">{isValidVersion}</div> */}
          </div>

          <div className="tx-template-items">
            <TransactionCustomInput name="timelock" label="Tx Timelock:" value={timelock} valueOnChange={(value) => setTimelock(value)} />
            {timelockValidation() && <div className="tx-error-line">{timelockValidation()}</div>}
          </div>

          <div className="tx-template-items">
            <TransactionCustomInput
              name="blockHeight"
              label="Block Height:"
              value={blockHeight as string}
              valueOnChange={(value) => setBlockHeight(value)}
            />
          </div>

          <div className="tx-template-items">
            <TransactionCustomInput
              name="blockTimestamp"
              label="Block Timestamp:"
              value={blockTimestamp as string}
              valueOnChange={(value) => setBlockTimestamp(value)}
            />
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
