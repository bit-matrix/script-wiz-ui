/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable no-template-curly-in-string */
import { languageBTC } from './utils/btc-language';
import { lineCompile } from './utils/lineCompile';

const languageConfigurations = (monaco) => {
  return {
    autoClosingPairs: [
      { open: '<', close: '>' },
      { open: '$(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
      { open: "'", close: "'", notIn: ['string', 'comment'] },
      { open: '/**', close: ' */', notIn: ['string'] },
      { open: 'OP_IF', close: ' OP_ENDIF', notIn: ['string', 'comment'] },
      {
        open: 'OP_NOTIF',
        close: ' OP_ENDIF',
        notIn: ['string', 'comment'],
      },
    ],
    brackets: [
      ['<', '>'],
      ['$(', ')'],
    ],

    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    onEnterRules: [
      {
        // e.g. /** | */
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        afterText: /^\s*\*\/$/,
        action: {
          indentAction: monaco.IndentAction.IndentOutdent,
          appendText: ' * ',
        },
      },
      {
        // e.g. /** ...|
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: ' * ',
        },
      },
      {
        // e.g.  * ...|
        beforeText: /^(\t|[ ])*[ ]\*([ ]([^*]|\*(?!\/))*)?$/,
        afterText: /^(\s*(\/\*\*|\*)).*/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: '* ',
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

const tokenProviders = {
  bigint: /-?\d+(_+\d+)*/,
  brackets: [
    { open: '$(', close: ')', token: 'delimiter.evaluation' },
    { open: '<', close: '>', token: 'delimiter.push' },
  ],
  binary: /[01]+(?:[01_]*[01]+)*/,
  hex: /[0-9a-fA-F]_*(?:_*[0-9a-fA-F]_*[0-9a-fA-F]_*)*[0-9a-fA-F]/,
  flowControlOpcodes: languageBTC.flowControlOpcodes,
  arithmeticOpcodes: languageBTC.arithmeticOpcodes,
  blockingOpcodes: languageBTC.blockingOpcodes,
  cryptoOpcodes: languageBTC.cryptoOpcodes,
  pushNumberOpcodes: languageBTC.pushNumberOpcodes,
  disabledOpcodes: [...languageBTC.disabledOpcodes, ...languageBTC.nopOpcodes],
  otherOpcodes: languageBTC.otherOpcodes,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_][.a-zA-Z0-9_-]+/,
        {
          cases: {
            '@flowControlOpcodes': 'opcode.flow-control',
            '@arithmeticOpcodes': 'opcode.arithmetic',
            '@blockingOpcodes': 'opcode.blocking',
            '@cryptoOpcodes': 'opcode.crypto',
            '@pushNumberOpcodes': 'opcode.push-number',
            '@disabledOpcodes': 'opcode.disabled',
            '@otherOpcodes': 'opcode.other',
            '@default': 'identifier',
          },
        },
      ],
      [/0x(@hex)/, 'literal.hex'], // HexLiteral
      [/(@bigint)/, 'literal.bigint'], // BigIntLiteral
      { include: '@whitespace' },
      [/[<>)]|\$\(/, '@brackets'],
      [/"/, 'string', '@string_double'], // UTF8Literal
      [/'/, 'string', '@string_single'], // UTF8Literal
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],
    string_double: [
      [/[^"$]+/, 'string'],
      [/"/, 'string', '@pop'],
    ],
    string_single: [
      [/[^'$]+/, 'string'],
      [/'/, 'string', '@pop'],
    ],
  },
};

const hoverProvider = (opcodesDatas, failedLineNumber) => {
  const hoverProvider = {
    provideHover: function (model, position, token) {
      const modelValue = model.getValue(); // all lines

      const query = model.getWordAtPosition(position); //["word",positions]

      const queryWord = query?.word || '';

      const currentModel = opcodesDatas.find((opc) => opc.word === queryWord);

      const columns = model.getWordUntilPosition(position);
      const range = {
        startColumn: columns.startColumn,
        endColumn: columns.endColumn,
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
      };

      if (currentModel !== undefined) {
        return {
          range,
          contents: [{ value: currentModel.word }, { value: currentModel.description || '' }, { value: 'compiled:' + currentModel.hex }],
        };
      }

      let lines = modelValue.split('\n');
      lines = lines.map((line) => line.trim());
      lines = lines.map((line) => line.replaceAll('\r', ''));
      lines = lines.map((line) => line.replaceAll('\t', ''));

      const currentLineValue = lines[position.lineNumber - 1];

      let compiledValue = '';

      try {
        if (currentLineValue.startsWith('<') && currentLineValue.endsWith('>')) {
          const finalInput = currentLineValue.substr(1, currentLineValue.length - 2);
          compiledValue = '0x' + lineCompile(finalInput).hex;
        } else {
          compiledValue = '0x' + lineCompile(currentLineValue).hex;
        }
      } catch (error) {
        compiledValue = `Unknown identifier '${currentLineValue}'.`;
      }

      if (failedLineNumber && failedLineNumber < position.lineNumber) {
        return { range, contents: [{ value: '' }] };
      }

      return {
        range,
        contents: [{ value: 'Compiled : ' + compiledValue }],
      };
    },
  };

  return hoverProvider;
};

const languageSuggestions = (monaco, model, position, opcodesDatas) => {
  // const query = model.getWordAtPosition(position);
  const columns = model.getWordUntilPosition(position);

  const range = {
    startColumn: columns.startColumn,
    endColumn: columns.endColumn,
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
  };

  return opcodesDatas.map((opc) => ({
    label: opc.word,
    insertText: opc.word,
    kind: monaco.CompletionItemKind.Function,
    range,
    documentation: opc.description,
    detail: opc.description,
  }));
};

export { languageConfigurations, tokenProviders, hoverProvider, languageSuggestions };
