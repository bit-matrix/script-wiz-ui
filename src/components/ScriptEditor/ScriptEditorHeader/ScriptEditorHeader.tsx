import { ScriptWiz } from '@script-wiz/lib';
import React from 'react';
import { Tooltip, Whisper } from 'rsuite';
import DownloadIcon from '../../Svg/Icons/Download';
import SaveIcon from '../../Svg/Icons/Save';
import TrashIcon from '../../Svg/Icons/Trash';
import TerminalIcon from '../../Svg/Icons/Terminal';
import './ScriptEditorHeader.scss';

type Props = {
  scriptWiz: ScriptWiz;
  saveButtonVisibility: boolean;
  clearButtonVisibility: boolean;
  compileButtonClick: () => void;
  txTemplateClick: () => void;
  saveEditorClick: () => void;
  clearEditorClick: () => void;
};

const ScriptEditorHeader: React.FC<Props> = ({
  scriptWiz,
  saveButtonVisibility,
  clearButtonVisibility,
  compileButtonClick,
  txTemplateClick,
  saveEditorClick,
  clearEditorClick,
}) => {
  return (
    <div className="script-editor-headers-main">
      <div className="script-editor-header-sub-item editor">
        Editor
        <div className="compile-button">
          {saveButtonVisibility && (
            <Whisper placement="top" trigger="hover" speaker={<Tooltip>Save Editor</Tooltip>}>
              <div onClick={saveEditorClick} className="tx-template-icon">
                <SaveIcon width="1rem" height="1rem" />
              </div>
            </Whisper>
          )}
          {clearButtonVisibility && (
            <Whisper placement="top" trigger="hover" speaker={<Tooltip>Clear Editor</Tooltip>}>
              <div onClick={clearEditorClick} className="tx-template-icon">
                <TrashIcon width="1rem" height="1rem" />
              </div>
            </Whisper>
          )}

          <Whisper placement="top" trigger="hover" speaker={<Tooltip>Import your transaction template</Tooltip>}>
            <div onClick={txTemplateClick} className="tx-template-icon">
              <DownloadIcon width="1rem" height="1rem" />
            </div>
          </Whisper>

          <Whisper placement="top" trigger="hover" speaker={<Tooltip>Compile your script</Tooltip>}>
            <div onClick={compileButtonClick} className="script-icon">
              <TerminalIcon width="1rem" height="1rem" />
            </div>
          </Whisper>
        </div>
      </div>
      <div className="script-editor-header-sub-item stack">Stack</div>
    </div>
  );
};

export default ScriptEditorHeader;
