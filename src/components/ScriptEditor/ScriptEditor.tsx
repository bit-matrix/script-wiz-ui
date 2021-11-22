import React, { useEffect, useState } from 'react';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { convertEditorLines } from '../../helper';
import { ScriptWiz, VM_NETWORK } from '@script-wiz/lib';
import WizData from '@script-wiz/wiz-data';
import { initialBitcoinEditorValue, initialLiquidEditorValue } from './ScriptEditorInput/initialEditorValue';
import CompileModal from '../CompileModal/CompileModal';
import './ScriptEditor.scss';

type Props = {
  scriptWiz: ScriptWiz;
};

const initialLineStackDataListArray: Array<Array<WizData>> = [];
const initialLastStackDataList: Array<WizData> = [];

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [lastStackDataList, setLastStackDataList] = useState<Array<WizData>>(initialLastStackDataList);
  const [failedLineNumber, setFailedLineNumber] = useState<number>();

  const [compileModalData, setCompileModalData] = useState<{
    show: boolean;
    data?: string;
  }>({ show: false });

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
  }, [scriptWiz.vm.network, scriptWiz.vm.ver]);

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
            setFailedLineNumber(i + 1);
          }
        }
      } else {
        if (!hasError) newLineStackDataListArray.push([]);
      }
    }

    setLineStackDataListArray(newLineStackDataListArray);
    setLastStackDataList(newLastStackDataList);

    console.log(newLineStackDataListArray);
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

  return (
    <>
      <CompileModal scriptWiz={scriptWiz} compileModalData={compileModalData} showCompileModal={(show) => setCompileModalData({ show })} />
      <ScriptEditorHeader compileButtonClick={compileScripts} />
      <div className="script-editor-main-div scroll">
        <div className="script-editor-container">
          <div className="script-editor-sub-item">
            <ScriptEditorInput
              scriptWiz={scriptWiz}
              onChangeScriptEditorInput={(lines: string[]) => {
                setErrorMessage(undefined);
                // setLineStackDataListArray(initialLineStackDataListArray);
                // setLastStackDataList(initialLastStackDataList);
                compile(lines);
              }}
              failedLineNumber={failedLineNumber}
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
