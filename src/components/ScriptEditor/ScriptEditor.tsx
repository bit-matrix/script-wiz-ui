import React, { useCallback, useEffect, useRef, useState } from 'react';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { convertEditorLines } from '../../helper';
import { ScriptWiz, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
import { TxData } from '@script-wiz/lib-core';
import WizData from '@script-wiz/wiz-data';
import { initialBitcoinEditorValue, initialLiquidEditorValue, initialLiquidTaprootEditorValue } from './ScriptEditorInput/initialEditorValue';
import CompileModal from '../CompileModal/CompileModal';
import TransactionTemplateModal from '../TransactionTemplateModal/TransactionTemplateModal';
import './ScriptEditor.scss';

type Props = {
  scriptWiz: ScriptWiz;
};

const initialLineStackDataListArray: Array<Array<WizData>> = [];
const initialLastStackDataList: Array<WizData> = [];

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [failedLineNumber, setFailedLineNumber] = useState<number>();
  const [txData, setTxData] = useState<TxData>();
  const [lines, setLines] = useState<string[]>();
  const [lines2, setLines2] = useState<string[]>();
  const [initialEditorValue, setInitialEditorValue] = useState<string>('');
  const [firstEditorLastData, setFirstEditorLastData] = useState<Array<WizData>>(initialLastStackDataList);

  const [compileModalData, setCompileModalData] = useState<{
    show: boolean;
    data?: string;
  }>({ show: false });

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let editorLines = '';
    if (scriptWiz.vm.network === VM_NETWORK.BTC) {
      editorLines = initialBitcoinEditorValue;
    } else if (scriptWiz.vm.network === VM_NETWORK.LIQUID) {
      editorLines = scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT ? initialLiquidTaprootEditorValue : initialLiquidEditorValue;
    }

    let lines = convertEditorLines(editorLines);
    setLines(lines);
    setInitialEditorValue(editorLines);
  }, [scriptWiz.vm.network, scriptWiz.vm.ver]);

  const parseInput = useCallback(
    (inputText: string, isWitnessElement: boolean = true) => {
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
          if (isWitnessElement) {
            const opwordToOphex = scriptWiz.opCodes.wordHex(inputTextValue);
            scriptWiz.parseHex(opwordToOphex.substring(2));
          } else {
            setErrorMessage('Abow');
          }
        } else {
          console.error('UI: Invalid input value!!!');
        }
      } else if (inputText.startsWith('OP_')) {
        if (isWitnessElement) {
          scriptWiz.parseOpcode(inputText);
        } else {
          setErrorMessage('aboww');
        }
      } else {
        console.error('UI: Invalid input value!!!');
      }
    },
    [scriptWiz],
  );

  const addTxTemplate = useCallback(() => {
    if (txData) {
      scriptWiz.parseTxData(txData);
    }
  }, [scriptWiz, txData]);

  const stackElementsOnChange = (lines: string[]) => {
    setErrorMessage(undefined);
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setLines(lines);
    }, 250);
  };

  const witnessScriptOnChange = (lines2: string[]) => {
    setErrorMessage(undefined);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setLines2(lines2);
    }, 250);
  };

  useEffect(() => {
    scriptWiz.clearStackDataList();
    let hasError: boolean = false;
    const newLineStackDataListArray: Array<Array<WizData>> = [];
    let newLastStackDataList: Array<WizData> = [];

    addTxTemplate();

    const addedLines = [...(lines || []), ...(lines2 || [])];

    const firstEditorLineCount = lines?.length || 0;

    if (addedLines) {
      for (let i = 0; i < addedLines.length; i++) {
        const line = addedLines[i];

        if (line !== '') {
          if (i < firstEditorLineCount) {
            parseInput(line, false);
          } else {
            parseInput(line);
          }

          const scriptWizErrorMessage = scriptWiz.stackDataList.errorMessage;

          if (!hasError) {
            newLastStackDataList = scriptWiz.stackDataList.main;
            newLineStackDataListArray.push(newLastStackDataList);

            if (i === firstEditorLineCount - 1) {
              setFirstEditorLastData(newLastStackDataList);
            }

            if (scriptWizErrorMessage) {
              hasError = true;
              setErrorMessage(scriptWizErrorMessage);
              setFailedLineNumber(i + 1);
            }
          }
        } else {
          if (!hasError) {
            newLineStackDataListArray.push([]);
            setErrorMessage(undefined);
          }
        }
      }
    }

    setLineStackDataListArray(newLineStackDataListArray);
  }, [addTxTemplate, lines, lines2, parseInput, scriptWiz]);

  const compileScripts = () => {
    const compileScript = scriptWiz.compile();
    setCompileModalData({ show: true, data: compileScript });
  };

  const getOutputValueType = (value: string): string => {
    if (value.startsWith('0x')) {
      return 'hex';
    }

    if (!isNaN(Number(value))) {
      return 'number';
    }

    return 'string';
  };

  const getWhisper = useCallback(
    (key: string, tooltip: string, display: string) => (
      <div className="tooltip" key={key}>
        <div className={`editor-output-text ${getOutputValueType(display)} `}>{display}</div>
        <span className="tooltiptext">{'0x' + tooltip}</span>
      </div>
    ),
    [],
  );

  const getWhispers = useCallback(
    (stackDataArray: WizData[]) =>
      stackDataArray.map((stackData: WizData, index: number) => {
        const key = `whisper-${index.toString()}-text`;

        let displayValue = '0x' + stackData.hex;

        if (stackData.number !== undefined) displayValue = stackData.number.toString();
        else if (stackData.text !== undefined) displayValue = stackData.text;

        return getWhisper(key, stackData.hex, displayValue);
      }),
    [getWhisper],
  );

  return (
    <>
      <TransactionTemplateModal
        showModal={showTemplateModal}
        showModalCallBack={(show) => setShowTemplateModal(show)}
        txDataCallBack={(txData: TxData) => {
          setTxData(txData);
        }}
        clearCallBack={() => {
          setTxData(undefined);
        }}
      />
      <CompileModal scriptWiz={scriptWiz} compileModalData={compileModalData} showCompileModal={(show) => setCompileModalData({ show })} />
      <ScriptEditorHeader compileButtonClick={compileScripts} txTemplateClick={() => setShowTemplateModal(true)} scriptWiz={scriptWiz} />
      <div className="script-editor-main-div">
        <div className="script-editor-container">
          <div className="script-editor-sub-item">
            <div className="script-editor-input-1 scroll">
              <h3 className="script-editor-input-header">Stack Elements</h3>
              <ScriptEditorInput
                scriptWiz={scriptWiz}
                initialEditorValue={initialEditorValue}
                onChangeScriptEditorInput={stackElementsOnChange}
                failedLineNumber={failedLineNumber}
              />
            </div>
            <div className="script-editor-input-2 scroll">
              <h3 className="script-editor-input-header">Witness Script</h3>
              <ScriptEditorInput
                scriptWiz={scriptWiz}
                initialEditorValue={initialEditorValue}
                onChangeScriptEditorInput={witnessScriptOnChange}
                failedLineNumber={failedLineNumber}
              />
            </div>
          </div>
          <div className="script-editor-sub-item">
            <div className="script-editor-output-1 scroll">
              <div className="script-editor-output-header-bar" />
              <ScriptEditorOutput lineStackDataListArray={lineStackDataListArray.slice(0, lines?.length)} errorMessage={errorMessage} />
            </div>
            <div className="script-editor-output-2 scroll">
              <div className="script-editor-output-header-bar">
                <div className="script-editor-output-header-bar-content-fade"></div>
                <div className="script-editor-output-header-bar-content">
                  <div className="state">{getWhispers(firstEditorLastData)}</div>
                </div>
              </div>
              <ScriptEditorOutput
                lineStackDataListArray={lineStackDataListArray.slice(lines?.length, lineStackDataListArray.length)}
                errorMessage={errorMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptEditor;
