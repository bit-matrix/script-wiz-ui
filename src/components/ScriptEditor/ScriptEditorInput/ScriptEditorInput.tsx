/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo } from 'react';

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
};

const ScriptEditorInput: React.FC<Props> = ({ scriptWiz, onChangeScriptEditorInput }) => {
  const monaco = useMonaco();

  const opcodesDatas: Opcode[] = useMemo(() => scriptWiz.opCodes.data, [scriptWiz]);

  useEffect(() => {
    let dispos = () => {};

    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: scriptWizEditor.LANGUAGE });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme(scriptWizEditor.THEME, themeOptions);

      monaco.languages.setLanguageConfiguration(scriptWizEditor.LANGUAGE, languageOptions.languageConfigurations(monaco.languages));

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider(scriptWizEditor.LANGUAGE, languageOptions.tokenProviders);

      monaco.languages.registerHoverProvider(scriptWizEditor.LANGUAGE, languageOptions.hoverProvider(opcodesDatas));

      const { dispose } = monaco.languages.registerCompletionItemProvider(scriptWizEditor.LANGUAGE, {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = languageOptions.languageSuggestions(monaco.languages, model, position, opcodesDatas);
          return { suggestions: suggestions };
        },
      });

      dispos = dispose;
    }

    return () => {
      if (monaco !== undefined && dispos !== undefined) {
        dispos();
        // monaco.editor.getModels().forEach((model) => model.dispose());
      }
    };
  }, [monaco, opcodesDatas]);

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lines = convertEditorLines(value);

      onChangeScriptEditorInput(lines);
    } else {
      onChangeScriptEditorInput([]);
    }
  };

  if (monaco != null) {
    return (
      <Editor
        className="script-wiz-monaco-editor"
        onMount={() => {
          console.log('loading state');
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
