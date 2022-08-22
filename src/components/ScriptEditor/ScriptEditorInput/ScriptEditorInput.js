/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as languageOptions from '../../../options/editorOptions/languageOptions';
import themeOptions from '../../../options/editorOptions/themeOptions';
import Editor, { useMonaco } from '@monaco-editor/react';
import editorOptions from '../../../options/editorOptions/editorOptions';
import { scriptWizEditor } from '../../../options/editorOptions/utils/constant';
import { convertEditorLines } from '../../../helper';
import './ScriptEditorInput.scss';

const ScriptEditorInput = ({
  scriptWiz,
  initialEditorValue,
  onChangeScriptEditorInput,
  failedLineNumber = undefined,
  callbackEditorValue,
  scroolTop,
  scroolTopCallback,
}) => {
  const [lng] = useState(scriptWizEditor.LANGUAGE + (Math.random() * 1000).toFixed(2));
  const monaco = useMonaco();

  const opcodesDatas = useMemo(() => scriptWiz.opCodes.data, [scriptWiz]);

  useEffect(() => {
    let disposeLanguageConfiguration = () => {};
    let disposeMonarchTokensProvider = () => {};
    let disposeHoverProvider = () => {};
    let disposeCompletionItemProvider = () => {};

    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: lng });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme(scriptWizEditor.THEME, themeOptions);

      const { dispose: disposeSetLanguageConfiguration } = monaco.languages.setLanguageConfiguration(
        lng,
        languageOptions.languageConfigurations(monaco.languages),
      );
      disposeLanguageConfiguration = disposeSetLanguageConfiguration;

      // Register a tokens provider for the language
      const { dispose: disposeSetMonarchTokensProvider } = monaco.languages.setMonarchTokensProvider(lng, languageOptions.tokenProviders);
      disposeMonarchTokensProvider = disposeSetMonarchTokensProvider;

      const { dispose: disposeRegisterHoverProvider } = monaco.languages.registerHoverProvider(
        lng,
        languageOptions.hoverProvider(opcodesDatas, failedLineNumber),
      );
      disposeHoverProvider = disposeRegisterHoverProvider;

      const { dispose: disposeRegisterCompletionItemProvider } = monaco.languages.registerCompletionItemProvider(lng, {
        provideCompletionItems: (model, position) => {
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
  }, [monaco, opcodesDatas, failedLineNumber, lng]);

  const onChangeEditor = (value, ev) => {
    if (value) {
      let lines = convertEditorLines(value);

      onChangeScriptEditorInput(lines);
      callbackEditorValue(value);
    } else {
      onChangeScriptEditorInput([]);
    }
  };

  const editorRef = useRef();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.setScrollPosition({ scrollTop });
    scroolTopCallback(editor.getScrollTop());

    editorRef.current.onDidScrollChange((param) => {
      scroolTopCallback(param.scrollTop);
    });
  };

  if (editorRef.current) editorRef.current.setScrollPosition({ scrollTop });

  if (monaco != null) {
    return (
      <Editor
        className="script-wiz-monaco-editor"
        onMount={handleEditorDidMount}
        value={initialEditorValue}
        options={editorOptions}
        language={lng}
        theme={scriptWizEditor.THEME}
        onChange={onChangeEditor}
      />
    );
  }

  return null;
};

export default ScriptEditorInput;
