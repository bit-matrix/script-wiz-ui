/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import "./App.css";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";

function App() {
  const monaco: Monaco = useMonaco();

  useEffect(() => {
    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: "dummy" });

      monaco.languages.registerCompletionItemProvider("dummy", {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: "OP_ADD",
              kind: monaco.languages.CompletionItemKind.Text,
              insertText: "OP_ADD",
              // range: {
              //   startLineNumber: 1,
              //   startColumn: 1,
              //   endLineNumber: 1,
              //   endColumn: 1,
              // },
            },
            {
              label: "OP_SUB",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "testing(${1:condition})",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              // range: {
              //   startLineNumber: 2,
              //   startColumn: 2,
              //   endLineNumber: 2,
              //   endColumn: 2,
              // },
            },
            {
              label: "OP_SHA256",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: ["if (${1:condition}) {", "\t$0", "} else {", "\t", "}"].join("\n"),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "If-Else Statement",
              // range: {
              //   startLineNumber: 0,
              //   startColumn: 0,
              //   endLineNumber: 0,
              //   endColumn: 0,
              // },
            },
          ];
          return { suggestions: suggestions };
        },
      });
    }
  }, [monaco]);

  // const options = {
  //   autoClosingBrackets: "always",
  //   autoClosingPairs: "open",
  //   brackets: [
  //     ["<", ">"],
  //     ["$(", ")"],
  //   ],
  // };

  return <Editor width="%100" language="dummy" height="100vh" theme="vs-dark" />;
}

export default App;
