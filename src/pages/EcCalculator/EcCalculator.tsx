import React, { useState } from 'react';
import { Button, Input, InputGroup, Tooltip, Whisper, Nav, RadioGroup, Radio } from 'rsuite';
import CopyIcon from '../../components/Svg/Icons/Copy';
import { Point } from '@noble/secp256k1';
import bcrypto from 'bcrypto';
import { ValueType } from 'rsuite/esm/Radio';

export const EcCalculator = () => {
  const [tab, setTab] = useState(0);
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [mulResult, setMulResult] = useState({ x: '', y: '' });
  const [addResult, setAddResult] = useState({ x: '', y: '' });
  const [x, setX] = useState('');
  const [y, setY] = useState<{ isOdd: boolean; y: string }>();

  const pointMultiplation = () => {
    try {
      const data = Point.fromHex(point1).multiply(BigInt('0x' + point2));
      setMulResult({ x: data.x.toString(16), y: data.y.toString(16) });
    } catch (error) {
      console.log(error);
    }
  };

  const pointAdd = () => {
    try {
      const data = Point.fromHex(point1).add(Point.fromHex(point2));
      setAddResult({ x: data.x.toString(16), y: data.y.toString(16) });
    } catch (error) {
      console.log(error);
    }
  };

  const fromX = () => {
    try {
      const p = Point.fromHex(x);
      console.log(p.y.toString(16));
      console.log(p.negate().y.toString(16));

      const pub = bcrypto.secp256k1.publicKeyExport(Buffer.from(x, 'hex'));
      console.log(pub.y.toString('hex'));
      setY({ isOdd: true, y: '00' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signature-tools-page-main" style={{ overflow: 'hidden' }}>
      <div className="signature-tools-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={tab}
          onChange={(value: ValueType) => {
            setTab(Number(value));
          }}
        >
          <Radio value={0}>POINT MULTIPILATION</Radio>
          <Radio value={1}>POINT ADDITION</Radio>
          <Radio value={2}>Y FROM X</Radio>
        </RadioGroup>
      </div>
      {tab !== 2 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Point 1</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder="Point 1 Value (hex)"
              value={point1}
              onChange={(value: string) => setPoint1(value.replace(/\s/g, ''))}
            />
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Point 2</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder="Point 2 Value (hex)"
              value={point2}
              onChange={(value: string) => setPoint2(value.replace(/\s/g, ''))}
            />
          </div>
        </>
      )}

      {tab === 0 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Multiplation Result X</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={mulResult.x} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(mulResult.x)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Multiplation Result Y</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={mulResult.y} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(mulResult.y)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
          <div className="signature-tools-result-item">
            <Button className="signature-tools-button" appearance="primary" size="md" onClick={pointMultiplation}>
              X Mul
            </Button>
          </div>
        </>
      )}

      {tab === 1 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Addition Result X</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={addResult.x} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(addResult.x)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Addition Result Y</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={addResult.y} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(addResult.y)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
          <div className="signature-tools-result-item">
            <Button className="signature-tools-button" appearance="primary" size="md" onClick={pointAdd}>
              + Add
            </Button>
          </div>
        </>
      )}

      {tab === 2 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">X Axis Value</h6>
            <div>
              <Input
                className="signature-tools-main-input"
                type="text"
                placeholder="X axis value (hex)"
                value={x}
                onChange={(value: string) => setX(value.replace(/\s/g, ''))}
              />
            </div>
          </div>
          <div className="signature-tools-result-item">
            <Button className="signature-tools-button" appearance="primary" size="md" onClick={fromX}>
              Get Y axis information
            </Button>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Y Axis</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={y?.y} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(y?.y || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <span>X axis is {y?.isOdd ? 'odd' : 'even'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
