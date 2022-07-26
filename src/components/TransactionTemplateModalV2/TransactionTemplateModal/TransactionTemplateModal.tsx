import { FC, useCallback, useEffect, useState } from 'react';
import { ScriptWiz, VM_NETWORK } from '@script-wiz/lib';
import { Button, Modal } from 'rsuite';
import axios from 'axios';
import TransactionImport from '../TransactionImport/TransactionImport';
import { NETWORKS } from '../../../utils/enum/NETWORKS';
import TransactionCustomInput from '../TransactionCustomInput/TransactionCustomInput';
import TransactionInputsContainer from '../TransactionInputsContainer/TransactionInputsContainer';
import TransactionOutputsContainer from '../TransactionOutputsContainer/TransactionOutputsContainer';
import './TransactionTemplateModal.scss';

type Props = {
  showModal: boolean; //modal acma icin
  showModalCallback: (show: boolean) => void; // modal kapatma icin
  scriptWiz: ScriptWiz;
};

const TransactionTemplateModal: FC<Props> = ({ showModal, showModalCallback, scriptWiz }) => {
  const [network, setNetwork] = useState<NETWORKS>(NETWORKS.MAINNET);
  const [lastBlock, setLastBlock] = useState<any>();
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimelock] = useState<string>('');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [blockTimestamp, setBlockTimestamp] = useState<string>('');

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
        showModalCallback(false);
      }}
    >
      <Modal.Header>
        <TransactionImport
          txData={(value) => {
            //setTxInputs(value.inputs);
            //setTxOutputs(value.outputs);
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
          />

          <TransactionOutputsContainer txOutputOnChange={(value) => console.log(value)} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="tx-template-modal-footer">
          <div>
            <TransactionCustomInput name="version" label="Tx Version:" value={version} valueOnChange={(value) => setVersion(value)} />
            {/* <div className="tx-error-line">{isValidVersion}</div> */}
          </div>
          <div>
            <TransactionCustomInput name="timelock" label="Tx Timelock:" value={timelock} valueOnChange={(value) => setTimelock(value)} />
            {timelockValidation() && <div className="tx-error-line">{timelockValidation()}</div>}
          </div>

          <TransactionCustomInput
            name="blockHeight"
            label="Block Height:"
            value={blockHeight as string}
            valueOnChange={(value) => setBlockHeight(value)}
          />

          <TransactionCustomInput
            name="blockTimestamp"
            label="Block Timestamp:"
            value={blockTimestamp as string}
            valueOnChange={(value) => setBlockTimestamp(value)}
          />
        </div>
        <Button onClick={() => showModalCallback(false)}>Clear</Button>
        <Button className="tx-modal-save-button" appearance="subtle" onClick={() => showModalCallback(false)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionTemplateModal;
