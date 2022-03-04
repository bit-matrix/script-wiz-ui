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
  const contentRef = useRef<HTMLInputElement>(null);
  const linesRef = useRef<HTMLInputElement>(null);

  if (contentRef.current !== null) {
    contentRef.current.scrollTop = scroolTop;
  }

  if (linesRef.current !== null) {
    linesRef.current.scrollTop = scroolTop;
  }

  return (
    <div className="script-editor-output-main-div">
      <div
        className="script-editor-output-lines"
        ref={linesRef}
        onScroll={(event: React.UIEvent<HTMLDivElement>) => {
          scroolTopCallback(event);
          if (contentRef.current !== null) {
            contentRef.current.scrollTop = event.currentTarget.scrollTop;
          }
        }}
      >
        {lineStackDataListArray.map((lineStackDataList, lineNumber: number) => (
          <div key={`editor-output-text-page-number-${lineNumber.toString()}`} className="editor-output-text-page-number">
            {lineNumber + 1}
          </div>
        ))}
      </div>
      <div
        className="script-editor-output-content"
        onScroll={(event: React.UIEvent<HTMLDivElement>) => {
          scroolTopCallback(event);
          if (linesRef.current !== null) {
            linesRef.current.scrollTop = event.currentTarget.scrollTop;
          }
        }}
        ref={contentRef}
      >
        {lineStackDataListArray.map((lineStackDataList, lineNumber: number) => (
          <div className="script-editor-output-main" key={`script-editor-output-main-${lineNumber.toString()}`}>
            {getWhispers(lineStackDataList, lineNumber)}
            <br />
          </div>
        ))}
      </div>

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
