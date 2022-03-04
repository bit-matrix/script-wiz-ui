import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

const editorOptions: Monaco.editor.IEditorConstructionOptions = {
  cursorBlinking: 'smooth',
  dragAndDrop: true,
  fontSize: 14,
  lineHeight: 18,
  fontFamily: "'Fira Mono', monospace",
  scrollBeyondLastLine: false,
  contextmenu: false,
  folding: false,
  wordWrap: 'off',
  wrappingIndent: 'same',
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
    alwaysConsumeMouseWheel: true,
    vertical: 'hidden',
  },

  smoothScrolling: true,
  mouseWheelScrollSensitivity: 1,
  fastScrollSensitivity: 1,
};

export default editorOptions;
