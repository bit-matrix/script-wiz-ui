import { FC, useEffect, useState } from 'react';
import TransactionCustomInput from '../TransactionCustomInput/TransactionCustomInput';
import './TransactionFooter.scss';

type Props = {
  lastBlock: any;
  versionOnChange: (value: string) => void;
  timelockOnChange: (value: string) => void;
  blockHeightOnChange: (value: string) => void;
  blockTimestampOnChange: (value: string) => void;
  versionValue: string;
  timelockValue: string;
  blockHeightValue: string;
  blockTimestampValue: string;
};

const TransactionFooter: FC<Props> = ({
  lastBlock,
  versionOnChange,
  timelockOnChange,
  blockHeightOnChange,
  blockTimestampOnChange,
  versionValue,
  timelockValue,
  blockHeightValue,
  blockTimestampValue,
}) => {
  const [version, setVersion] = useState<string>('');
  const [timelock, setTimelock] = useState<string>('');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [blockTimestamp, setBlockTimestamp] = useState<string>('');

  useEffect(() => {
    setVersion(versionValue);
    setTimelock(timelockValue);
    setBlockHeight(blockHeightValue);
    setBlockTimestamp(blockTimestampValue);
  }, [blockHeightValue, blockTimestampValue, timelockValue, versionValue]);

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
    <div className="tx-template-footer">
      <div className="tx-template-footer-items">
        <TransactionCustomInput
          name="version"
          label="Tx Version:"
          inputValue={version}
          inputValueOnChange={(value) => {
            setVersion(value);
            versionOnChange(value);
          }}
        />
        {/* <div className="tx-error-line">{isValidVersion}</div> */}
      </div>

      <div className="tx-template-footer-items">
        <TransactionCustomInput
          name="timelock"
          label="Tx Timelock:"
          inputValue={timelock}
          inputValueOnChange={(value) => {
            setTimelock(value);
            timelockOnChange(value);
          }}
        />
        {timelockValidation() && <div className="tx-error-line">{timelockValidation()}</div>}
      </div>

      <div className="tx-template-footer-items">
        <TransactionCustomInput
          name="blockHeight"
          label="Block Height:"
          inputValue={blockHeight as string}
          inputValueOnChange={(value) => {
            setBlockHeight(value);
            blockHeightOnChange(value);
          }}
        />
      </div>

      <div className="tx-template-footer-items">
        <TransactionCustomInput
          name="blockTimestamp"
          label="Block Timestamp:"
          inputValue={blockTimestamp as string}
          inputValueOnChange={(value) => {
            setBlockTimestamp(value);
            blockTimestampOnChange(value);
          }}
        />
      </div>
    </div>
  );
};

export default TransactionFooter;
