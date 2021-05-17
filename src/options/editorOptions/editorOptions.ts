import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

const editorOptions: Monaco.editor.IEditorConstructionOptions = {
    cursorBlinking: "smooth",
    dragAndDrop: true,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "'Fira Mono', monospace",
    scrollBeyondLastLine: false,
    contextmenu: false,
    folding: false,
    wrappingIndent: "same",
    minimap: { enabled: false },
    scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
        alwaysConsumeMouseWheel: false,
        horizontal: "hidden",
    },
};

export default editorOptions;
