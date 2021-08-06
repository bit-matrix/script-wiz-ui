/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { Button, ControlLabel, Form, FormGroup, Input, Modal, Radio, RadioGroup } from 'rsuite';
import { convertEditorLines } from '../../helper';
import { ScriptWiz, VM_NETWORK, WizData } from '@script-wiz/lib';
import { initialBitcoinEditorValue, initialLiquidEditorValue } from './ScriptEditorInput/initialEditorValue';
import './ScriptEditor.scss';

type Props = {
  scriptWiz: ScriptWiz;
};

enum KeyPath {
  UNKNOWN = 'unknown',
  CUSTOM = 'custom',
}

enum TapleafVersion {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

const initialLineStackDataListArray: Array<Array<WizData>> = [];
const initialLastStackDataList: Array<WizData> = [];

const toHexString = (bytes: Uint8Array | null): string => (bytes ? bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '') : '');

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [lastStackDataList, setLastStackDataList] = useState<Array<WizData>>(initialLastStackDataList);

  const [compileModalData, setCompileModalData] = useState<{
    show: boolean;
    data?: string;
  }>({ show: false });

  const [keyPath, setKeyPath] = useState<KeyPath>(KeyPath.CUSTOM);
  const [tapleafVersion, setTapleafVersion] = useState<TapleafVersion>(TapleafVersion.DEFAULT);
  const [pubKeyInput, setPubKeyInput] = useState<string>('');
  const [tweakInput, setTweakInput] = useState<string>('');
  const [tapleafInput, setTapleafInput] = useState<string>('');
  const [tweakedResult, setTweakedResult] = useState<string>('');

  const pubkeyDefaultValue: string = '021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624';
  const tapleafDefaultValue: string = '0xc0';

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      let lines = convertEditorLines(scriptWiz.vm.network === VM_NETWORK.BTC ? initialBitcoinEditorValue : initialLiquidEditorValue);
      compile(lines);

      if ((pubKeyInput.length >= 64 && tweakInput.length >= 64) || (keyPath === KeyPath.UNKNOWN && tweakInput.length >= 64)) {
        taprootCompile();
      } else if ((pubKeyInput.length < 64 && pubKeyInput.length > 0) || (tweakInput.length < 64 && tweakInput.length > 0)) {
        setTweakedResult('Invalid Result');
      } else {
        setTweakedResult('');
      }
    }

    return () => {
      unmounted = true;
    };
  }, [scriptWiz.vm.network, pubKeyInput, tweakInput, keyPath]);

  const compile = (lines: string[]) => {
    scriptWiz.clearStackDataList();
    let hasError: boolean = false;

    const newLineStackDataListArray: Array<Array<WizData>> = [];
    let newLastStackDataList: Array<WizData> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // console.log(i, line);

      if (line !== '') {
        parseInput(line);

        const parsed = scriptWiz.stackDataList.main;

        // @To-do scriptWiz error message
        const scriptWizErrorMessage = scriptWiz.stackDataList.errorMessage;

        if (!hasError) {
          newLastStackDataList = parsed;
          newLineStackDataListArray.push(newLastStackDataList);

          if (scriptWizErrorMessage) {
            hasError = true;
            setErrorMessage(scriptWizErrorMessage);
          }
        }
      } else {
        if (!hasError) newLineStackDataListArray.push([]);
      }
    }

    setLineStackDataListArray(newLineStackDataListArray);
    setLastStackDataList(newLastStackDataList);
    // console.log(scriptWiz.stackDataList);
  };

  const parseInput = (inputText: string) => {
    if (inputText.startsWith('<') && inputText.endsWith('>')) {
      const inputTextValue = inputText.substring(1, inputText.length - 1);

      if (inputTextValue.startsWith('0x')) {
        scriptWiz.parseHex(inputTextValue.substring(2));
      } else if (inputTextValue.startsWith('0b')) {
        scriptWiz.parseBin(inputTextValue.substring(2));
      } else if (
        (inputTextValue.startsWith('"') && inputTextValue.endsWith('"')) ||
        (inputTextValue.startsWith("'") && inputTextValue.endsWith("'"))
      ) {
        const inputTextValueString = inputTextValue.substring(1, inputTextValue.length - 1);
        scriptWiz.parseText(inputTextValueString);
      } else if (!isNaN(Number(inputTextValue))) {
        scriptWiz.parseNumber(Number(inputTextValue));
      } else if (inputTextValue.startsWith('OP_')) {
        const opwordToOphex = scriptWiz.opCodes.wordHex(inputTextValue);
        scriptWiz.parseHex(opwordToOphex.substring(2));
      } else {
        console.error('UI: Invalid input value!!!');
      }
    } else {
      scriptWiz.parseOpcode(inputText);
    }
  };

  const compileScripts = () => {
    const compileScript = scriptWiz.compile();
    setCompileModalData({ show: true, data: compileScript });
  };

  const taprootCompile = () => {
    const promise = import('tiny-secp256k1');
    promise
      .then((a) => {
        const compressed: boolean = true;

        // const pubkeyString: string = '021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624';
        // const tweakString: string = '542d433b81daf3e28069bccbb0d951d7d9ca57cc0f563f2de126e91deba7d6a6';
        // const testResultString: string = '0326fef75b96729c1753eeac93309ae90c8a06192ea5b1b13175e239743ec11c4a';

        const pubkeyString: string = keyPath === KeyPath.UNKNOWN ? pubkeyDefaultValue : pubKeyInput;
        const tweakString: string = tweakInput;
        const testResultString: string = '0326fef75b96729c1753eeac93309ae90c8a06192ea5b1b13175e239743ec11c4a';

        const pubkey: Uint8Array = WizData.fromHex(pubkeyString).bytes;
        const tweak: Uint8Array = WizData.fromHex(tweakString).bytes;
        const testResult: Uint8Array = WizData.fromHex(testResultString).bytes;

        const result: Uint8Array | null = a.pointAddScalar(pubkey, tweak, compressed);

        const resultString: string = toHexString(result);
        setTweakedResult(resultString);

        console.log(resultString);
        console.log(testResultString);
        console.log(toHexString(result) === toHexString(testResult));

        return result;
      })
      .catch(() => {
        setTweakedResult('Invalid Result');
      });
  };

  return (
    <>
      <Modal size="sm" show={compileModalData.show} backdrop={false} onHide={() => setCompileModalData({ show: false })}>
        <Modal.Header />
        <Modal.Body>
          <h5 className="compile-modal-item">Compile Result</h5>
          <p className="compile-data-p">{compileModalData.data}</p>
          <Form fluid>
            <h5 className="compile-modal-item">Taproot Output</h5>
            <div>
              <ControlLabel style={{ display: 'block' }}>Key-path:</ControlLabel>
              <RadioGroup
                inline
                value={keyPath}
                onChange={(value: KeyPath) => {
                  setKeyPath(value);
                }}
              >
                <Radio value={KeyPath.UNKNOWN}>Unknown discrete logarithm</Radio>
                <Radio value={KeyPath.CUSTOM}>Custom</Radio>
              </RadioGroup>
              <div className="compile-modal-item">
                <ControlLabel>Public Key as HEX string:</ControlLabel>
                <Input
                  disabled={keyPath === KeyPath.UNKNOWN}
                  value={keyPath === KeyPath.UNKNOWN ? pubkeyDefaultValue : pubKeyInput}
                  onChange={(value: string, event: React.SyntheticEvent<HTMLElement, Event>) => {
                    setPubKeyInput(value);
                  }}
                />
              </div>
              <div className="compile-modal-item">
                <ControlLabel>Tweak as HEX string:</ControlLabel>
                <Input
                  value={tweakInput}
                  onChange={(value: string) => {
                    setTweakInput(value);
                  }}
                />
              </div>
            </div>

            <div className="compile-modal-item">
              <ControlLabel style={{ display: 'block' }}>Tapleaf version:</ControlLabel>
              <RadioGroup
                inline
                value={tapleafVersion}
                onChange={(value: TapleafVersion) => {
                  setTapleafVersion(value);
                }}
              >
                <Radio value={TapleafVersion.DEFAULT}>Default</Radio>
                <Radio value={TapleafVersion.CUSTOM}>Custom</Radio>
              </RadioGroup>

              <Input
                className="tapleaf-input"
                disabled={tapleafVersion === TapleafVersion.DEFAULT}
                value={tapleafVersion === TapleafVersion.DEFAULT ? tapleafDefaultValue : tapleafInput}
                onChange={(value: string, event: React.SyntheticEvent<HTMLElement, Event>) => {
                  setTapleafInput(value);
                }}
              />
            </div>

            <FormGroup>
              <h6>Tweak Result</h6>
              <div className="compile-modal-item">
                <ControlLabel>Tweaked key:</ControlLabel>
                <Input value={tweakedResult} />
              </div>
              <div className="compile-modal-item">
                <ControlLabel>ScriptPubkey:</ControlLabel>
                <Input value={tweakedResult} />
              </div>
              <div className="compile-modal-item">
                <ControlLabel>Bech32 address:</ControlLabel>
                <Input value={tweakedResult} />
              </div>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setCompileModalData({ show: false })} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <ScriptEditorHeader compileButtonClick={compileScripts} />
      <div className="script-editor-main-div scroll">
        <div className="script-editor-container">
          <div className="script-editor-sub-item">
            <ScriptEditorInput
              scriptWiz={scriptWiz}
              onChangeScriptEditorInput={(lines: string[]) => {
                setErrorMessage(undefined);
                setLineStackDataListArray(initialLineStackDataListArray);
                setLastStackDataList(initialLastStackDataList);
                compile(lines);
              }}
            />
          </div>
          <div className="script-editor-sub-item scroll">
            <ScriptEditorOutput lastStackDataList={lastStackDataList} lineStackDataListArray={lineStackDataListArray} errorMessage={errorMessage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptEditor;
