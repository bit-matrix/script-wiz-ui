/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import "./App.css";
import Editor, { useMonaco } from "@monaco-editor/react";

function App() {
  const monaco = useMonaco();

  useEffect(() => {
    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: "dummy" });

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider("dummy", {
        tokenizer: {
          root: [
            [/\[error.*/, "custom-error"],
            [/\[notice.*/, "custom-notice"],
            [/\""*/, "custom-info"],
            [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
          ],
        },
      });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme("scriptTheme", {
        base: "vs-dark",
        inherit: false,
        rules: [
          { token: "custom-info", foreground: "808080" },
          { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
          { token: "custom-notice", foreground: "FFA500" },
          { token: "custom-date", foreground: "008800" },
          { token: "", background: "1E1E1E" },
          { token: "", foreground: "FFFFFF" },
        ],
        colors: {
          "editor.foreground": "#FFFFFF",
          "editor.background": "#1E1E1E",
        },
      });

      monaco.languages.registerCompletionItemProvider("dummy", {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: "OP_ADD",
              kind: monaco.languages.CompletionItemKind.Text,
              insertText: "OP_ADD",
              range: {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 1,
              },
            },
            {
              label: "OP_SUB",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "testing(${1:condition})",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: 2,
                startColumn: 2,
                endLineNumber: 2,
                endColumn: 2,
              },
            },
            {
              label: "OP_SHA256",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: ["if (${1:condition}) {", "\t$0", "} else {", "\t", "}"].join("\n"),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "If-Else Statement",
              range: {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 0,
                endColumn: 0,
              },
            },
          ];
          return { suggestions: suggestions };
        },
      });
    }
  }, [monaco]);

  if (monaco != null) {
    return <Editor width="%100" language="dummy" height="100vh" theme="scriptTheme" />;
  }

  return null;
}

export default App;
