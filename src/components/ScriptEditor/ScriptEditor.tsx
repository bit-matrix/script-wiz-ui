import React, { useEffect, useState } from 'react';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { Button, Form, FormGroup, Icon, Input, InputGroup, Modal, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import { convertEditorLines } from '../../helper';
import { ScriptWiz, VM_NETWORK, WizData, tapRoot } from '@script-wiz/lib';
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

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [lastStackDataList, setLastStackDataList] = useState<Array<WizData>>(initialLastStackDataList);

  const [compileModalData, setCompileModalData] = useState<{
    show: boolean;
    data?: string;
  }>({ show: false });

  const [keyPath, setKeyPath] = useState<KeyPath>(KeyPath.UNKNOWN);
  const [tapleafVersion, setTapleafVersion] = useState<TapleafVersion>(TapleafVersion.DEFAULT);
  const [pubKeyInput, setPubKeyInput] = useState<string>('');
  const [tapleafInput, setTapleafInput] = useState<string>('');

  const [tweakedResult, setTweakedResult] = useState<string>('');

  const pubkeyDefaultValue: string = '021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624';

  const tapleafDefaultValue: string = '0xc0';

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      let lines = convertEditorLines(scriptWiz.vm.network === VM_NETWORK.BTC ? initialBitcoinEditorValue : initialLiquidEditorValue);
      compile(lines);
    }

    return () => {
      unmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm.network, pubKeyInput, keyPath]);

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

  useEffect(() => {
    const script = compileModalData.data?.substr(2) || scriptWiz.compile().substr(2);
    let pubkey = pubkeyDefaultValue;
    let version = undefined;

    if (keyPath === KeyPath.CUSTOM) pubkey = pubKeyInput;

    if (tapleafVersion === TapleafVersion.CUSTOM) version = tapleafInput.substr(2);

    if (
      (pubkey.length >= 64 && tapleafVersion === TapleafVersion.DEFAULT) ||
      (tapleafVersion === TapleafVersion.CUSTOM && version !== undefined && version?.length >= 2)
    ) {
      try {
        const result = tapRoot(pubkey, script, version);
        setTweakedResult(result);
      } catch {
        setTweakedResult('Invalid result');
      }
    } else if (pubKeyInput.length < 64 && pubKeyInput.length > 0) {
      setTweakedResult('Invalid Result');
    } else if (tapleafVersion === TapleafVersion.CUSTOM && version !== undefined && version.length < 4) {
      setTweakedResult('Invalid Result');
    } else {
      setTweakedResult('');
    }
  }, [compileModalData.data, keyPath, pubKeyInput, scriptWiz, tapleafInput, tapleafVersion]);

  return (
    <>
      <Modal size="sm" show={compileModalData.show} backdrop={false} onHide={() => setCompileModalData({ show: false })}>
        <Modal.Header />
        <Modal.Body className="compile-modal-body scroll">
          <h5 className="compile-modal-item">Compile Result</h5>
          <p className="compile-data-p">{compileModalData.data}</p>
          <Form fluid>
            <h5 className="compile-modal-item">Taproot Output</h5>
            <div>
              <div className="compile-modal-label">Key-path:</div>
              <RadioGroup
                className="compile-modal-radio-group"
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
                <div className="compile-modal-label">Public Key as HEX string:</div>
                <Input
                  disabled={keyPath === KeyPath.UNKNOWN}
                  value={keyPath === KeyPath.UNKNOWN ? pubkeyDefaultValue : pubKeyInput}
                  onChange={(value: string) => {
                    setPubKeyInput(value);
                  }}
                />
              </div>
            </div>

            <div className="compile-modal-item">
              <div className="compile-modal-label">Tapleaf version:</div>
              <RadioGroup
                className="compile-modal-radio-group"
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
                <div className="compile-modal-label">Tweaked key:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult)}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">ScriptPubkey:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult)}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Bech32 address:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult)}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer className="compile-modal-footer">
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
