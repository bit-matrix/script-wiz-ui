import React, { useCallback, useEffect, useRef, useState } from 'react';
import { compileData, ScriptWiz, VM, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
import WizData from '@script-wiz/wiz-data';
import { Mosaic } from 'react-mosaic-component';
import {
  initialBitcoinEditorValue,
  initialBitcoinEditorValue2,
  initialLiquidEditorValue,
  initialLiquidEditorValue2,
  initialLiquidTaprootEditorValue,
  initialLiquidTaprootEditorValue2,
} from './ScriptEditorInput/initialEditorValue';
import CompileModal from '../CompileModal/CompileModal';
import CustomWhisper from './CustomWhisper';
import { useLocalStorageData } from '../../hooks/useLocalStorage';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { convertEditorLines, LOCAL_STORAGE_KEY, LOCAL_STORAGE_OLD_KEY } from '../../helper';
import TransactionTemplateModal from '../TransactionTemplateModal/TransactionTemplateModal';
import './ScriptEditor.scss';

type Props = {
  scriptWiz: ScriptWiz;
};

const initialLineStackDataListArray: Array<Array<WizData>> = [];
const initialLastStackDataList: Array<WizData> = [];

type EditorLocalStorage = { editorLines1: string | undefined; editorLines2: string | undefined; vm: VM };

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [witnessScriptErrorMessage, setWitnessScriptErrorMessage] = useState<string | undefined>();
  const [stackElementsErrorMessage, setStackElementsErrorMessage] = useState<string | undefined>();
  const [witnessScriptLineStackListArray, setWitnessScriptLineStackListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [stackElementsLineStackListArray, setStackElementsLineStackListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [failedLineNumber, setFailedLineNumber] = useState<number>();
  const [witnessScriptLines, setWitnessScriptLines] = useState<string[]>();
  const [stackElementsLines, setStackElementsLines] = useState<string[]>();
  const [editorValues, setEditorValues] = useState<string[]>([]);
  const [witnessScriptLastData, setWitnessScriptLastData] = useState<Array<WizData>>(initialLastStackDataList);
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
    artifact?: Record<string, any>;
  }>({ show: false });

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  const [clearButtonVisibility, setClearButtonVisibility] = useState<boolean>(false);
  const [saveButtonVisibility, setSaveButtonVisibility] = useState<boolean>(false);

  const [witnessScriptTop, setWitnessScriptTop] = useState<number>(0);
  const [stackElementsTop, setStackElementsTop] = useState<number>(0);

  const timerRef = useRef<number | undefined>(undefined);

  const { clearTxLocalData: clearTxLocalDataEx } = useLocalStorageData<string>(LOCAL_STORAGE_OLD_KEY);
  const { getTxLocalData, setTxLocalData, clearTxLocalData } = useLocalStorageData<string>(LOCAL_STORAGE_KEY);

  useEffect(() => {
    clearTxLocalDataEx();

    let editorLines: string[] = [];

    const localStorageValue = getTxLocalData();

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

    setWitnessScriptLines(lines);
    setStackElementsLines(lines2);

    setEditorValues(editorLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm, scriptWiz.vm.network, scriptWiz.vm.ver]);

  const saveLocalStorageData = useCallback(() => {
    if (clearButtonVisibility) {
      const currentLocalStorage = getTxLocalData();

      //check local storage
      if (currentLocalStorage && currentLocalStorage !== null) {
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

        setTxLocalData(JSON.stringify(newLocalStorageArray));
      } else {
        //if local storage is empty
        const localStorageValue: { editorLines1: string | undefined; editorLines2: string | undefined; vm: VM }[] = [
          { editorLines1: editorValues[0], editorLines2: editorValues[1], vm: scriptWiz.vm },
        ];

        setTxLocalData(JSON.stringify(localStorageValue));
      }

      setSaveButtonVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearButtonVisibility, editorValues]);

  useEffect(() => {
    saveLocalStorageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm.network, scriptWiz.vm.ver]);

  const clearLocalStorageData = () => {
    const localStorageData = getTxLocalData();

    if (localStorageData) {
      const localStorageDataJSON: EditorLocalStorage[] = JSON.parse(localStorageData);
      const currentLocalStorageDataIndex = localStorageDataJSON.findIndex(
        (value: EditorLocalStorage) => value.vm.network === scriptWiz.vm.network && value.vm.ver === scriptWiz.vm.ver,
      );

      if (currentLocalStorageDataIndex > -1) {
        const newLocalStorageDataJSON = [...localStorageDataJSON];
        newLocalStorageDataJSON.splice(currentLocalStorageDataIndex, 1);

        if (newLocalStorageDataJSON.length === 0) {
          clearTxLocalData();
        } else {
          setTxLocalData(JSON.stringify(newLocalStorageDataJSON));
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

    setWitnessScriptLines(lines);
    setStackElementsLines(lines2);

    setEditorValues(editorLines);

    setClearButtonVisibility(false);
    setSaveButtonVisibility(false);
  };

  const parseInput = useCallback(
    (inputText: string, scriptCompile: string, isWitnessElement: boolean = true) => {
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
            setWitnessScriptErrorMessage('Unlocking bytecode may contain only push operations.');
          }
        } else {
          console.error('UI: Invalid input value!!!');
        }
      } else if (inputText.startsWith('OP_')) {
        if (isWitnessElement) {
          scriptWiz.parseOpcode(inputText, isWitnessElement);
        } else {
          setStackElementsErrorMessage('Unlocking bytecode may contain only push operations.');
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

  const compileAll = useCallback(
    (inputText: string) => {
      // Look for $label assignments, keep them for later processing and strip them from the line string.
      const labelMatches = inputText.match(/\$\w+$/);
      if (labelMatches) {
        inputText = inputText.replace(/\s*\$\w+$/, '');
      }

      if (inputText.startsWith('<') && inputText.endsWith('>')) {
        const inputTextValue = inputText.substring(1, inputText.length - 1);

        if (inputTextValue.startsWith('0x')) {
          return compileData(inputTextValue.substring(2));
        } else if (
          (inputTextValue.startsWith('"') && inputTextValue.endsWith('"')) ||
          (inputTextValue.startsWith("'") && inputTextValue.endsWith("'"))
        ) {
          const inputTextValueString = inputTextValue.substring(1, inputTextValue.length - 1);
          const data = WizData.fromText(inputTextValueString);

          return compileData(data.hex);
        } else if (!isNaN(Number(inputTextValue))) {
          const data = WizData.fromNumber(Number(inputTextValue));

          return compileData(data.hex);
        } else if (inputTextValue.startsWith('OP_')) {
          const data = scriptWiz.opCodes.wordHex(inputTextValue);
          return data.substring(2);
        } else {
          console.error('UI: Invalid input value!!!');
        }
      } else if (inputText.startsWith('OP_')) {
        const data = scriptWiz.opCodes.wordHex(inputText);

        return data.substring(2);
      } else {
        console.error('UI: Invalid input value!!!');
      }

      return '';
    },

    [scriptWiz],
  );

  const stackElementsOnChange = (lines: string[]) => {
    setStackElementsErrorMessage(undefined);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setWitnessScriptLines(lines);
    }, 250);
  };

  const witnessScriptOnChange = (lines2: string[]) => {
    setWitnessScriptErrorMessage(undefined);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setStackElementsLines(lines2);
    }, 250);
  };

  useEffect(() => {
    scriptWiz.clearStackDataList();
    let hasError: boolean = false;
    const newLineStackDataListArray: Array<Array<WizData>> = [];
    let newLastStackDataList: Array<WizData> = [];

    const addedLines = [...(witnessScriptLines || []), ...(stackElementsLines || [])];

    const firstEditorLineCount = witnessScriptLines?.length || 0;

    if (addedLines) {
      let scriptCompileResult = '';

      for (let z = 0; z < addedLines.length; z++) {
        const line = addedLines[z];

        if (z > firstEditorLineCount - 1) {
          let data = '';
          data = compileAll(line);

          scriptCompileResult += data;
        }
      }

      for (let i = 0; i < addedLines.length; i++) {
        const line = addedLines[i];
        let firstIndex = 0;

        if (line !== '') {
          if (i < firstEditorLineCount) {
            parseInput(line, scriptCompileResult, false);
            firstIndex = i;
          } else {
            parseInput(line, scriptCompileResult);
          }

          const scriptWizErrorMessage = scriptWiz.stackDataList.errorMessage;

          if (!hasError) {
            newLastStackDataList = scriptWiz.stackDataList.main;
            newLineStackDataListArray.push(newLastStackDataList);

            if (i === firstIndex) {
              setWitnessScriptLastData(newLastStackDataList);
            }

            if (scriptWizErrorMessage) {
              hasError = true;
              setWitnessScriptErrorMessage(scriptWizErrorMessage);
              setFailedLineNumber(i + 1);
            }
          }
        } else {
          if (!hasError) {
            newLineStackDataListArray.push([]);
            setWitnessScriptErrorMessage(undefined);
          }
        }
      }
    }

    setWitnessScriptLineStackListArray(newLineStackDataListArray.slice(firstEditorLineCount, newLineStackDataListArray.length));
    setStackElementsLineStackListArray(newLineStackDataListArray.slice(0, firstEditorLineCount));
  }, [witnessScriptLines, stackElementsLines, parseInput, scriptWiz, scriptWiz.stackDataList.txData, compileAll]);

  const compileScripts = () => {
    try {
      const compileScript = scriptWiz.compile();

      let artifact;

      try {
        artifact = compileIonioArtifact();
      } catch {
        artifact = undefined;
      }

      setCompileModalData({ show: true, data: compileScript, artifact });
    } catch (e) {
      console.error(e);
    }
  };

  const numberOrOpCode = (line: string): number => {
    if (line.startsWith('OP_')) {
      return parseInt(line.replace('OP_', ''));
    } else if (typeof line === 'number' || !isNaN(Number(line))) {
      return Number(line);
    } else {
      console.log(line);
      throw new Error('Invalid input value, expected number');
    }
  };
  const compileIonioArtifact = () => {
    // asm
    let asm: string[] = [];
    let constructorInputs: { name: string; type: string }[] = [];
    let functionInputs: { name: string; type: string }[] = [];
    let constructorInputsValues: Map<string, string> = new Map();
    let require: { type: string; expected: any; atIndex?: number }[] = [];

    const inputHexes = scriptWiz.stackDataList.inputHexes;
    const cleanInputHexes = inputHexes.filter((hex: string) => hex && hex.length > 0);

    let paramCount = 0;
    for (let i = 0; i < cleanInputHexes.length; i++) {
      const hex = cleanInputHexes[i];
      const nextHex = cleanInputHexes[i + 1];
      console.log(hex, nextHex);
      const opcode = scriptWiz.opCodes.codeData(Number(`0x${hex}`));
      const nextOpcode = scriptWiz.opCodes.codeData(Number(`0x${nextHex}`));
      if (!opcode) {
        // assign random name as template
        const name = `param${paramCount}`;
        // we defualt to bytes for now
        let type = 'bytes';
        // we skip adding param if is a signature check, will be replaced by function input later
        if (nextOpcode && (nextOpcode.word === 'OP_CHECKSIGVERIFY' || nextOpcode.word === 'OP_CHECKSIG')) {
          type = 'xonlypubkey';
        }

        // collect the actual value of template if not present already
        if (!Array.from(constructorInputsValues.keys()).includes(hex)) {
          constructorInputs.push({ name, type });
          constructorInputsValues.set(hex, name);
          // increment the count
          paramCount++;
          // push the template name to the asm
          asm.push(`$${name}`);
          continue;
        } else {
          // this means we have a duplicated value, let's use the one already present
          asm.push(`$${constructorInputsValues.get(hex)}`);
          continue;
        }
      }
      asm.push(opcode.word);
    }

    let functionParamCount = 0;
    cleanInputHexes.forEach((hex: string, index: number) => {
      const opcode = scriptWiz.opCodes.codeData(Number(`0x${hex}`));
      if (!opcode) return;
      if (!opcode.word) {
        throw new Error(`opcode not found for ${hex}`);
      }

      // let's understand if this script needs parameters
      switch (opcode.word) {
        case 'OP_CHECKSIG':
        case 'OP_CHECKSIGVERIFY':
          const name = `signature${functionParamCount}`;
          const type = `sig`;
          functionInputs.push({ name, type });
          functionParamCount++;
          break;
        case 'OP_CHECKSIGFROMSTACK':
        case 'OP_CHECKSIGFROMSTACKVERIFY':
          functionInputs.push({ name: `datasignature${functionParamCount}`, type: 'datasig' });
          functionParamCount++;
          break;

        case 'OP_INSPECTOUTPUTSCRIPTPUBKEY': {
          const prevStackElm = cleanInputHexes[index - 1];
          const atIndex = numberOrOpCode(prevStackElm);

          const nextStackElm = cleanInputHexes[index + 1];
          let version = numberOrOpCode(nextStackElm);

          const nextNextStackElm = cleanInputHexes[index + 3];
          const program = constructorInputsValues.has(nextNextStackElm) ? `$${constructorInputsValues.get(nextNextStackElm)}` : nextNextStackElm;

          require.push({ type: 'outputscript', expected: { version, program }, atIndex });
          break;
        }
        case 'OP_INSPECTOUTPUTVALUE': {
          const prevStackElm = cleanInputHexes[index - 1];
          const atIndex = numberOrOpCode(prevStackElm);

          //const nextStackElm = cleanInputHexes[index + 1];
          //let prefix = numberOrOpCode(nextStackElm);

          const nextNextStackElm = cleanInputHexes[index + 3];
          const value = constructorInputsValues.has(nextNextStackElm) ? `$${constructorInputsValues.get(nextNextStackElm)}` : nextNextStackElm;

          require.push({ type: 'outputvalue', expected: value, atIndex });
          break;
        }
        case 'OP_INSPECTOUTPUTASSET': {
          const prevStackElm = cleanInputHexes[index - 1];
          const atIndex = numberOrOpCode(prevStackElm);

          const nextNextStackElm = cleanInputHexes[index + 3];
          const asset = constructorInputsValues.has(nextNextStackElm) ? `$${constructorInputsValues.get(nextNextStackElm)}` : nextNextStackElm;

          require.push({ type: 'outputasset', expected: asset, atIndex });
          break;
        }
        case 'OP_INSPECTOUTPUTNONCE': {
          const prevStackElm = cleanInputHexes[index - 1];
          const atIndex = numberOrOpCode(prevStackElm);

          const nextStackElm = cleanInputHexes[index + 1];
          const nonce = constructorInputsValues.has(nextStackElm) ? constructorInputsValues.get(nextStackElm) : nextStackElm;
          const cleanedNonce = nonce === '00' ? '' : nonce;
          require.push({ type: 'outputnonce', expected: cleanedNonce, atIndex });
          break;
        }
        default:
          break;
      }
    });

    // optmize the requirement type
    /* const inspectOutByIndex: Record<number, string[]> = {};
    for (const { atIndex, type } of require) {
      if (!atIndex) return;
      if (!inspectOutByIndex[atIndex]) {
        inspectOutByIndex[atIndex] = [];
      }
      inspectOutByIndex[atIndex].push(type);
    }

    for (const [atIndexString, types] of Object.entries(inspectOutByIndex)) {
      const atIndex = parseInt(atIndexString);
      const fullCovenantOutput = types.includes('outputscript') && types.includes('outputvalue') && types.includes('outputasset') && types.includes('outputnonce');
      if (fullCovenantOutput) {
        require = require.filter((req: { type: string, expected: any, atIndex?: number }) => {
          if (!req.atIndex) return false;
          const toBeRemoved = req.atIndex === atIndex && req.type.startsWith('output')
          return !toBeRemoved;
        });
      }
    } */

    const artifact: Record<string, any> = {
      contractName: 'myContract',
      constructorInputs,
      functions: [
        {
          name: 'myFunction',
          functionInputs,
          require,
          asm,
        },
      ],
    };

    console.log(JSON.stringify(artifact, null, 2));

    return artifact;
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

  const secondDivRef = useRef<HTMLInputElement>(null);
  const fourthDivRef = useRef<HTMLInputElement>(null);

  const handleScrollFirst = (value: number) => {
    if (secondDivRef.current !== null) {
      secondDivRef.current.scrollTop = value;
      setWitnessScriptTop(value);
    }
  };

  const handleScrollSecond = (event: React.UIEvent<HTMLDivElement>) => {
    setWitnessScriptTop(event.currentTarget.scrollTop);
  };

  const handleScrollThird = (value: number) => {
    if (fourthDivRef.current !== null) {
      fourthDivRef.current.scrollTop = value;
      setStackElementsTop(value);
    }
  };

  const handleScrollFourth = (event: React.UIEvent<HTMLDivElement>) => {
    setStackElementsTop(event.currentTarget.scrollTop);
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
          scroolTop={witnessScriptTop}
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
          scroolTop={stackElementsTop}
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
        <div className="script-editor-content" onScroll={handleScrollSecond} ref={secondDivRef}>
          <ScriptEditorOutput lineStackDataListArray={stackElementsLineStackListArray} errorMessage={stackElementsErrorMessage} />
        </div>
      </div>
    ),
    output2: (
      <div className="script-editor">
        <div className="script-editor-output-header-bar">
          <div className="script-editor-output-header-bar-content-fade"></div>
          <div className="script-editor-output-header-bar-content">
            <div className="state">{getWhispers(witnessScriptLastData)}</div>
          </div>
        </div>
        <div className="script-editor-content" onScroll={handleScrollFourth} ref={fourthDivRef}>
          <ScriptEditorOutput lineStackDataListArray={witnessScriptLineStackListArray} errorMessage={witnessScriptErrorMessage} />
        </div>
      </div>
    ),
  };

  return (
    <>
      <TransactionTemplateModal showModal={showTemplateModal} showModalCallback={(show) => setShowTemplateModal(show)} scriptWiz={scriptWiz} />
      <CompileModal scriptWiz={scriptWiz} compileModalData={compileModalData} showCompileModal={(show) => setCompileModalData({ show })} />
      <ScriptEditorHeader
        compileButtonClick={compileScripts}
        txTemplateClick={() => setShowTemplateModal(true)}
        saveEditorClick={saveLocalStorageData}
        clearEditorClick={clearLocalStorageData}
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
