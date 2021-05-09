/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import "./App.css";
import Editor, { useMonaco } from "@monaco-editor/react";

// type EditorAutoClosingStrategy = "always" | "languageDefined" | "beforeWhitespace" | "never";
type CursorBlinking = "blink" | "smooth" | "phase" | "expand" | "solid";
type WrappingIndent = "none" | "same" | "indent" | "deepIndent";

const vibrantYellow = "ffd700";
const subtleGray = "666677";
const salmon = "d68d72";
const lightBlue = "8addff";
const blue = "3c9dda";
const fuchsia = "d081c4";
const oak = "d9daa2";
const red = "ff0000";
const mistBlue = "a8bcce";
const lightOlive = "b5cea8";
const darkOlive = "5bb498";

function App() {
  const monaco = useMonaco();

  useEffect(() => {
    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: "dummy" });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme("scriptTheme", {
        base: "vs-dark",
        inherit: false,
        rules: [
          { token: "delimiter.evaluation", foreground: vibrantYellow },
          { token: "delimiter.push", foreground: subtleGray },
          { token: "opcode.push", foreground: subtleGray },
          { token: "opcode.push-number", foreground: lightOlive },
          { token: "opcode.disabled", foreground: red },
          { token: "opcode.signature", foreground: fuchsia },
          { token: "opcode.flow-control", foreground: salmon },
          { token: "opcode.blocking", foreground: oak },
          { token: "opcode.other", foreground: blue },
          { token: "identifier", foreground: lightBlue },
          { token: "literal.bigint", foreground: lightOlive },
          { token: "literal.hex", foreground: darkOlive },
          { token: "literal.binary", foreground: mistBlue },
          { token: "invalid", foreground: red },
          { token: "", background: "1E1E1E" },
          { token: "", foreground: "ce9178" },
        ],
        colors: {
          "editor.foreground": "#FFFFFF",
          "editor.background": "#1E1E1E",
        },
      });

      monaco.languages.setLanguageConfiguration("dummy", {
        autoClosingPairs: [
          { open: "<", close: ">" },
          { open: "$(", close: ")" },
          { open: '"', close: '"', notIn: ["string"] },
          { open: "'", close: "'", notIn: ["string", "comment"] },
          { open: "/**", close: " */", notIn: ["string"] },
          { open: "OP_IF", close: " OP_ENDIF", notIn: ["string", "comment"] },
          { open: "OP_NOTIF", close: " OP_ENDIF", notIn: ["string", "comment"] },
        ],
        brackets: [
          ["<", ">"],
          ["$(", ")"],
        ],
        comments: {
          lineComment: "//",
          blockComment: ["/*", "*/"],
        },
        onEnterRules: [
          {
            // e.g. /** | */
            beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
            afterText: /^\s*\*\/$/,
            action: {
              indentAction: monaco.languages.IndentAction.IndentOutdent,
              appendText: " * ",
            },
          },
          {
            // e.g. /** ...|
            beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
            action: {
              indentAction: monaco.languages.IndentAction.None,
              appendText: " * ",
            },
          },
          {
            // e.g.  * ...|
            beforeText: /^(\t|[ ])*[ ]\*([ ]([^*]|\*(?!\/))*)?$/,
            afterText: /^(\s*(\/\*\*|\*)).*/,
            action: {
              indentAction: monaco.languages.IndentAction.None,
              appendText: "* ",
            },
          },
          {
            // e.g.  */|
            beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
            action: {
              indentAction: monaco.languages.IndentAction.None,
              removeText: 1,
            },
          },
          {
            // e.g.  *-----*/|
            beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
            action: {
              indentAction: monaco.languages.IndentAction.None,
              removeText: 1,
            },
          },
        ],
      });

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider("dummy", {
        bigint: /-?\d+(_+\d+)*/,
        brackets: [
          { open: "$(", close: ")", token: "delimiter.evaluation" },
          { open: "<", close: ">", token: "delimiter.push" },
        ],
        binary: /[01]+(?:[01_]*[01]+)*/,
        hex: /[0-9a-fA-F]_*(?:_*[0-9a-fA-F]_*[0-9a-fA-F]_*)*[0-9a-fA-F]/,
        tokenizer: {
          root: [
            // [/0b(@binary)/, "literal.binary"], // BinaryLiteral
            [
              /[a-zA-Z_][.a-zA-Z0-9_-]+/,
              {
                cases: {
                  // "@flowControlOpcodes": "opcode.flow-control",
                  // "@signatureCheckingOpcodes": "opcode.signature",
                  // "@blockingOpcodes": "opcode.blocking",
                  // "@pushBytesOpcodes": "opcode.push",
                  // "@pushNumberOpcodes": "opcode.push-number",
                  // "@disabledOpcodes": "opcode.disabled",
                  // "@otherOpcodes": "opcode.other",
                  "@default": "identifier",
                },
              },
            ],
            [/0x(@hex)/, "literal.hex"], // HexLiteral
            [/(@bigint)/, "literal.bigint"], // BigIntLiteral
            { include: "@whitespace" },
            [/[<>)]|\$\(/, "@brackets"],
            [/"/, "string", "@string_double"], // UTF8Literal
            [/'/, "string", "@string_single"], // UTF8Literal
          ],
          whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
          ],
          comment: [
            [/[^/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[/*]/, "comment"],
          ],
          string_double: [
            [/[^"$]+/, "string"],
            [/"/, "string", "@pop"],
          ],
          string_single: [
            [/[^'$]+/, "string"],
            [/'/, "string", "@pop"],
          ],
        },
      });

      monaco.languages.registerHoverProvider("dummy", {
        provideHover: function (model, position) {
          return {
            range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
            contents: [{ value: "**SOURCE**" }, { value: "Hello world" }],
          };
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
    const monacoOptions = {
      cursorBlinking: "smooth" as CursorBlinking,
      dragAndDrop: true,
      fontSize: 14,
      lineHeight: 18,
      fontFamily: "'Fira Mono', monospace",
      scrollBeyondLastLine: false,
      contextmenu: false,
      folding: false,
      wrappingIndent: "same" as WrappingIndent,
    };

    return <Editor width="%100" options={monacoOptions} language="dummy" height="100vh" theme="scriptTheme" />;
  }

  return null;
}

export default App;
