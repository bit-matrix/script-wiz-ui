/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';

import * as languageOptions from '../../../options/editorOptions/languageOptions';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import themeOptions from '../../../options/editorOptions/themeOptions';
import Editor, { useMonaco } from '@monaco-editor/react';
import editorOptions from '../../../options/editorOptions/editorOptions';

import { scriptWizEditor } from '../../../options/editorOptions/utils/constant';
import { initialBitcoinEditorValue, initialLiquidEditorValue } from './initialEditorValue';
import { convertEditorLines } from '../../../helper';
import { ScriptWiz, VM, VM_NETWORK } from '@script-wiz/lib';
import { Opcode } from '@script-wiz/lib/opcodes/model/Opcode';
import './ScriptEditorInput.scss';

type Props = {
  scriptWiz: ScriptWiz;
  onChangeScriptEditorInput: (lines: string[]) => void;
  failedLineNumber?: number;
  disabledLineNumbers?: Array<number>;
};

const ScriptEditorInput: React.FC<Props> = ({ scriptWiz, onChangeScriptEditorInput, failedLineNumber = undefined, disabledLineNumbers = [] }) => {
  const monaco = useMonaco();

  const opcodesDatas: Opcode[] = useMemo(() => scriptWiz.opCodes.data, [scriptWiz]);

  const [editor, setEditor] = useState<Monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    let disposeLanguageConfiguration = () => {};
    let disposeMonarchTokensProvider = () => {};
    let disposeHoverProvider = () => {};
    let disposeCompletionItemProvider = () => {};

    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: scriptWizEditor.LANGUAGE });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme(scriptWizEditor.THEME, themeOptions);

      const { dispose: disposeSetLanguageConfiguration } = monaco.languages.setLanguageConfiguration(
        scriptWizEditor.LANGUAGE,
        languageOptions.languageConfigurations(monaco.languages),
      );
      disposeLanguageConfiguration = disposeSetLanguageConfiguration;

      // Register a tokens provider for the language
      const { dispose: disposeSetMonarchTokensProvider } = monaco.languages.setMonarchTokensProvider(
        scriptWizEditor.LANGUAGE,
        languageOptions.tokenProviders,
      );
      disposeMonarchTokensProvider = disposeSetMonarchTokensProvider;

      const { dispose: disposeRegisterHoverProvider } = monaco.languages.registerHoverProvider(
        scriptWizEditor.LANGUAGE,
        languageOptions.hoverProvider(opcodesDatas, failedLineNumber),
      );
      disposeHoverProvider = disposeRegisterHoverProvider;

      const { dispose: disposeRegisterCompletionItemProvider } = monaco.languages.registerCompletionItemProvider(scriptWizEditor.LANGUAGE, {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = languageOptions.languageSuggestions(monaco.languages, model, position, opcodesDatas);
          return { suggestions: suggestions };
        },
      });
      disposeCompletionItemProvider = disposeRegisterCompletionItemProvider;
    }

    return () => {
      if (monaco !== undefined) {
        // monaco.editor.getModels().forEach((model) => model.dispose());

        disposeLanguageConfiguration();
        disposeMonarchTokensProvider();
        disposeHoverProvider();
        disposeCompletionItemProvider();
      }
    };
  }, [monaco, opcodesDatas, failedLineNumber]);

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lines = convertEditorLines(value);

      if (disabledLineNumbers && disabledLineNumbers?.length > 0) {
        const newDisabledLineNumbers = [...disabledLineNumbers];
        newDisabledLineNumbers.splice(0, 1);

        const range = newDisabledLineNumbers.map((disabledLineNumber) => {
          const disabledLine = lines[disabledLineNumber - 1];

          if (disabledLine.startsWith('<') && disabledLine.endsWith('>')) {
            return {
              range: {
                startColumn: 2,
                endColumn: lines[disabledLineNumber - 1].length,
                startLineNumber: disabledLineNumber,
                endLineNumber: disabledLineNumber,
              },
              options: { inlineClassName: 'unexecuted-sample' },
            };
          }
          return {
            range: {
              startColumn: 0,
              endColumn: 0,
              startLineNumber: 0,
              endLineNumber: 0,
            },
            options: {},
          };
        });

        editor?.deltaDecorations([], range);
      }

      onChangeScriptEditorInput(lines);
    } else {
      onChangeScriptEditorInput([]);
    }
  };

  if (monaco != null) {
    return (
      <Editor
        className="script-wiz-monaco-editor"
        onMount={(e) => {
          console.log('loading state');
          setEditor(e);
        }}
        value={scriptWiz.vm.network === VM_NETWORK.BTC ? initialBitcoinEditorValue : initialLiquidEditorValue}
        options={editorOptions}
        language={scriptWizEditor.LANGUAGE}
        theme={scriptWizEditor.THEME}
        onChange={onChangeEditor}
      />
    );
  }

  return null;
};

export default ScriptEditorInput;
