import React, { useCallback } from 'react';
import BanIcon from '../../Svg/Icons/Ban';
import './ScriptEditorOutput.scss';

const ScriptEditorOutput = ({ lineStackDataListArray, errorMessage }) => {
  const getOutputValueType = (value) => {
    if (value.startsWith('0x')) {
      return 'hex';
    }

    if (!isNaN(Number(value))) {
      return 'number';
    }

    return 'string';
  };

  const getWhisper = useCallback(
    (key, tooltip, display, label) => (
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
    (stackDataArray, lineNumber) =>
      stackDataArray.map((stackData, index) => {
        const key = `whisper-${lineNumber.toString()}-${index.toString()}-text`;
        let displayValue = '0x' + stackData.hex;
        if (stackData.number !== undefined) displayValue = stackData.number.toString();
        else if (stackData.text !== undefined) displayValue = stackData.text;
        return getWhisper(key, stackData.hex, displayValue, stackData.label);
      }),
    [getWhisper],
  );

  return (
    <div className="script-editor-output-main-div">
      {lineStackDataListArray.map((lineStackDataList, lineNumber) => (
        <div className="script-editor-output-main" key={`script-editor-output-main-${lineNumber.toString()}`}>
          <span key={`editor-output-text-page-number-${lineNumber.toString()}`} className="editor-output-text-page-number">
            {lineNumber + 1}
          </span>

          <div className="script-editor-output-content"> {getWhispers(lineStackDataList, lineNumber)}</div>
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
