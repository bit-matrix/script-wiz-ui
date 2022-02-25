import React, { useCallback } from 'react';
import WizData from '@script-wiz/wiz-data';
import BanIcon from '../../Svg/Icons/Ban';
import './ScriptEditorOutput.scss';

type Props = {
  lineStackDataListArray: Array<Array<WizData>>;
  errorMessage?: string;
};

const ScriptEditorOutput: React.FC<Props> = ({ lineStackDataListArray, errorMessage }) => {
  const getOutputValueType = (value: string): string => {
    if (value.startsWith('0x')) {
      return 'hex';
    }

    if (!isNaN(Number(value))) {
      return 'number';
    }

    return 'string';
  };

  const getWhisper = useCallback(
    (key: string, tooltip: string, display: string, label?: string) => (
      <div className="tooltip" key={key}>
        <div className={`editor-output-text ${getOutputValueType(display)} `}>
          {label ? <em className="editor-output-label">{label} </em> : ''}
          {display}
        </div>
        <span className="tooltiptext">{'0x' + tooltip}</span>
      </div>
    ),
    [],
  );

  const getWhispers = useCallback(
    (stackDataArray: WizData[], lineNumber: number) =>
      stackDataArray.map((stackData: WizData, index: number) => {
        const key = `whisper-${lineNumber.toString()}-${index.toString()}-text`;
        let displayValue = '0x' + stackData.hex;
        if (stackData.number !== undefined) displayValue = stackData.number.toString();
        else if (stackData.text !== undefined) displayValue = stackData.text;
        return getWhisper(key, stackData.hex, displayValue, stackData.label);
      }),
    [],
  );

  return (
    <div className="script-editor-output-main-div">
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
