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
  const [lastStackDataList, setLastStackDataList] = useState<Array<WizData>>(initialLastStackDataList);
  const [failedLineNumber, setFailedLineNumber] = useState<number>();
  const [txData, setTxData] = useState<TxData>();
  const [lines, setLines] = useState<string[]>();
  const [initialEditorValue, setInitialEditorValue] = useState<string>('');

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
    (inputText: string) => {
      // 1: hex, 2: bin, 3/4: quoted text, 5: number, 6: opcode, 7: label
      const reWord = /^\s*(?:<(?:0x([a-fA-F0-9]+)|0b([01]+)|"([^"]+)"|'([^']+)'|(\d+))>|(OP_\w+)|(\$\w+))(?:\s+|$)/;

      let lineRemain = inputText.trim();
      while (lineRemain.length) {
        const matches = lineRemain.match(reWord);
        if (!matches) {
          console.error('UI: Invalid input value:', lineRemain);
          // TODO user-visible error message
          return;
        }

        if (matches[1]) {
          scriptWiz.parseHex(matches[1]);
        } else if (matches[2]) {
          scriptWiz.parseBin(matches[2]);
        } else if (matches[3] || matches[4]) {
          scriptWiz.parseText(matches[3] || matches[4]);
        } else if (matches[5]) {
          scriptWiz.parseNumber(+matches[5]);
        } else if (matches[6]) {
          scriptWiz.parseOpcode(matches[6]);
        }  else if (matches[7]) {
          scriptWiz.assignLabel(matches[7]);
        }

        lineRemain = lineRemain.slice(matches[0].length);
      }
    },
    [scriptWiz],
  );

  const addTxTemplate = useCallback(() => {
    if (txData) {
      scriptWiz.parseTxData(txData);
    }
  }, [scriptWiz, txData]);

  useEffect(() => {
    scriptWiz.clearStackDataList();
    let hasError: boolean = false;
    const newLineStackDataListArray: Array<Array<WizData>> = [];
    let newLastStackDataList: Array<WizData> = [];

    addTxTemplate();

    if (lines) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line !== '') {
          parseInput(line);

          const scriptWizErrorMessage = scriptWiz.stackDataList.errorMessage;

          if (!hasError) {
            newLastStackDataList = scriptWiz.stackDataList.main;
            newLineStackDataListArray.push(newLastStackDataList);

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
    setLastStackDataList(newLastStackDataList);
  }, [addTxTemplate, lines, parseInput, scriptWiz]);

  const compileScripts = () => {
    const compileScript = scriptWiz.compile();
    setCompileModalData({ show: true, data: compileScript });
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
      />
      <CompileModal scriptWiz={scriptWiz} compileModalData={compileModalData} showCompileModal={(show) => setCompileModalData({ show })} />
      <ScriptEditorHeader compileButtonClick={compileScripts} txTemplateClick={() => setShowTemplateModal(true)} scriptWiz={scriptWiz} />
      <div className="script-editor-main-div scroll">
        <div className="script-editor-container">
          <div className="script-editor-sub-item">
            <ScriptEditorInput
              scriptWiz={scriptWiz}
              initialEditorValue={initialEditorValue}
              onChangeScriptEditorInput={(lines: string[]) => {
                setErrorMessage(undefined);
                // setLineStackDataListArray(initialLineStackDataListArray);
                // setLastStackDataList(initialLastStackDataList);

                if (timerRef.current) window.clearTimeout(timerRef.current);

                timerRef.current = window.setTimeout(() => {
                  setLines(lines);
                }, 250);
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
