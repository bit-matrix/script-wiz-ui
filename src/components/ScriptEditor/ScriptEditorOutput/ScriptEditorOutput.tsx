import React, { useCallback } from 'react';
import WizData from '@script-wiz/wiz-data';
import CustomWhisper from '../CustomWhisper';
import BanIcon from '../../Svg/Icons/Ban';
import './ScriptEditorOutput.scss';

type Props = {
  lineStackDataListArray: Array<Array<WizData>>;
  errorMessage: string | undefined;
};

const ScriptEditorOutput: React.FC<Props> = ({ lineStackDataListArray, errorMessage }) => {
  const getWhispers = useCallback(
    (stackDataArray: WizData[], lineNumber: number) =>
      stackDataArray.map((stackData: WizData, index: number) => {
        const key = `whisper-${lineNumber.toString()}-${index.toString()}-text`;

        let displayValue = '0x' + stackData.hex;

        if (stackData.number !== undefined) displayValue = stackData.number.toString();
        else if (stackData.text !== undefined) displayValue = stackData.text;
        return <CustomWhisper key={key} tooltip={stackData.hex} display={displayValue} />;
      }),
    [],
  );

  return (
    <div className="script-editor-output-main-div scroll">
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
          <span className="error-message">
            <div className="error-message-ban-icon">
              <BanIcon width="1rem" height="1rem" />
              &nbsp;
              {errorMessage}
            </div>
          </span>
        </div>
      ) : undefined}
    </div>
  );
};

export default ScriptEditorOutput;
