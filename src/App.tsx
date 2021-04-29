/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import "./App.css";
import * as monaco from "monaco-editor";

function App() {
  useEffect(() => {
    monaco.languages.register({ id: "dummy" });
    monaco.editor.defineTheme("myCoolTheme", {
      colors: {
        "editor.lineHighlightBackground": "#0000FF20",
      },
      // base: "vs-dark",
      base: "vs",
      inherit: false,
      rules: [
        { token: "custom-info", foreground: "808080" },
        { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
        { token: "custom-notice", foreground: "FFA500" },
        { token: "custom-date", foreground: "008800" },
      ],
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

    const doc = document.getElementById("container");
    if (doc) {
      monaco.editor.create(doc, {
        theme: "myCoolTheme",
        language: "dummy",
        matchBrackets: "always",
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoIndent: "full",
        colorDecorators: true,
        formatOnPaste: true,
      });
    }
  }, []);

  // const options = {
  //   autoClosingBrackets: "always",
  //   autoClosingPairs: "open",
  //   brackets: [
  //     ["<", ">"],
  //     ["$(", ")"],
  //   ],
  // };

  return <div id="container" style={{ width: "100vw", height: "100vh" }} />;
}

export default App;
