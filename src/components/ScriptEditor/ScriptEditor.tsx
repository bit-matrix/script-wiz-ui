import React, { useCallback, useEffect, useRef, useState } from 'react';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { convertEditorLines, LOCAL_STORAGE_KEY } from '../../helper';
import { ScriptWiz, VM, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
import { TxData } from '@script-wiz/lib-core';
import WizData from '@script-wiz/wiz-data';
import {
  initialBitcoinEditorValue,
  initialBitcoinEditorValue2,
  initialLiquidEditorValue,
  initialLiquidEditorValue2,
  initialLiquidTaprootEditorValue,
  initialLiquidTaprootEditorValue2,
} from './ScriptEditorInput/initialEditorValue';
import CompileModal from '../CompileModal/CompileModal';
import TransactionTemplateModal from '../TransactionTemplateModal/TransactionTemplateModal';
import CustomWhisper from './CustomWhisper';
import { Mosaic } from 'react-mosaic-component';
import './ScriptEditor.scss';

type Props = {
  scriptWiz: ScriptWiz;
};

const initialLineStackDataListArray: Array<Array<WizData>> = [];
const initialLastStackDataList: Array<WizData> = [];

type EditorLocalStorage = { editorLines1: string | undefined; editorLines2: string | undefined; vm: VM };

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [failedLineNumber, setFailedLineNumber] = useState<number>();
  const [txData, setTxData] = useState<TxData>();
  const [lines, setLines] = useState<string[]>();
  const [lines2, setLines2] = useState<string[]>();
  const [initialEditorValue, setInitialEditorValue] = useState<string[]>([]);
  const [firstEditorLastData, setFirstEditorLastData] = useState<Array<WizData>>(initialLastStackDataList);
  const [editorSplits, setEditorSplits] = useState<any>({
    direction: 'row',
    first: {
      direction: 'column',
      first: 'input1',
      second: 'input2',
      splitPercentage: 50,
    },
    second: {
      direction: 'column',
      first: 'output1',
      second: 'output2',
      splitPercentage: 50,
    },
    splitPercentage: 50,
  });

  const [compileModalData, setCompileModalData] = useState<{
    show: boolean;
    data?: string;
  }>({ show: false });

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  const [finalEditorValue1, setFinalEditorValue1] = useState<string>();
  const [finalEditorValue2, setFinalEditorValue2] = useState<string>();

  const [clearButtonVisibility, setClearButtonVisibility] = useState<boolean>(false);

  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let editorLines: string[] = [];

    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (localStorageValue) {
      const localStorageArray = JSON.parse(localStorageValue);

      const localStorageObject = localStorageArray.find((lsa: { vm: { network: VM_NETWORK; ver: VM_NETWORK_VERSION } }) => {
        return lsa.vm.network === scriptWiz.vm.network && lsa.vm.ver === scriptWiz.vm.ver;
      });

      if (localStorageObject) {
        if (localStorageObject.editorLines1 && localStorageObject.editorLines2) {
          editorLines = [localStorageObject.editorLines1, localStorageObject.editorLines2];
        } else if (localStorageObject.editorLines1) {
          if (scriptWiz.vm.network === VM_NETWORK.BTC) {
            editorLines = [localStorageObject.editorLines1, initialBitcoinEditorValue2];
          } else if (scriptWiz.vm.network === VM_NETWORK.LIQUID) {
            editorLines =
              scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT
                ? [localStorageObject.editorLines1, initialLiquidTaprootEditorValue2]
                : [localStorageObject.editorLines1, initialLiquidEditorValue2];
          }
        } else if (localStorageObject.editorLines2) {
          if (scriptWiz.vm.network === VM_NETWORK.BTC) {
            editorLines = [initialBitcoinEditorValue, localStorageObject.editorLines2];
          } else if (scriptWiz.vm.network === VM_NETWORK.LIQUID) {
            editorLines =
              scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT
                ? [initialLiquidTaprootEditorValue, localStorageObject.editorLines2]
                : [initialLiquidEditorValue, localStorageObject.editorLines2];
          }
        }
        setClearButtonVisibility(true);
      } else {
        if (scriptWiz.vm.network === VM_NETWORK.BTC) {
          editorLines = [initialBitcoinEditorValue, initialBitcoinEditorValue2];
        } else if (scriptWiz.vm.network === VM_NETWORK.LIQUID) {
          editorLines =
            scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT
              ? [initialLiquidTaprootEditorValue, initialLiquidTaprootEditorValue2]
              : [initialLiquidEditorValue, initialLiquidEditorValue2];
        }
        setClearButtonVisibility(false);
      }
    } else {
      if (scriptWiz.vm.network === VM_NETWORK.BTC) {
        editorLines = [initialBitcoinEditorValue, initialBitcoinEditorValue2];
      } else if (scriptWiz.vm.network === VM_NETWORK.LIQUID) {
        editorLines =
          scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT
            ? [initialLiquidTaprootEditorValue, initialLiquidTaprootEditorValue2]
            : [initialLiquidEditorValue, initialLiquidEditorValue2];
      }

      setClearButtonVisibility(false);
    }

    let lines = convertEditorLines(editorLines[0]);
    let lines2 = convertEditorLines(editorLines[1]);

    setLines(lines);
    setLines2(lines2);

    setInitialEditorValue(editorLines);
  }, [scriptWiz.vm.network, scriptWiz.vm.ver, clearButtonVisibility]);

  const saveLocalStorageData = useCallback(() => {
    if (finalEditorValue1 || finalEditorValue2) {
      const currentLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);

      //check local storage
      if (currentLocalStorage !== null) {
        const currentLocalStorageArray = JSON.parse(currentLocalStorage);
        const newLocalStorageArray = [...currentLocalStorageArray];

        //current scriptWiz.vm index
        const currentIndex = newLocalStorageArray.findIndex((nls) => {
          return nls.vm.network === scriptWiz.vm.network && nls.vm.ver === scriptWiz.vm.ver;
        });

        //local storage has same version data update
        if (currentIndex > -1) {
          newLocalStorageArray[currentIndex].editorLines1 = finalEditorValue1;
          newLocalStorageArray[currentIndex].editorLines2 = finalEditorValue2;
        } else {
          // insert
          newLocalStorageArray.push({ editorLines1: finalEditorValue1, editorLines2: finalEditorValue2, vm: scriptWiz.vm });
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocalStorageArray));
      } else {
        //if local storage is empty

        const localStorageValue: { editorLines1: string | undefined; editorLines2: string | undefined; vm: VM }[] = [
          { editorLines1: finalEditorValue1, editorLines2: finalEditorValue2, vm: scriptWiz.vm },
        ];

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageValue));
      }

      setClearButtonVisibility(true);
    }

    setFinalEditorValue1(undefined);
    setFinalEditorValue2(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalEditorValue1, finalEditorValue2, clearButtonVisibility]);

  useEffect(() => {
    saveLocalStorageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm]);

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
            setErrorMessage('Unlocking bytecode may contain only push operations.');
          }
        } else {
          console.error('UI: Invalid input value!!!');
        }
      } else if (inputText.startsWith('OP_')) {
        if (isWitnessElement) {
          scriptWiz.parseOpcode(inputText);
        } else {
          setErrorMessage('Unlocking bytecode may contain only push operations.');
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

  const getWhispers = useCallback(
    (stackDataArray: WizData[]) =>
      stackDataArray.map((stackData: WizData, index: number) => {
        const key = `whisper-${index.toString()}-text`;

        let displayValue = '0x' + stackData.hex;

        if (stackData.number !== undefined) displayValue = stackData.number.toString();
        else if (stackData.text !== undefined) displayValue = stackData.text;

        return <CustomWhisper key={key} tooltip={stackData.hex} display={displayValue} />;
      }),
    [],
  );

  const clearLocalStorage = () => {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);

    setFinalEditorValue1(undefined);
    setFinalEditorValue2(undefined);
    setClearButtonVisibility(false);

    if (localStorageData) {
      const localStorageDataJSON: EditorLocalStorage[] = JSON.parse(localStorageData);
      const currentLocalStorageDataIndex = localStorageDataJSON.findIndex(
        (value: EditorLocalStorage) => value.vm.network === scriptWiz.vm.network && value.vm.ver === scriptWiz.vm.ver,
      );

      if (currentLocalStorageDataIndex > -1) {
        const newLocalStorageDataJSON = [...localStorageDataJSON];
        newLocalStorageDataJSON.splice(currentLocalStorageDataIndex, 1);

        if (newLocalStorageDataJSON.length === 0) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocalStorageDataJSON));
        }
      }
    }
  };

  const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    input1: (
      <div className="script-editor">
        <h3 className="script-editor-input-header">Stack Elements</h3>
        <ScriptEditorInput
          scriptWiz={scriptWiz}
          initialEditorValue={initialEditorValue[0]}
          onChangeScriptEditorInput={stackElementsOnChange}
          failedLineNumber={failedLineNumber}
          callbackEditorValue={(value: string) => {
            if (clearButtonVisibility) setClearButtonVisibility(false);
            setFinalEditorValue1(value.trim());
          }}
        />
      </div>
    ),
    input2: (
      <div className="script-editor">
        <h3 className="script-editor-input-header">Witness Script</h3>
        <ScriptEditorInput
          scriptWiz={scriptWiz}
          initialEditorValue={initialEditorValue[1]}
          onChangeScriptEditorInput={witnessScriptOnChange}
          failedLineNumber={failedLineNumber}
          callbackEditorValue={(value: string) => {
            if (clearButtonVisibility) setClearButtonVisibility(false);
            setFinalEditorValue2(value.trim());
          }}
        />
      </div>
    ),
    output1: (
      <div className="script-editor">
        <div className="script-editor-output-header-bar" />
        <ScriptEditorOutput lineStackDataListArray={lineStackDataListArray.slice(0, lines?.length)} />
      </div>
    ),
    output2: (
      <div className="script-editor">
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
    ),
  };

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
        vm={scriptWiz.vm}
      />
      <CompileModal scriptWiz={scriptWiz} compileModalData={compileModalData} showCompileModal={(show) => setCompileModalData({ show })} />
      <ScriptEditorHeader
        compileButtonClick={compileScripts}
        txTemplateClick={() => setShowTemplateModal(true)}
        scriptWiz={scriptWiz}
        saveEditorClick={saveLocalStorageData}
        clearEditorClick={clearLocalStorage}
        clearButtonVisibility={clearButtonVisibility}
        saveButtonVisibility={!!finalEditorValue1 || !!finalEditorValue2}
      />
      <div className="script-editor-main-div">
        <div className="script-editor-container">
          <Mosaic<string>
            renderTile={(id) => ELEMENT_MAP[id]}
            resize={{ minimumPaneSizePercentage: 10 }}
            value={editorSplits}
            onChange={(node: any) => {
              const clonedNode = { ...node };

              if (editorSplits.first.splitPercentage !== clonedNode.first.splitPercentage) {
                clonedNode.second.splitPercentage = node.first.splitPercentage;
              }

              if (editorSplits.second.splitPercentage !== clonedNode.second.splitPercentage) {
                clonedNode.first.splitPercentage = node.second.splitPercentage;
              }

              setEditorSplits(clonedNode);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ScriptEditor;
