import React from "react";
import IStackData from "@script-wiz/lib/model/IStackData";
import "./ScriptEditorOutput.scss";
import { Tooltip, Whisper } from "rsuite";

interface IScriptEditorInput {
  lastStackDataList: Array<IStackData>;
  lineStackDataListArray: Array<Array<IStackData>>;
  errorMessage: string | undefined;
}

const ScriptEditorOutput: React.FC<IScriptEditorInput> = ({ lastStackDataList, lineStackDataListArray, errorMessage }) => {
  const getWhispers = (stackDataArray: IStackData[], lineNumber: number) =>
    stackDataArray.map((stackData: IStackData, index: number) => {
      const key = `whisper-${lineNumber.toString()}-${index.toString()}-text`;
      return getWhisper(key, stackData.byteValue, stackData.byteValueDisplay);
    });

  const getWhisper = (key: string, tooltip: string, display: string) => (
    <Whisper placement="right" trigger="hover" speaker={<Tooltip>{tooltip}</Tooltip>}>
      <span key={key} className="editor-output-text">
        {display}
      </span>
    </Whisper>
  );

  return (
    <>
      {lineStackDataListArray.map((lineStackDataList, lineNumber: number) => (
        <div className="script-editor-output-main" key={`script-editor-output-main-${lineNumber.toString()}`}>
          <span key={`editor-output-text-page-number-${lineNumber.toString()}`} className="editor-output-text-page-number">
            {lineNumber + 1}
          </span>
          {getWhispers(lineStackDataList, lineNumber)}
          <br />
        </div>
      ))}
      {errorMessage ? (
        <div className="script-editor-output-main" key={`script-editor-output-main-error`}>
          <span key={`editor-output-text-page-number-error`} className="editor-output-text-page-number"></span>
          {errorMessage}
        </div>
      ) : undefined}
    </>
  );
};

export default ScriptEditorOutput;
