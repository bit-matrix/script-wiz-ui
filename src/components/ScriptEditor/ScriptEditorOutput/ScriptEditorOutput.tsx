import React, { useRef } from 'react';
import WizData from '@script-wiz/wiz-data';
import BanIcon from '../../Svg/Icons/Ban';
import { getWhispers } from '../../../helper/getWhispers';
import './ScriptEditorOutput.scss';

type Props = {
  lineStackDataListArray: Array<Array<WizData>>;
  errorMessage?: string;
  scroolTop: number;
  scroolTopCallback: (event: React.UIEvent<HTMLDivElement>) => void;
};

const ScriptEditorOutput: React.FC<Props> = ({ lineStackDataListArray, errorMessage, scroolTop, scroolTopCallback }) => {
  const divRef = useRef<HTMLInputElement>(null);

  if (divRef.current !== null) {
    divRef.current.scrollTop = scroolTop;
  }

  return (
    <div className="script-editor-output-main-div" onScroll={scroolTopCallback} ref={divRef}>
      {lineStackDataListArray.map((lineStackDataList, lineNumber: number) => (
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
