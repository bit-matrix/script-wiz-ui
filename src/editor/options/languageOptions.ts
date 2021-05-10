/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable no-template-curly-in-string */
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { opWordCodes } from "@script-wiz/lib";

const languageConfigurations = (monaco: typeof Monaco.languages): Monaco.languages.LanguageConfiguration => {
  return {
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
          indentAction: monaco.IndentAction.IndentOutdent,
          appendText: " * ",
        },
      },
      {
        // e.g. /** ...|
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: " * ",
        },
      },
      {
        // e.g.  * ...|
        beforeText: /^(\t|[ ])*[ ]\*([ ]([^*]|\*(?!\/))*)?$/,
        afterText: /^(\s*(\/\*\*|\*)).*/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: "* ",
        },
      },
      {
        // e.g.  */|
        beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          removeText: 1,
        },
      },
      {
        // e.g.  *-----*/|
        beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          removeText: 1,
        },
      },
    ],
  };
};

const tokenProviders: Monaco.languages.IMonarchLanguage = {
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
};

const hoverProvider: Monaco.languages.HoverProvider = {
  provideHover: function (model: Monaco.editor.ITextModel, position: Monaco.Position, token: Monaco.CancellationToken) {
    // const modelValue = model.getValue();
    const query = model.getWordAtPosition(position);

    const currentModel = opWordCodes.find((opc) => opc.word === query?.word);

    const columns = model.getWordUntilPosition(position);
    const range: Monaco.IRange = {
      startColumn: columns.startColumn,
      endColumn: columns.endColumn,
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
    };

    if (currentModel !== undefined) {
      return {
        range,
        contents: [{ value: currentModel.word }, { value: currentModel.description || "" }, { value: "compiled:" + currentModel.hex }],
      };
    }

    return {
      range,
      contents: [{ value: "**SOURCE**" }, { value: "Hello world" }],
    };
  },
};

const languageSuggestions = (monaco: typeof Monaco.languages, model: Monaco.editor.ITextModel, position: Monaco.Position): Monaco.languages.CompletionItem[] => {
  // const query = model.getWordAtPosition(position);
  const columns = model.getWordUntilPosition(position);

  const range: Monaco.IRange = {
    startColumn: columns.startColumn,
    endColumn: columns.endColumn,
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
  };

  return opWordCodes.map((opc) => ({
    label: opc.word,
    insertText: opc.word,
    kind: monaco.CompletionItemKind.Function,
    range,
    documentation: opc.description,
    detail: opc.description,
  }));
  // return [
  //   {
  //     label: "OP_ADD",
  //     kind: monaco.CompletionItemKind.Function,
  //     insertText: "OP_ADD",

  //     range,
  //   },
  //   {
  //     label: "OP_SUB",
  //     kind: monaco.CompletionItemKind.Function,
  //     insertText: "testing(${1:condition})",
  //     insertTextRules: monaco.CompletionItemInsertTextRule.InsertAsSnippet,
  //     range,
  //   },
  //   {
  //     label: "OP_SHA256",
  //     kind: monaco.CompletionItemKind.Function,
  //     insertText: ["if (${1:condition}) {", "\t$0", "} else {", "\t", "}"].join("\n"),
  //     insertTextRules: monaco.CompletionItemInsertTextRule.InsertAsSnippet,
  //     documentation: "If-Else Statement",
  //     range,
  //   },
  // ];
};

export { languageConfigurations, tokenProviders, hoverProvider, languageSuggestions };
