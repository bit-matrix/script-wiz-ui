import React, { useState } from "react";
import IStackData from "@script-wiz/lib/model/IStackData";
import * as scriptWiz from "@script-wiz/lib";
import ScriptEditorInput from "./ScriptEditorInput/ScriptEditorInput";
import ScriptEditorOutput from "./ScriptEditorOutput/ScriptEditorOutput";
import "./ScriptEditor.scss";
import ScriptEditorHeader from "./ScriptEditorHeader/ScriptEditorHeader";

const initialLineStackDataListArray: Array<Array<IStackData>> = [];
const initialLastStackDataList: Array<IStackData> = [];

const ScriptEditor = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<IStackData>>>(initialLineStackDataListArray);
  const [lastStackDataList, setLastStackDataList] = useState<Array<IStackData>>(initialLastStackDataList);

  const compile = (lines: string[]) => {
    scriptWiz.clearStack();

    const newLineStackDataListArray: Array<Array<IStackData>> = [];
    let newLastStackDataList: Array<IStackData> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      try {
        if (line !== "") {
          newLastStackDataList = scriptWiz.parse(line).main;
          newLineStackDataListArray.push(newLastStackDataList);
        } else {
          newLineStackDataListArray.push([]);
        }
      } catch (e) {
        setErrorMessage(e);
        break;
      }
    }

    setLineStackDataListArray(newLineStackDataListArray);
    setLastStackDataList(newLastStackDataList);
  };

  return (
    <div className="script-editor-main-div">
      <ScriptEditorHeader />
      <div className="script-editor-container">
        <div className="script-editor-sub-item">
          <ScriptEditorInput
            onChangeScriptEditorInput={(lines: string[]) => {
              setErrorMessage(undefined);
              setLineStackDataListArray(initialLineStackDataListArray);
              setLastStackDataList(initialLastStackDataList);
              compile(lines);
            }}
          />
        </div>
        <div className="script-editor-sub-item">
          <ScriptEditorOutput lastStackDataList={lastStackDataList} lineStackDataListArray={lineStackDataListArray} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;
