import React from 'react';
import { Icon, IconButton, Tooltip, Whisper } from 'rsuite';
import './ScriptEditorHeader.scss';

type Props = {
  compileButtonClick: () => void;
  txTemplateClick: () => void;
};

const ScriptEditorHeader: React.FC<Props> = ({ compileButtonClick, txTemplateClick }) => {
  return (
    <div className="script-editor-headers-main">
      <div className="script-editor-header-sub-item editor">
        Editor
        <div className="compile-button">
          <Whisper placement="top" trigger="hover" speaker={<Tooltip>Import your transaction template</Tooltip>}>
            <IconButton className="tx-template-icon" icon={<Icon icon="download" />} circle size="sm" onClick={txTemplateClick} />
          </Whisper>
          <Whisper placement="top" trigger="hover" speaker={<Tooltip>Compile your script</Tooltip>}>
            <IconButton icon={<Icon icon="terminal" />} circle size="sm" onClick={compileButtonClick} />
          </Whisper>
        </div>
      </div>
      <div className="script-editor-header-sub-item stack">Stack</div>
    </div>
  );
};

export default ScriptEditorHeader;
