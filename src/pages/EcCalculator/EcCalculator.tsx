import React, { useState } from 'react';
import { Button, Input, InputGroup, Tooltip, Whisper, RadioGroup, Radio, Checkbox } from 'rsuite';
import CopyIcon from '../../components/Svg/Icons/Copy';
import { Point, utils } from '@noble/secp256k1';
import { ValueType } from 'rsuite/esm/Radio';
import BN from 'bn.js';

const g = '79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798';

export const EcCalculator = () => {
  const [tab, setTab] = useState(0);
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [mulResult, setMulResult] = useState({ x: '', y: '' });
  const [addResult, setAddResult] = useState({ x: '', y: '' });
  const [x, setX] = useState('');
  const [y, setY] = useState<{ isOdd: boolean; y: string; y2: string }>();

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

      setY({ isOdd: true, y: p.y.toString(16), y2: p.negate().y.toString(16) });
    } catch (error) {
      console.log(error);
    }
  };

  // const mert = () => {
  //   const normal = utils._normalizePrivateKey;

  //   const point = Point.fromHex('d0864c071c0c3f1101dcd0f34ce20d2364f1db7e70f884077530780fb9e251af');
  //   const t = normal('877DF449BBD5DC304081FC653D3727EA7EFA1F89ACC5E19DA95FF9859FFA46F6');

  //   const Q = Point.BASE.multiplyAndAddUnsafe(point, t, BigInt(1));

  //   // console.log(Q?.y.toString(16));
  //   // console.log(Q?.x.toString(16));
  //   // const p = Point.fromHex(Q.x.toString(16));

  //   // console.log({ y: p.y.toString(16), y2: p.negate().y.toString(16) });
  // };

  //ref -> https://github.com/MrMaxweII/Secp256k1-Calculator/blob/c9374a8dab79a0b609c235b9c6e8c3ba290e410a/Calculator.java#L96
  const scalarMul = () => {
    const a = new BN(point1, 'hex');
    const b = new BN(point2, 'hex');
    const ORDNUNG = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 'hex');

    const xAxis = a.mul(b.mod(ORDNUNG)).mod(ORDNUNG);
    const xAxisHex = xAxis.toString('hex');

    const p = Point.fromHex(xAxisHex);

    setMulResult({ x: xAxisHex, y: p.y.toString(16) });
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
          <Radio value={0}>POINT MULTIPLICATION</Radio>
          <Radio value={1}>POINT ADDITION</Radio>
          <Radio value={2}>SCALAR MULTIPLICATION</Radio>
          <Radio value={3}>Y FROM X</Radio>
        </RadioGroup>
      </div>
      {tab !== 3 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">{tab !== 2 ? 'Point' : 'Scalar'}</h6>
            <div className="flex-div">
              <Input
                className="signature-tools-main-input"
                type="text"
                placeholder={tab !== 2 ? 'Point Value (hex)' : 'Scalar Value (hex)'}
                value={point1}
                style={{ width: tab !== 2 ? '90%' : '100%' }}
                onChange={(value: string) => setPoint1(value.replace(/\s/g, ''))}
              />
              {tab !== 2 && (
                <Checkbox
                  className="signature-tools-import-checkbox"
                  style={{ width: '10%' }}
                  onChange={(value, checked) => {
                    if (checked) {
                      setPoint1(g);
                    }
                  }}
                >
                  Fill G
                </Checkbox>
              )}
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Scalar</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder="Scalar Value (hex)"
              value={point2}
              onChange={(value: string) => setPoint2(value.replace(/\s/g, ''))}
            />
          </div>
        </>
      )}

      {(tab === 0 || tab === 2) && (
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
            <Button
              className="signature-tools-button"
              appearance="primary"
              size="md"
              onClick={() => {
                if (tab === 0) {
                  pointMultiplation();
                } else if (tab === 2) {
                  scalarMul();
                }
              }}
            >
              Multiply Points
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
              Addition Points
            </Button>
          </div>
        </>
      )}

      {tab === 3 && (
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
            <h6 className="signature-tools-tab-header">Y Axis Positive</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={y?.y} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(y?.y || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              {/* <span>X axis is {y?.isOdd ? 'odd' : 'even'}</span> */}
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Y Axis Negative</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={y?.y2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(y?.y2 || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              {/* <span>X axis is {y?.isOdd ? 'odd' : 'even'}</span> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
