import React, { useEffect, useState } from 'react';
import WizData from '@script-wiz/wiz-data';
import { Checkbox, Form, Input, InputGroup, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import { crypto } from '@script-wiz/lib-core';
import { CONVERT_TYPE } from '../../utils/enum/CONVERT_TYPE';
import { HELPER_ERROR_MESSAGE } from '../../utils/enum/HELPER_ERROR_MESSAGE';
import { convertBase64, reverseHex, validBin, validBytes, validHex, validNumber } from '../../utils/helper';
import CopyIcon from '../../Svg/Icons/Copy';
import CloseIcon from '../../Svg/Icons/Close';
import './Helper.scss';

type Result = {
  hexResult: string;
  hexLeResult: string;
  binResult: string;
  binLeResult: string;
  bytesResult: string;
  bytesLeResult: string;
  numberResult?: string;
  base64Result: string;
  sha256Result: string;
  hash160Result: string;
  textResult: string;
};

const initialState = {
  hexResult: '',
  hexLeResult: '',
  binResult: '',
  binLeResult: '',
  bytesResult: '',
  bytesLeResult: '',
  numberResult: '',
  base64Result: '',
  sha256Result: '',
  hash160Result: '',
  textResult: '',
};

export const Helper = () => {
  const [input, setInput] = useState<string>('');
  const [convertedWizData, setConvertedWizData] = useState<Result>(initialState);
  const [convertType, setConvertType] = useState<CONVERT_TYPE>(CONVERT_TYPE.FROM_HEX);
  const [errorMessage, setErrorMessage] = useState<HELPER_ERROR_MESSAGE | undefined>(undefined);
  const [checkedLe, setCheckedLe] = useState<boolean>();

  useEffect(() => {
    const getResults = (wizdataInput: WizData) => {
      let hexResult = '';
      let hexLeResult = '';
      let binResult = '';
      let binLeResult = '';
      let bytesResult = '';
      let bytesLeResult = '';
      let numberResult = '';
      let base64Result = '';
      let sha256Result = '';
      let hash160Result = '';

      const reverseHexValue = reverseHex(wizdataInput.hex);

      const wizdata = checkedLe ? WizData.fromHex(reverseHexValue) : wizdataInput;
      const wizdataReverse = checkedLe ? wizdataInput : WizData.fromHex(reverseHexValue);

      if (convertType === CONVERT_TYPE.FROM_HEX) {
        hexResult = wizdata.hex;
        hexLeResult = wizdataReverse.hex;
        binResult = wizdataReverse.bin;
        binLeResult = wizdata.bin;
        bytesResult = wizdata.bytes.join(',');
        bytesLeResult = wizdataReverse.bytes.join(',');
        numberResult = wizdataReverse.number?.toString() || '';
        base64Result = convertBase64(wizdata.hex);
        sha256Result = crypto.sha256v2(wizdata);
        hash160Result = crypto.hash160v2(wizdata);
      }

      if (convertType === CONVERT_TYPE.FROM_NUMBER) {
        hexResult = wizdataReverse.hex;
        hexLeResult = wizdata.hex;
        binResult = wizdata.bin;
        binLeResult = wizdataReverse.bin;
        bytesResult = wizdataReverse.bytes.join(',');
        bytesLeResult = wizdata.bytes.join(',');
        numberResult = wizdata.number?.toString() || '';
        base64Result = convertBase64(wizdataReverse.hex);
        sha256Result = crypto.sha256v2(wizdataReverse);
        hash160Result = crypto.hash160v2(wizdataReverse);
      }

      if (convertType === CONVERT_TYPE.FROM_BYTES) {
        hexResult = wizdata.hex;
        hexLeResult = wizdataReverse.hex;
        binResult = wizdataReverse.bin;
        binLeResult = wizdata.bin;
        bytesResult = wizdata.bytes.join(',');
        bytesLeResult = wizdataReverse.bytes.join(',');
        numberResult = wizdata.number?.toString() || '';
        base64Result = convertBase64(wizdata.hex);
        sha256Result = crypto.sha256v2(wizdata);
        hash160Result = crypto.hash160v2(wizdata);
      }

      if (convertType === CONVERT_TYPE.FROM_BIN) {
        hexResult = wizdataReverse.hex;
        hexLeResult = wizdata.hex;
        binResult = wizdata.bin;
        binLeResult = wizdataReverse.bin;
        bytesResult = wizdataReverse.bytes.join(',');
        bytesLeResult = wizdata.bytes.join(',');
        numberResult = wizdata.number?.toString() || '';
        base64Result = convertBase64(wizdataReverse.hex);
        sha256Result = crypto.sha256v2(wizdataReverse);
        hash160Result = crypto.hash160v2(wizdataReverse);
      }

      if (convertType === CONVERT_TYPE.FROM_TEXT) {
        hexResult = wizdata.hex;
        hexLeResult = wizdataReverse.hex;
        binResult = wizdataReverse.bin;
        binLeResult = wizdata.bin;
        bytesResult = wizdata.bytes.join(',');
        bytesLeResult = wizdataReverse.bytes.join(',');
        numberResult = wizdataReverse.number?.toString() || '';
        base64Result = convertBase64(wizdata.hex);
        sha256Result = crypto.sha256v2(wizdata);
      }

      const textResult = wizdata.text || '';

      setConvertedWizData({
        hexResult,
        hexLeResult,
        binResult,
        binLeResult,
        bytesResult,
        bytesLeResult,
        numberResult,
        base64Result,
        sha256Result,
        hash160Result,
        textResult,
      });
    };

    const handleConvert = () => {
      let wizData: WizData | undefined;
      let errorMessageText = undefined;

      if (convertType === CONVERT_TYPE.FROM_BIN) {
        if (!validBin(input)) {
          setConvertedWizData(initialState);
          errorMessageText = HELPER_ERROR_MESSAGE.BIN_ERROR;
        } else {
          wizData = WizData.fromBin(input);
          getResults(wizData);
        }
      }

      if (convertType === CONVERT_TYPE.FROM_HEX) {
        if (!validHex(input)) {
          setConvertedWizData(initialState);
          errorMessageText = HELPER_ERROR_MESSAGE.HEX_ERROR;
        } else {
          wizData = WizData.fromHex(input);
          getResults(wizData);
        }
      }

      if (convertType === CONVERT_TYPE.FROM_NUMBER) {
        if (!validNumber(Number(input))) {
          setConvertedWizData(initialState);
          errorMessageText = HELPER_ERROR_MESSAGE.NUMBER_ERROR;
        } else {
          wizData = WizData.fromNumber(parseInt(input));
          getResults(wizData);
        }
      }

      if (convertType === CONVERT_TYPE.FROM_TEXT) {
        wizData = WizData.fromText(input);
        getResults(wizData);
      }

      if (convertType === CONVERT_TYPE.FROM_BYTES) {
        const stringToArray = input.split(',');
        const convertNumberArray = stringToArray.map((str) => Number(str));
        if (!validBytes(convertNumberArray)) {
          setConvertedWizData(initialState);
          errorMessageText = HELPER_ERROR_MESSAGE.BYTE_ERROR;
        } else {
          const uint8Array = new Uint8Array(convertNumberArray);
          wizData = WizData.fromBytes(uint8Array);
          getResults(wizData);
        }
      }

      setErrorMessage(errorMessageText);
    };

    if (input !== '') {
      handleConvert();
    } else {
      setConvertedWizData(initialState);
      setErrorMessage(undefined);
    }
  }, [convertType, input, checkedLe]);

  const inputLength = input.replace(/,/g, '').length;

  const byteLength = convertedWizData.bytesLeResult ? convertedWizData.bytesResult.split(',').length : '';

  const hexLength = convertedWizData.hexResult ? convertedWizData.hexResult.length.toString() : '';

  const splittedBinResult =
    convertedWizData.binResult.substring(0, 8) + ' ' + convertedWizData.binResult.substring(8, convertedWizData.binResult.length);

  const splittedtBinLeReult =
    convertedWizData.binLeResult.substring(0, 8) + ' ' + convertedWizData.binLeResult.substring(8, convertedWizData.binResult.length);

  return (
    <div className="helper-page-main">
      <div className="helper-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={convertType}
          // onChange={(value: CONVERT_TYPE) => {
          //   setConvertType(value);
          // }}
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
                <Checkbox className="helper-le-checkbox" value="LE" onChange={(value, checked) => setCheckedLe(checked)}>
                  LE
                </Checkbox>
              ) : null}
            </div>

            <InputGroup inside>
              <Input className="helper-main-input" type="text" value={input} onChange={(value: string) => setInput(value.replace(/\s/g, ''))} />
              <InputGroup.Button
                onClick={() => {
                  setConvertedWizData(initialState);
                  setErrorMessage(undefined);
                  setInput('');
                }}
              >
                <CloseIcon />
              </InputGroup.Button>
            </InputGroup>
            <div className="helper-tab-info">
              <div>
                <span>Input Length: </span>
                <span>{inputLength}</span>
              </div>
              {errorMessage ? <div className="helper-error-message">{errorMessage}</div> : null}
            </div>
          </div>
        </Form>
        <div className="helper-content">
          <div className="helper-tab-item">
            <div className="helper-result-text">
              <div className="helper-result-item">
                <h6 className="helper-tab-header">HEX</h6>
                <div>
                  <InputGroup className="compile-modal-input-group">
                    <Input value={convertedWizData.hexResult} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>HEX has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.hexResult)}>
                        <CopyIcon />
                      </InputGroup.Button>
                    </Whisper>
                  </InputGroup>
                </div>
                <div className="helper-item-length">
                  <span>Hex Length: </span>
                  <span>{hexLength}</span>
                </div>
              </div>

              <div className="helper-result-item">
                <div>
                  <h6 className="helper-tab-header">BYTES</h6>
                  <InputGroup className="compile-modal-input-group">
                    <Input value={convertedWizData.bytesResult} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>BYTES has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.bytesResult)}>
                        <CopyIcon />
                      </InputGroup.Button>
                    </Whisper>
                  </InputGroup>
                </div>
                <div className="helper-item-length">
                  <span>Byte Length: </span>
                  <span>{byteLength}</span>
                </div>
              </div>

              <div className="helper-result-item">
                <h6 className="helper-tab-header">BIN</h6>
                <InputGroup className="compile-modal-input-group">
                  <Input value={splittedBinResult} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>BIN has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.binResult)}>
                      <CopyIcon />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
            <div className="helper-result-text">
              <div className="helper-result-item helper-mb">
                <h6 className="helper-tab-header">HEX LE</h6>
                <div>
                  <InputGroup className="compile-modal-input-group">
                    <Input value={convertedWizData.hexLeResult} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>HEX LE has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.hexLeResult)}>
                        <CopyIcon />
                      </InputGroup.Button>
                    </Whisper>
                  </InputGroup>
                </div>
              </div>

              <div className="helper-result-item helper-mb">
                <div>
                  <h6 className="helper-tab-header">BYTES LE</h6>
                  <InputGroup className="compile-modal-input-group">
                    <Input value={convertedWizData.bytesLeResult} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>BYTES LE has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.bytesLeResult)}>
                        <CopyIcon />
                      </InputGroup.Button>
                    </Whisper>
                  </InputGroup>
                </div>
              </div>

              <div className="helper-result-item">
                <h6 className="helper-tab-header">BIN LE</h6>
                <InputGroup className="compile-modal-input-group">
                  <Input value={splittedtBinLeReult} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>BIN LE has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.binLeResult)}>
                      <CopyIcon />
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
                <Input value={convertedWizData.numberResult || ''} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>NUMBER has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button
                    onClick={() => navigator.clipboard.writeText(convertedWizData.numberResult ? convertedWizData.numberResult : '')}
                  >
                    <CopyIcon />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">SHA256</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertedWizData.sha256Result} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>SHA256 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.sha256Result)}>
                    <CopyIcon />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>

            <div className="helper-result-item">
              <h6 className="helper-tab-header">HASH160</h6>
              <InputGroup className="compile-modal-input-group">
                <Input value={convertedWizData.hash160Result} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>HASH160 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.hash160Result)}>
                    <CopyIcon />
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
                    <Input value={convertedWizData.textResult || ''} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>TEXT has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.textResult || '')}>
                        <CopyIcon />
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
                  <Input value={convertedWizData.base64Result} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>BASE 64 has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(convertedWizData.base64Result)}>
                      <CopyIcon />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
