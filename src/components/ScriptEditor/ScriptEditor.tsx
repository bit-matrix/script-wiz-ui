import React, { useCallback, useEffect, useRef, useState } from 'react';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { convertEditorLines, LOCAL_STORAGE_KEY } from '../../helper';
import { ScriptWiz, VM, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
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
import { getWhispers } from '../../helper/getWhispers';
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
  const [errorMessage2, setErrorMessage2] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [lineStackDataListArray2, setLineStackDataListArray2] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [failedLineNumber, setFailedLineNumber] = useState<number>();
  const [lines, setLines] = useState<string[]>();
  const [lines2, setLines2] = useState<string[]>();
  const [editorValues, setEditorValues] = useState<string[]>([]);
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

  const [clearButtonVisibility, setClearButtonVisibility] = useState<boolean>(false);
  const [saveButtonVisibility, setSaveButtonVisibility] = useState<boolean>(false);

  const [firstEditorTop, setFirstEditorTop] = useState<number>(0);
  const [secondEditorTop, setSecondEditorTop] = useState<number>(0);

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

    setEditorValues(editorLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm, scriptWiz.vm.network, scriptWiz.vm.ver]);

  const saveLocalStorageData = useCallback(() => {
    if (clearButtonVisibility) {
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
          if (editorValues[0]) newLocalStorageArray[currentIndex].editorLines1 = editorValues[0];

          if (editorValues[1]) newLocalStorageArray[currentIndex].editorLines2 = editorValues[1];
        } else {
          // insert
          newLocalStorageArray.push({ editorLines1: editorValues[0], editorLines2: editorValues[1], vm: scriptWiz.vm });
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocalStorageArray));
      } else {
        //if local storage is empty

        const localStorageValue: { editorLines1: string | undefined; editorLines2: string | undefined; vm: VM }[] = [
          { editorLines1: editorValues[0], editorLines2: editorValues[1], vm: scriptWiz.vm },
        ];

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageValue));
      }

      setSaveButtonVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearButtonVisibility, editorValues]);

  useEffect(() => {
    saveLocalStorageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm.network, scriptWiz.vm.ver]);

  const parseInput = useCallback(
    (inputText: string, isWitnessElement: boolean = true) => {
      // Look for $label assignments, keep them for later processing and strip them from the line string.
      const labelMatches = inputText.match(/\$\w+$/);
      if (labelMatches) {
        inputText = inputText.replace(/\s*\$\w+$/, '');
      }

      if (inputText.startsWith('<') && inputText.endsWith('>')) {
        const inputTextValue = inputText.substring(1, inputText.length - 1);

        if (inputTextValue.startsWith('0x')) {
          scriptWiz.parseHex(inputTextValue.substring(2), isWitnessElement);
        } else if (inputTextValue.startsWith('0b')) {
          scriptWiz.parseBin(inputTextValue.substring(2), isWitnessElement);
        } else if (
          (inputTextValue.startsWith('"') && inputTextValue.endsWith('"')) ||
          (inputTextValue.startsWith("'") && inputTextValue.endsWith("'"))
        ) {
          const inputTextValueString = inputTextValue.substring(1, inputTextValue.length - 1);
          scriptWiz.parseText(inputTextValueString, isWitnessElement);
        } else if (!isNaN(Number(inputTextValue))) {
          scriptWiz.parseNumber(Number(inputTextValue), isWitnessElement);
        } else if (inputTextValue.startsWith('OP_')) {
          if (isWitnessElement) {
            const opwordToOphex = scriptWiz.opCodes.wordHex(inputTextValue);
            scriptWiz.parseHex(opwordToOphex.substring(2), isWitnessElement);
          } else {
            setErrorMessage('Unlocking bytecode may contain only push operations.');
          }
        } else {
          console.error('UI: Invalid input value!!!');
        }
      } else if (inputText.startsWith('OP_')) {
        if (isWitnessElement) {
          scriptWiz.parseOpcode(inputText, isWitnessElement);
        } else {
          setErrorMessage2('Unlocking bytecode may contain only push operations.');
        }
      } else {
        console.error('UI: Invalid input value!!!');
      }

      // Assign the label to the last element on the stack
      if (labelMatches) {
        scriptWiz.assignLabel(labelMatches[0]);
      }
    },
    [scriptWiz],
  );

  const stackElementsOnChange = (lines: string[]) => {
    setErrorMessage(undefined);
    setErrorMessage2(undefined);
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

    const addedLines = [...(lines || []), ...(lines2 || [])];

    const firstEditorLineCount = lines?.length || 0;

    if (addedLines) {
      for (let i = 0; i < addedLines.length; i++) {
        const line = addedLines[i];
        let firstIndex = 0;

        if (line !== '') {
          if (i < firstEditorLineCount) {
            parseInput(line, false);
            firstIndex = i;
          } else {
            parseInput(line);
          }

          const scriptWizErrorMessage = scriptWiz.stackDataList.errorMessage;

          if (!hasError) {
            newLastStackDataList = scriptWiz.stackDataList.main;
            newLineStackDataListArray.push(newLastStackDataList);

            if (i === firstIndex) {
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

    setLineStackDataListArray(newLineStackDataListArray.slice(firstEditorLineCount, newLineStackDataListArray.length));
    setLineStackDataListArray2(newLineStackDataListArray.slice(0, firstEditorLineCount));
  }, [lines, lines2, parseInput, scriptWiz, scriptWiz.stackDataList.txData]);

  const compileScripts = () => {
    const compileScript = scriptWiz.compile();
    setCompileModalData({ show: true, data: compileScript });
  };

  const clearLocalStorage = () => {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);

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

    let editorLines: string[] = [];
    if (scriptWiz.vm.network === VM_NETWORK.BTC) {
      editorLines = [initialBitcoinEditorValue, initialBitcoinEditorValue2];
    } else if (scriptWiz.vm.network === VM_NETWORK.LIQUID) {
      editorLines =
        scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT
          ? [initialLiquidTaprootEditorValue, initialLiquidTaprootEditorValue2]
          : [initialLiquidEditorValue, initialLiquidEditorValue2];
    }

    let lines = convertEditorLines(editorLines[0]);
    let lines2 = convertEditorLines(editorLines[1]);

    setLines(lines);
    setLines2(lines2);

    setEditorValues(editorLines);

    setClearButtonVisibility(false);
    setSaveButtonVisibility(false);
  };

  const handleScrollFirst = (value: number) => {
    setFirstEditorTop(value);
  };

  const handleScrollSecond = (event: React.UIEvent<HTMLDivElement>) => {
    setFirstEditorTop(event.currentTarget.scrollTop);
  };

  const handleScrollThird = (value: number) => {
    setSecondEditorTop(value);
  };

  const handleScrollFourth = (event: React.UIEvent<HTMLDivElement>) => {
    setSecondEditorTop(event.currentTarget.scrollTop);
  };

  const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    input1: (
      <div className="script-editor">
        <h3 className="script-editor-input-header">Stack Elements</h3>

        <ScriptEditorInput
          scriptWiz={scriptWiz}
          initialEditorValue={editorValues[0]}
          onChangeScriptEditorInput={stackElementsOnChange}
          failedLineNumber={failedLineNumber}
          scroolTopCallback={handleScrollFirst}
          scroolTop={firstEditorTop}
          callbackEditorValue={(value: string) => {
            if (!clearButtonVisibility) setClearButtonVisibility(true);
            if (!saveButtonVisibility) setSaveButtonVisibility(true);

            const prev = [...editorValues];
            prev[0] = value;
            setEditorValues(prev);
          }}
        />
      </div>
    ),
    input2: (
      <div className="script-editor">
        <h3 className="script-editor-input-header">{scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT ? 'Tapscript' : 'Witness Script'}</h3>

        <ScriptEditorInput
          scriptWiz={scriptWiz}
          initialEditorValue={editorValues[1]}
          onChangeScriptEditorInput={witnessScriptOnChange}
          failedLineNumber={failedLineNumber}
          scroolTopCallback={handleScrollThird}
          scroolTop={secondEditorTop}
          callbackEditorValue={(value: string) => {
            if (!clearButtonVisibility) setClearButtonVisibility(true);
            if (!saveButtonVisibility) setSaveButtonVisibility(true);

            const prev = [...editorValues];
            prev[1] = value;
            setEditorValues(prev);
          }}
        />
      </div>
    ),
    output1: (
      <div className="script-editor">
        <div className="script-editor-output-header-bar" />
        <ScriptEditorOutput
          lineStackDataListArray={lineStackDataListArray2}
          errorMessage={errorMessage2}
          scroolTopCallback={handleScrollSecond}
          scroolTop={firstEditorTop}
        />
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
          lineStackDataListArray={lineStackDataListArray}
          errorMessage={errorMessage}
          scroolTopCallback={handleScrollFourth}
          scroolTop={secondEditorTop}
        />
      </div>
    ),
  };

  return (
    <>
      <TransactionTemplateModal showModal={showTemplateModal} showModalCallBack={(show) => setShowTemplateModal(show)} scriptWiz={scriptWiz} />
      <CompileModal scriptWiz={scriptWiz} compileModalData={compileModalData} showCompileModal={(show) => setCompileModalData({ show })} />
      <ScriptEditorHeader
        compileButtonClick={compileScripts}
        txTemplateClick={() => setShowTemplateModal(true)}
        saveEditorClick={saveLocalStorageData}
        clearEditorClick={clearLocalStorage}
        clearButtonVisibility={clearButtonVisibility}
        saveButtonVisibility={saveButtonVisibility}
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
