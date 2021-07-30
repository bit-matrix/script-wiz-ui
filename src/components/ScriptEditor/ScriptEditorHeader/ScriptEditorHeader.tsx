import React from 'react';
import { Icon, IconButton, Tooltip, Whisper } from 'rsuite';
import './ScriptEditorHeader.scss';

type Props = {
  compileButtonClick: () => void;
};

const ScriptEditorHeader: React.FC<Props> = ({ compileButtonClick }) => {
  return (
    <div className="script-editor-headers-main">
      <div className="script-editor-header-sub-item editor">
        Editor
        <Whisper placement="top" trigger="hover" speaker={<Tooltip>Compile your script</Tooltip>}>
          <IconButton className="compile-button" icon={<Icon icon="terminal" />} circle size="sm" onClick={compileButtonClick} />
        </Whisper>
      </div>
      <div className="script-editor-header-sub-item stack">Stack</div>
    </div>
  );
};

export default ScriptEditorHeader;
