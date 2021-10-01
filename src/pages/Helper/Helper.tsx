import React, { useEffect, useState } from 'react';
import WizData from '@script-wiz/wiz-data';
import { Checkbox, Form, Icon, Input, InputGroup, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import { hash160v2, sha256v2 } from '@script-wiz/lib';
import './Helper.scss';

enum CONVERT_TYPE {
  FROM_HEX = 'From Hex',
  FROM_BIN = 'From Bin',
  FROM_NUMBER = 'From Number',
  FROM_TEXT = 'From Text',
  FROM_BYTES = 'From Bytes',
}

enum ERROR_MESSAGE {
  BIN_ERROR = 'Invalid bin string!',
  HEX_ERROR = 'Invalid hex string!',
  BYTE_ERROR = 'Invalid byte number!',
  NUMBER_ERROR = 'Invalid number!',
}

const validByte = (byte: number): boolean => 0 <= byte && byte <= 255;
const validBin = (bin: string): boolean => !/[^01]/u.test(bin) && bin.length % 8 === 0;
const validHex = (hex: string) => hex.length % 2 === 0 && !/[^a-fA-F0-9]/u.test(hex);
const validNumber = (number: number): boolean => !isNaN(number);
const validBytes = (bytes: number[]) => bytes.every(validByte) && bytes.every(validNumber);

export const Helper = () => {
  const [input, setInput] = useState<string>('');
  const [convertWizData, setConvertWizData] = useState<WizData>();
  const [convertType, setConvertType] = useState<CONVERT_TYPE>(CONVERT_TYPE.FROM_HEX);
  const [errorMessage, setErrorMessage] = useState<ERROR_MESSAGE | undefined>(undefined);

  useEffect(() => {
    const handleConvert = () => {
      let result: WizData | undefined;
      let errorMessageText = undefined;

      if (convertType === CONVERT_TYPE.FROM_BIN) {
        if (!validBin(input)) {
          setConvertWizData(undefined);
          errorMessageText = ERROR_MESSAGE.BIN_ERROR;
        } else {
          result = WizData.fromBin(input);
        }
      }
      if (convertType === CONVERT_TYPE.FROM_HEX) {
        if (!validHex(input)) {
          setConvertWizData(undefined);
          errorMessageText = ERROR_MESSAGE.HEX_ERROR;
        } else {
          result = WizData.fromHex(input);
        }
      }
      if (convertType === CONVERT_TYPE.FROM_NUMBER) {
        if (!validNumber(Number(input))) {
          setConvertWizData(undefined);
          errorMessageText = ERROR_MESSAGE.NUMBER_ERROR;
        } else {
          result = WizData.fromNumber(parseInt(input));
        }
      }
      if (convertType === CONVERT_TYPE.FROM_TEXT) {
        result = WizData.fromText(input);
      }
      if (convertType === CONVERT_TYPE.FROM_BYTES) {
        const stringToArray = input.split(',');
        const convertNumberArray = stringToArray.map((str) => Number(str));
        if (!validBytes(convertNumberArray)) {
          setConvertWizData(undefined);
          errorMessageText = ERROR_MESSAGE.BYTE_ERROR;
        } else {
          const uint8Array = new Uint8Array(convertNumberArray);
          result = WizData.fromBytes(uint8Array);
        }
      }
      setErrorMessage(errorMessageText);
      setConvertWizData(result);
    };
    if (input !== '') handleConvert();
  }, [convertType, input]);

  const inputlLeChange = () => {
    if (convertType === CONVERT_TYPE.FROM_HEX) {
      const leHex = WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).hex;
      setInput(leHex);
    }
    if (convertType === CONVERT_TYPE.FROM_BIN) {
      const leBin = WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).bin;
      setInput(leBin);
    }
    if (convertType === CONVERT_TYPE.FROM_BYTES) {
      const leBytes = convertWizData?.bytes.reverse();
      leBytes && setInput(leBytes?.toString());
    }
  };

  const base64Result = Buffer.from(convertWizData?.hex || '', 'base64').toString();

  const sha256Result = convertWizData && convertWizData?.hex !== '' ? sha256v2(convertWizData) : '';

  const hash160Result = convertWizData && convertWizData?.hex !== '' ? hash160v2(convertWizData) : '';

  const hexResult =
    convertType === CONVERT_TYPE.FROM_HEX ? convertWizData?.hex : WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).hex;

  const hexLeResult =
    convertType === CONVERT_TYPE.FROM_HEX ? WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).hex : convertWizData?.hex;

  const binResult =
    convertType === CONVERT_TYPE.FROM_BIN ? convertWizData?.bin : WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).bin;

  const binLeResult =
    convertType === CONVERT_TYPE.FROM_BIN ? WizData.fromBytes(Buffer.from(convertWizData?.hex || '', 'hex').reverse()).bin : convertWizData?.bin;

  const bytesResult = convertType === CONVERT_TYPE.FROM_BYTES ? convertWizData?.bytes.reverse() : convertWizData?.bytes;

  const bytesLeResult = convertType === CONVERT_TYPE.FROM_BYTES ? convertWizData?.bytes : convertWizData?.bytes.reverse();

  const numberResult = convertType === CONVERT_TYPE.FROM_NUMBER ? convertWizData?.number : parseInt(convertWizData?.hex || '', 16);

  return (
    <div className="helper-page-main">
      <div className="helper-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={convertType}
          onChange={(value: CONVERT_TYPE) => {
            setConvertType(value);
          }}
        >
          <Radio value={CONVERT_TYPE.FROM_HEX}>{CONVERT_TYPE.FROM_HEX}</Radio>
          <Radio value={CONVERT_TYPE.FROM_BIN}>{CONVERT_TYPE.FROM_BIN}</Radio>
          <Radio value={CONVERT_TYPE.FROM_BYTES}>{CONVERT_TYPE.FROM_BYTES}</Radio>
          <Radio value={CONVERT_TYPE.FROM_NUMBER}>{CONVERT_TYPE.FROM_NUMBER}</Radio>
          <Radio value={CONVERT_TYPE.FROM_TEXT}>{CONVERT_TYPE.FROM_TEXT}</Radio>
        </RadioGroup>
      </div>

      <div className="helper-page-item">
        <Form>
          <div className="helper-input-text">
            <div className="helper-tab-header-container">
              <h6 className="helper-tab-header">{convertType}</h6>
              {convertType === CONVERT_TYPE.FROM_BIN || convertType === CONVERT_TYPE.FROM_BYTES || convertType === CONVERT_TYPE.FROM_HEX ? (
                <Checkbox value="LE" onChange={inputlLeChange}>
                  LE
                </Checkbox>
              ) : null}
            </div>
            <Input className="helper-main-input" type="text" value={input} onChange={(value: string) => setInput(value.replace(/\s/g, ''))} />
            <div className="helper-tab-info">
              <div>
                <span>Input Length: </span>
                <span>{input.length}</span>
              </div>
              {errorMessage ? <div className="helper-error-message">{errorMessage}</div> : null}
            </div>
          </div>
        </Form>
        <div className="helper-tab-item">
          <div className="helper-result-text">
            <div className="helper-result-item">
              <h6 className="helper-tab-header">HEX</h6>
              <div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={hexResult || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>HEX has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.hex || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="helper-item-length">
                <span>Hex Length: </span>
                <span>{convertWizData ? convertWizData.hex?.length.toString() : ''}</span>
              </div>
            </div>

            <div className="helper-result-item">
              <div>
                <h6 className="helper-tab-header">BYTES</h6>
                <InputGroup className="compile-modal-input-group">
                  <Input value={bytesResult?.toString() || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>BYTES has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(bytesResult?.toString() || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="helper-item-length">
                <span>Byte Length: </span>
                <span>{convertWizData ? convertWizData.bytes?.length.toString() : ''}</span>
              </div>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">BIN</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={binResult || ''} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>BIN has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.bin || '')}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
          <div className="helper-result-text">
            <div className="helper-result-item helper-mb">
              <h6 className="helper-tab-header">HEX LITTLE ENDIAN</h6>
              <div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={hexLeResult} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>HEX LITTLE ENDIAN has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(hexLeResult || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>

            <div className="helper-result-item helper-mb">
              <div>
                <h6 className="helper-tab-header">BYTES LITTLE ENDIAN</h6>
                <InputGroup className="compile-modal-input-group">
                  <Input value={bytesLeResult?.toString() || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>BYTES LITTLE ENDIAN has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(bytesLeResult?.toString() || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">BIN LITTLE ENDIAN</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={binLeResult || ''} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>BIN LITTLE ENDIAN has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(binLeResult || '')}>
                    <Icon icon="copy" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </div>
        </div>
        <div className="helper-long-items">
          <div className="helper-result-item">
            <h6 className="helper-tab-header">NUMBER</h6>
            <InputGroup className="compile-modal-input-group">
              <Input value={numberResult ? numberResult.toString() : ''} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>NUMBER has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.number?.toString() || '')}>
                  <Icon icon="copy" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>
          </div>

          <div className="helper-result-item">
            <h6 className="helper-tab-header">SHA256</h6>
            <InputGroup className="compile-modal-input-group">
              <Input value={sha256Result} disabled />
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
              <Input value={hash160Result} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>HASH160 has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData ? hash160v2(convertWizData) : '')}>
                  <Icon icon="copy" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>
          </div>
        </div>
        <div className="helper-footer-items">
          <div className="helper-result-text">
            <div className="helper-result-item">
              <h6 className="helper-tab-header">TEXT</h6>
              <div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={convertWizData?.text || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>TEXT has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertWizData?.text || '')}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="helper-result-text">
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
          </div>
        </div>
      </div>
    </div>
  );
};
