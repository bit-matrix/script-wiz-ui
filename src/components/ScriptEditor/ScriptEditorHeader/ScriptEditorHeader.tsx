import React from "react";
import "./ScriptEditorHeader.scss";

const ScriptEditorHeader = () => {
    return (
        <div className="script-editor-headers-main">
            <div className="script-editor-header-sub-item editor">Editor</div>
            <div className="script-editor-header-sub-item stack">Stack</div>
        </div>
    );
};

export default ScriptEditorHeader;
