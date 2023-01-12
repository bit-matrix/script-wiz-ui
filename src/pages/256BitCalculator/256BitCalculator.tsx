import React, { useState } from 'react';
import BN from 'bn.js';
import { Button, Input } from 'rsuite';

export const BitCalculator = () => {
  const [oldState, setOldState] = useState<BN>();
  const [newState, setNewState] = useState<string>('');

  const add = () => {
    if (oldState) {
      console.log('1');
      if (newState.startsWith('0x')) {
        console.log('3');
        const input = new BN(newState, 'hex');

        const calculation = oldState.add(input);
        setOldState(calculation);
      } else {
        console.log('4');
        const input = new BN(Number(newState));
        const calculation = oldState.add(input);
        setOldState(calculation);
      }
    } else {
      console.log('2');

      if (newState.startsWith('0x')) {
        console.log('5');
        setOldState(new BN(newState, 'hex'));
      } else {
        console.log('6');
        setOldState(new BN(Number(newState)));
      }
    }

    // if (oldState) {
    //   const bn2 = new BN(newState);

    //   const calculation = oldState.add(bn2);

    //   setOldState(calculation);
    //   console.log(calculation.toString());
    // } else {
    //   console.log(new BN(newState));
    //   setOldState(new BN(newState));
    // }

    setNewState('');
  };

  const sub = () => {
    if (newState && oldState) {
      const bn2 = new BN(newState);

      const calculation = oldState.sub(bn2);
      console.log(calculation);
    } else {
      // todo
    }
  };

  const mul = () => {
    if (newState && oldState) {
      const bn2 = new BN(newState);

      const calculation = oldState.mul(bn2);
      console.log(calculation);
    } else {
      // todo
    }
  };

  const div = () => {
    if (newState && oldState) {
      const bn2 = new BN(newState);

      const calculation = oldState.div(bn2);
      console.log(calculation);
    } else {
    }
  };

  const mod = () => {
    if (newState && oldState) {
      const bn2 = new BN(newState);

      const calculation = oldState.mod(bn2);
      console.log(calculation);
    } else {
    }
  };

  return (
    <div className="signature-tools-page-main" style={{ overflow: 'hidden' }}>
      <div className="signature-tools-result-item">
        <h6 className="signature-tools-tab-header">Point 2</h6>
        <Input
          className="signature-tools-main-input"
          type="text"
          placeholder="Enter Value"
          value={newState}
          onChange={(value: string) => setNewState(value.replace(/\s/g, ''))}
        />
      </div>
      <div className="signature-tools-result-item">
        <div className="flex-div"></div>
        <div className="signature-tools-result-item">
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" onClick={add}>
            +
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" onClick={() => {}}>
            -
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" onClick={() => {}}>
            X
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" onClick={() => {}}>
            /
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" onClick={() => {}}>
            %
          </Button>
        </div>
        <div className="signature-tools-result-item">
          <span>{oldState?.toString('hex')}</span> <br />
          <span>{oldState?.toString()}</span>
        </div>
      </div>
    </div>
  );
};
