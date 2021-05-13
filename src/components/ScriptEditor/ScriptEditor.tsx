import React, { useState } from "react";
import IStackData from "@script-wiz/lib/model/IStackData";
import * as scriptWiz from "@script-wiz/lib";
import ScriptEditorInput from "../ScriptEditorInput/ScriptEditorInput";
import ScriptEditorOutput from "../ScriptEditorOutput/ScriptEditorOutput";

const initialStackDataList: Array<IStackData | undefined> = [];

const ScriptEditor = () => {
  const [stackDataList, setStackDataList] = useState<Array<IStackData | undefined>>(initialStackDataList);

  const compile = (lines: string[]) => {
    setStackDataList(initialStackDataList);
    scriptWiz.clearStack();
    const newStackDataList: Array<IStackData | undefined> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let newStackData: IStackData | undefined = undefined;

      try {
        if (line !== "") {
          const libStackDataList = scriptWiz.parse(line);
          newStackData = libStackDataList.main[libStackDataList.main.length - 1];
        }
        newStackDataList.push(newStackData);
      } catch (e) {
        newStackData = e;
        newStackDataList.push(newStackData);
        continue;
      }
    }

    setStackDataList(newStackDataList);
  };

  return (
    <div style={{ width: "100vw" }}>
      <div style={{ float: "left", height: "100%", width: "50%" }}>
        <ScriptEditorInput onChangeScriptEditorInput={compile} />
      </div>
      <div className="editor-output-main" style={{ float: "left", height: "100%", width: "50%" }}>
        <ScriptEditorOutput stackDataList={stackDataList} />
      </div>
    </div>
  );
};

export default ScriptEditor;
