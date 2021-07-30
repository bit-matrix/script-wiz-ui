import React, { useCallback } from 'react';
import './ScriptEditorOutput.scss';
import { Icon } from 'rsuite';
import { WizData } from '@script-wiz/lib';

type Props = {
  lastStackDataList: Array<WizData>;
  lineStackDataListArray: Array<Array<WizData>>;
  errorMessage: string | undefined;
};

const ScriptEditorOutput: React.FC<Props> = ({ lastStackDataList, lineStackDataListArray, errorMessage }) => {
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
    (key: string, tooltip: string, display: string) => (
      <div className="tooltip" key={key}>
        <div className={`editor-output-text ${getOutputValueType(display)} `}>{display}</div>
        <span className="tooltiptext">{tooltip}</span>
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

        return getWhisper(key, stackData.hex, displayValue);
      }),
    [getWhisper],
  );

  // const getWhisper = (key: string, tooltip: string, display: string) => (
  //     <Whisper
  //         key={key}
  //         delayShow={100}
  //         placement="rightEnd"
  //         trigger="hover"
  //         speaker={
  //             <Tooltip className="whisper-tooltip">
  //                 Compiled : {tooltip}
  //             </Tooltip>
  //         }
  //     >
  //         <span
  //             className={`editor-output-text ${getOutputValueType(display)} `}
  //         >
  //             {display}
  //         </span>
  //     </Whisper>
  // );

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
          <span className="error-message">
            <Icon icon="ban" className="error-message-ban-icon" />
            {errorMessage}
          </span>
        </div>
      ) : undefined}
    </>
  );
};

export default ScriptEditorOutput;
