import React, { useState } from 'react';
import BN from 'bn.js';
import { Button, Input, InputGroup, Tooltip, Whisper } from 'rsuite';
import CopyIcon from '../../components/Svg/Icons/Copy';

export const BitCalculator = () => {
  const [oldState, setOldState] = useState<BN>();
  const [newState, setNewState] = useState<string>('');

  const add = () => {
    if (oldState) {
      if (newState.startsWith('0x')) {
        const input = new BN(newState.substring(2), 'hex');

        const calculation = oldState.add(input);
        setOldState(calculation);
      } else {
        const input = new BN(Number(newState).toString(16), 'hex');
        const calculation = oldState.add(input);
        setOldState(calculation);
      }
    } else {
      if (newState.startsWith('0x')) {
        setOldState(new BN(newState.substring(2), 'hex'));
      } else {
        setOldState(new BN(Number(newState).toString(16), 'hex'));
      }
    }

    setNewState('');
  };

  const sub = () => {
    if (oldState) {
      if (newState.startsWith('0x')) {
        const input = new BN(newState.substring(2), 'hex');

        const calculation = oldState.sub(input);
        setOldState(calculation);
      } else {
        const input = new BN(Number(newState).toString(16), 'hex');
        const calculation = oldState.sub(input);
        setOldState(calculation);
      }
    } else {
      if (newState.startsWith('0x')) {
        setOldState(new BN(newState.substring(2), 'hex'));
      } else {
        setOldState(new BN(Number(newState).toString(16), 'hex'));
      }
    }

    setNewState('');
  };

  const mul = () => {
    if (oldState) {
      if (newState.startsWith('0x')) {
        const input = new BN(newState.substring(2), 'hex');

        const calculation = oldState.mul(input);
        setOldState(calculation);
      } else {
        const input = new BN(Number(newState).toString(16), 'hex');
        const calculation = oldState.mul(input);
        setOldState(calculation);
      }
    } else {
      if (newState.startsWith('0x')) {
        setOldState(new BN(newState.substring(2), 'hex'));
      } else {
        setOldState(new BN(Number(newState).toString(16), 'hex'));
      }
    }

    setNewState('');
  };

  const div = () => {
    if (oldState) {
      if (newState.startsWith('0x')) {
        const input = new BN(newState.substring(2), 'hex');

        const calculation = oldState.div(input);
        setOldState(calculation);
      } else {
        const input = new BN(Number(newState).toString(16), 'hex');
        const calculation = oldState.div(input);
        setOldState(calculation);
      }
    } else {
      if (newState.startsWith('0x')) {
        setOldState(new BN(newState.substring(2), 'hex'));
      } else {
        setOldState(new BN(Number(newState).toString(16), 'hex'));
      }
    }

    setNewState('');
  };

  const mod = () => {
    if (oldState) {
      if (newState.startsWith('0x')) {
        const input = new BN(newState.substring(2), 'hex');

        const calculation = oldState.mod(input);
        setOldState(calculation);
      } else {
        const input = new BN(Number(newState).toString(16), 'hex');
        const calculation = oldState.mod(input);
        setOldState(calculation);
      }
    } else {
      if (newState.startsWith('0x')) {
        setOldState(new BN(newState.substring(2), 'hex'));
      } else {
        setOldState(new BN(Number(newState).toString(16), 'hex'));
      }
    }

    setNewState('');
  };

  return (
    <div className="signature-tools-page-main" style={{ overflow: 'hidden' }}>
      <h3 className="signature-tools-tab-header" style={{ textAlign: 'center' }}>
        Big Number Calculator{' '}
      </h3>
      <div className="signature-tools-result-item">
        <h6 className="signature-tools-tab-header">Number or Hex</h6>
        <Input
          className="signature-tools-main-input"
          type="text"
          placeholder="Enter Value"
          value={newState}
          onChange={(value: string) => setNewState(value.replace(/\s/g, ''))}
        />
        <span>Hex values must start with "0x" prefix</span>
      </div>
      <div className="signature-tools-result-item">
        <div className="flex-div"></div>
        <div className="signature-tools-result-item">
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" disabled={newState === ''} onClick={add}>
            +
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" disabled={newState === ''} onClick={sub}>
            -
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" disabled={newState === ''} onClick={mul}>
            X
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" disabled={newState === ''} onClick={div}>
            /
          </Button>
          <Button className="signature-tools-button mr-5" appearance="primary" size="md" disabled={newState === ''} onClick={mod}>
            %
          </Button>
        </div>
        <div className="signature-tools-result-item">
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Result Hex </h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={oldState?.toString('hex')} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(oldState?.toString('hex') || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Result Number</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={oldState?.toString()} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(oldState?.toString() || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
