import React, { useEffect, useState } from "react";
import IStackData from "@script-wiz/lib/model/IStackData";
import "./ScriptEditorOutput.css";

interface IScriptEditorInput {
  stackDataList: Array<IStackData | undefined>;
}

const ScriptEditorOutput: React.FC<IScriptEditorInput> = ({ stackDataList }) => {
  const [outputs, setOutputs] = useState<string[]>([]);

  useEffect(() => {
    const outputStrings: string[] = [];
    stackDataList.forEach((d, i) => {
      let lineOutput = "";
      for (let j = 0; j < i + 1; j++) {
        const data = stackDataList[j];
        lineOutput += data ? (data.input ? data.input + "(" + data.byteValue : data) + ")" : "";
        lineOutput += " ";
      }
      outputStrings.push(lineOutput);
    });

    setOutputs(outputStrings);
  }, [stackDataList]);

  return (
    <>
      {outputs.map((o, index) => (
        <div key={index.toString()}>
          <span key={`${index.toString() + "index"}`} className="editor-output-text-page-number">
            {index + 1}
          </span>
          <span key={`${index.toString() + "text"}`} className="editor-output-text">
            {o}
          </span>
          <br />
        </div>
      ))}
    </>
  );
};

export default ScriptEditorOutput;
