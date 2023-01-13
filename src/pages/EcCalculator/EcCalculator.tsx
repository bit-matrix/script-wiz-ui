import React, { useState } from 'react';
import { Button, Input, InputGroup, Tooltip, Whisper, RadioGroup, Radio, Checkbox } from 'rsuite';
import CopyIcon from '../../components/Svg/Icons/Copy';
import { Point } from '@noble/secp256k1';
import { ValueType } from 'rsuite/esm/Radio';
import BN from 'bn.js';
import { validHex } from '../../utils/helper';
import WizData from '@script-wiz/wiz-data';
import { taproot } from '@script-wiz/lib-core';
import { add, addition, neg, pow, SEVEN, sqrt, THREE } from './helper';
import bigInt from 'big-integer';

const ORDNUNG = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 'hex');
const g = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';

export const EcCalculator = () => {
  const [tab, setTab] = useState(0);
  const [point1, setPoint1] = useState('');
  const [point1y, setPoint1y] = useState('');
  const [point2, setPoint2] = useState('');
  const [point2y, setPoint2y] = useState('');
  const [mulResult, setMulResult] = useState({ x: '', y: '', isOdd: false });
  const [addResult, setAddResult] = useState({ x: '', y: '', isOdd: false });
  const [x, setX] = useState('');
  const [y, setY] = useState<{ y: string; y2: string }>();
  const [innerKey, setInnerKey] = useState<string>('');
  const [tapTweak, setTapTweak] = useState<string>('');
  const [tweakAddResult, setTweakAddResult] = useState<string>('');

  const pointMultiplation = () => {
    try {
      const data = Point.fromHex(point1).multiply(BigInt('0x' + point2));
      const yAxis = bigInt(data.y.toString(16), 16);
      // const yAxis = yfromX(data.x.toString(16));

      setMulResult({ x: data.x.toString(16), y: yAxis.toString(16), isOdd: yAxis.isOdd() });
    } catch (error) {
      console.log(error);
    }
  };

  const pointAdd = () => {
    try {
      //  const data = Point.fromHex(point1).add(Point.fromHex(point2));
      // const p1 = yfromX(point1);
      // const p2 = yfromX(point2);
      const a = bigInt(point1, 16);
      const a1 = bigInt(point1y, 16);
      const b = bigInt(point2, 16);
      const b1 = bigInt(point2y, 16);
      const xaxis = addition([a, a1], [b, b1]);

      setAddResult({ x: xaxis[0].toString(16), y: xaxis[1].toString(16), isOdd: xaxis[0].isOdd() });
    } catch (error) {
      console.log(error);
    }
  };

  const fromX = () => {
    try {
      const yAxis = yfromX(x);

      setY({ y: yAxis.axisOne, y2: yAxis.axisTwo });
    } catch (error) {
      console.log(error);
    }
  };

  //ref -> https://github.com/MrMaxweII/Secp256k1-Calculator/blob/c9374a8dab79a0b609c235b9c6e8c3ba290e410a/Calculator.java#L96
  const scalarMul = () => {
    const a = new BN(point1, 'hex');
    const b = new BN(point2, 'hex');

    const xAxis = a.mul(b.mod(ORDNUNG)).mod(ORDNUNG);
    const xAxisHex = xAxis.toString('hex');

    setMulResult({ x: xAxisHex, y: '', isOdd: false });
  };

  //ref -> https://github.com/MrMaxweII/Secp256k1-Calculator/blob/c9374a8dab79a0b609c235b9c6e8c3ba290e410a/Calculator.java#L90
  const scalarAdd = () => {
    const a = new BN(point1, 'hex');
    const b = new BN(point2, 'hex');

    const xAxis = a.add(ORDNUNG.add(b)).mod(ORDNUNG);
    const xAxisHex = xAxis.toString('hex');

    setAddResult({ x: xAxisHex, y: '', isOdd: false });
  };

  const checkInnerKeyValid = () => {
    return validHex(innerKey) && innerKey.length === 64;
  };

  const tweakAddCalc = () => {
    const innerKeyData = WizData.fromHex(innerKey);
    const tapTweakData = WizData.fromHex(tapTweak);
    const res = taproot.tweakAdd(innerKeyData, tapTweakData);
    setTweakAddResult(res.hex);
  };

  // ref -> https://github.com/MrMaxweII/Secp256k1-Calculator/blob/master/Secp256k1.java
  const yfromX = (input: string) => {
    const inputHex = bigInt(input, 16);
    const res = sqrt(add(pow(inputHex, THREE), SEVEN));
    const res2 = neg(sqrt(add(pow(inputHex, THREE), SEVEN)));

    if (res.isEven()) {
      return { axisOne: res.toString(16), axisTwo: res2.toString(16), y: res.toString(16) };
    } else {
      return { axisOne: res2.toString(16), axisTwo: res.toString(16), y: res2.toString(16) };
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
          <Radio value={0}>POINT MULTIPLICATION</Radio>
          <Radio value={1}>POINT ADDITION</Radio>
          <Radio value={2}>SCALAR MULTIPLICATION</Radio>
          <Radio value={3}>SCALAR ADDITION</Radio>
          <Radio value={4}>Y FROM X</Radio>
          <Radio value={5}>TWEAK ADD</Radio>
        </RadioGroup>
      </div>
      {tab < 4 && tab !== 1 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">{tab < 2 ? 'Point' : 'Scalar'}</h6>
            <div className="flex-div">
              <Input
                className="signature-tools-main-input"
                type="text"
                placeholder={tab < 2 ? 'Point Value (hex)' : 'Scalar Value (hex)'}
                value={point1}
                style={{ width: tab < 2 ? '90%' : '100%' }}
                onChange={(value: string) => setPoint1(value.replace(/\s/g, ''))}
              />
              {tab < 2 && (
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

      {tab === 1 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Point 1 X</h6>
            <div className="flex-div">
              <Input
                className="signature-tools-main-input"
                type="text"
                placeholder={'Point 1 X Value (hex)'}
                value={point1}
                style={{ width: '90%' }}
                onChange={(value: string) => setPoint1(value.replace(/\s/g, ''))}
              />

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
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Point 1 Y</h6>

            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder={'Point 1 Y Value (hex)'}
              value={point1y}
              style={{ width: '90%' }}
              onChange={(value: string) => setPoint1y(value.replace(/\s/g, ''))}
            />
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Point 2 X</h6>
            <div className="flex-div">
              <Input
                className="signature-tools-main-input"
                type="text"
                placeholder={'Point 2 X Value (hex)'}
                value={point2}
                onChange={(value: string) => setPoint2(value.replace(/\s/g, ''))}
              />

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
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Point 2 Y</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder={'Point 2 Y Value (hex)'}
              value={point2y}
              onChange={(value: string) => setPoint2y(value.replace(/\s/g, ''))}
            />
          </div>
        </>
      )}

      {(tab === 0 || tab === 2) && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Multiplation Result X </h6>
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
          {tab === 0 && (
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
                {mulResult.y && <span>Y axis is {mulResult.isOdd ? 'ODD' : 'EVEN'}</span>}
              </div>
            </div>
          )}

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

      {(tab === 1 || tab === 3) && (
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
          {tab === 1 && (
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
              {addResult.y && <span style={{ marginTop: '0.4rem' }}>Y axis is {addResult.isOdd ? 'ODD' : 'EVEN'}</span>}
            </div>
          )}

          <div className="signature-tools-result-item">
            <Button
              className="signature-tools-button"
              appearance="primary"
              size="md"
              onClick={() => {
                if (tab === 1) {
                  pointAdd();
                } else if (tab === 3) {
                  scalarAdd();
                }
              }}
            >
              Addition Points
            </Button>
          </div>
        </>
      )}

      {tab === 4 && (
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
            <h6 className="signature-tools-tab-header">Even Y Axis</h6>
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
            <h6 className="signature-tools-tab-header">Odd Y Axis</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={y?.y2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(y?.y2 || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              {/* <span>X axis is {y?.isOdd ? 'ODD' : 'EVEN'}</span> */}
            </div>
          </div>
        </>
      )}

      {tab === 5 && (
        <>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Inner Key (Hex)</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder="32-byte inner key"
              value={innerKey}
              onChange={(value: string) => setInnerKey(value.replace(/\s/g, ''))}
            />
            <div className="helper-tab-info">
              {!checkInnerKeyValid() && innerKey !== '' ? <div className="helper-error-message">Invalid Inner Key</div> : null}
            </div>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">TapTweak (Hex)</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              placeholder="32-byte tap tweak"
              value={tapTweak}
              onChange={(value: string) => setTapTweak(value.replace(/\s/g, ''))}
            />
          </div>
          <div className="signature-tools-result-item">
            <Button className="signature-tools-button" appearance="primary" size="md" onClick={tweakAddCalc}>
              Tweak Add
            </Button>
          </div>
          <div className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Tweak Add Result</h6>
            <div>
              <InputGroup className="signature-tools-compile-modal-input-group">
                <Input value={tweakAddResult} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakAddResult)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
