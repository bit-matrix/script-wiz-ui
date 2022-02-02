/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as languageOptions from '../../../options/editorOptions/languageOptions';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import themeOptions from '../../../options/editorOptions/themeOptions';
import Editor, { useMonaco } from '@monaco-editor/react';
import editorOptions from '../../../options/editorOptions/editorOptions';

import { scriptWizEditor } from '../../../options/editorOptions/utils/constant';
import { convertEditorLines } from '../../../helper';
import { ScriptWiz } from '@script-wiz/lib';
import { Opcode } from '@script-wiz/lib/opcodes/model/Opcode';

import './ScriptEditorInput.scss';

type Props = {
  scriptWiz: ScriptWiz;
  initialEditorValue: string;
  onChangeScriptEditorInput: (lines: string[]) => void;
  failedLineNumber?: number;
};

const ScriptEditorInput: React.FC<Props> = ({ scriptWiz, initialEditorValue, onChangeScriptEditorInput, failedLineNumber = undefined }) => {
  const [finalEditorValue, setFinalEditorValue] = useState<string>();

  const monaco = useMonaco();

  const opcodesDatas: Opcode[] = useMemo(() => scriptWiz.opCodes.data, [scriptWiz]);

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

      onChangeScriptEditorInput(lines);
      setFinalEditorValue(value);
    } else {
      onChangeScriptEditorInput([]);
      localStorage.removeItem('scriptWizEditor');
    }
  };

  // Things to do before unloading/closing the tab
  const saveLocalStorageData = useCallback(() => {
    if (finalEditorValue) {
      const currentLocalStorage = localStorage.getItem('scriptWizEditor');

      //check local storage
      if (currentLocalStorage !== null) {
        const currentLocalStorageArray = JSON.parse(currentLocalStorage);
        const newLocalStorageArray = [...currentLocalStorageArray];

        //current scriptWiz.vm index
        const currentIndex = newLocalStorageArray.findIndex((nls) => {
          return nls.vm.network === scriptWiz.vm.network && nls.vm.ver === scriptWiz.vm.ver;
        });

        //local storage has same version data
        if (currentIndex > -1) {
          newLocalStorageArray[currentIndex].editorLines = finalEditorValue;
        } else {
          newLocalStorageArray.push({ editorLines: finalEditorValue, vm: scriptWiz.vm });
        }

        localStorage.setItem('scriptWizEditor', JSON.stringify(newLocalStorageArray));
      } else {
        //if local storage is empty
        const localStorageValue = [{ editorLines: finalEditorValue, vm: scriptWiz.vm }];

        localStorage.setItem('scriptWizEditor', JSON.stringify(localStorageValue));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalEditorValue]);

  // Setup the `beforeunload` event listener
  const setupBeforeUnloadListener = useCallback(() => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      return saveLocalStorageData();
    });
  }, [saveLocalStorageData]);

  useEffect(() => {
    // Activate the event listener
    setupBeforeUnloadListener();
  }, [setupBeforeUnloadListener]);

  useEffect(() => {
    saveLocalStorageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptWiz.vm]);

  if (monaco != null) {
    return (
      <Editor
        className="script-wiz-monaco-editor"
        onMount={() => {
          console.log('loading state');
        }}
        value={initialEditorValue}
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
