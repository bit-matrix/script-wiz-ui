import React, { useState } from 'react';
import WizData from '@script-wiz/wiz-data';
import { Button, Form, Icon, Input, InputGroup, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import { hash160v2, sha256v2 } from '@script-wiz/lib';
import './Helper.scss';

enum CONVERT_TYPE {
  FROM_HEX = 'From Hex',
  FROM_BIN = 'From Bin',
  FROM_NUMBER = 'From Number',
  FROM_TEXT = 'From Text',
}

export const Helper = () => {
  const [input, setInput] = useState<string>('');
  const [convertWizData, setConvertWizData] = useState<WizData>();
  const [convertType, setConvertType] = useState<CONVERT_TYPE>(CONVERT_TYPE.FROM_HEX);

  const handleConvert = () => {
    let result: WizData | undefined;
    if (convertType === CONVERT_TYPE.FROM_BIN) {
      result = WizData.fromBin(input);
    }
    if (convertType === CONVERT_TYPE.FROM_HEX) {
      result = WizData.fromHex(input);
    }
    if (convertType === CONVERT_TYPE.FROM_NUMBER) {
      result = WizData.fromNumber(parseInt(input));
    }
    if (convertType === CONVERT_TYPE.FROM_TEXT) {
      result = WizData.fromText(input);
    }
    setConvertWizData(result);
  };

  const setInputType = () => {
    if (convertType === CONVERT_TYPE.FROM_HEX || convertType === CONVERT_TYPE.FROM_TEXT) return 'text';
    return 'number';
  };

  const leBeReverseResult = WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).hex;

  const base64Result = Buffer.from(convertWizData?.hex || '', 'base64').toString();

  return (
    <div className="helper-page-main">
      <div className="helper-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={convertType}
          onChange={(value: CONVERT_TYPE) => {
            setConvertWizData(undefined);
            setConvertType(value);
          }}
        >
          <Radio value={CONVERT_TYPE.FROM_HEX}>{CONVERT_TYPE.FROM_HEX}</Radio>
          <Radio value={CONVERT_TYPE.FROM_BIN}>{CONVERT_TYPE.FROM_BIN}</Radio>
          <Radio value={CONVERT_TYPE.FROM_NUMBER}>{CONVERT_TYPE.FROM_NUMBER}</Radio>
          <Radio value={CONVERT_TYPE.FROM_TEXT}>{CONVERT_TYPE.FROM_TEXT}</Radio>
        </RadioGroup>
      </div>
      <div className="helper-page-item">
        <Form>
          <div className="helper-input-text">
            <h6 className="helper-tab-header">{convertType}</h6>
            <div className="helper-page-input">
              <Input
                type={setInputType()}
                value={input}
                onChange={(value: string) => {
                  setConvertWizData(undefined);
                  setInput(value);
                }}
              />
              <Button className="helper-convert-button" appearance="primary" onClick={handleConvert}>
                Convert
              </Button>
            </div>
          </div>
        </Form>
        <div className="helper-tab-item">
          <div className="helper-result-text">
            <div className="helper-result-item">
              <h6 className="helper-tab-header">HEX</h6>
              <div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={convertWizData?.hex} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>HEX has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.hex || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="helper-result-sub">
                <div className="helper-result-sub-item-single">
                  <span>Hex Length 32:</span>
                  <Input value={((convertWizData?.hex?.length || 0) / 2).toString()} disabled />
                </div>
              </div>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">BIN</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertWizData?.bin} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>BIN has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.bin || '')}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">BYTES</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertWizData?.bytes.toString()} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>BYTES has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.bytes.toString() || '')}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">NUMBER</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertWizData?.number?.toString()} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>NUMBER has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.number?.toString() || '')}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">TEXT</h6>
              <div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={convertWizData?.text} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>TEXT has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.text || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="helper-result-sub">
                <div className="helper-result-sub-item-single">
                  <span>String Length 64:</span>
                  <Input value={convertWizData?.text?.length.toString()} disabled />
                </div>
              </div>
            </div>
          </div>
          <div className="helper-result-text">
            <div className="helper-result-item">
              <h6 className="helper-tab-header">LE - BE REVERSE</h6>
              <div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={leBeReverseResult} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>LE - BE REVERSE has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.text || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>

              <div className="helper-result-sub">
                <div className="helper-result-sub-item-left">
                  <span>LE - BE REVERSE Char Length:</span>
                  <Input value={convertWizData?.hex.length.toString()} disabled />
                </div>
                <div className="helper-result-sub-item-right">
                  <span>LE - BE REVERSE Byte Length:</span>
                  <Input value={((convertWizData?.hex.length || 0) / 2).toString()} disabled />
                </div>
              </div>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">BASE 64</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={base64Result} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>BASE 64 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(base64Result)}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">SHA256</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertWizData ? sha256v2(convertWizData) : ''} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>SHA256 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData ? sha256v2(convertWizData) : '')}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">HASH160</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertWizData ? hash160v2(convertWizData) : ''} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>HASH160 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData ? hash160v2(convertWizData) : '')}>
                    <Icon icon="copy" />
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
