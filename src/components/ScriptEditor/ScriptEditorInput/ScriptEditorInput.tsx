/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  callbackEditorValue: (value: string) => void;
  scroolTop: number;
  scroolTopCallback: (value: number) => void;
};

const ScriptEditorInput: React.FC<Props> = ({
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

  const opcodesDatas: Opcode[] = useMemo(() => scriptWiz.opCodes.data, [scriptWiz]);

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
  }, [monaco, opcodesDatas, failedLineNumber, lng]);

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lines = convertEditorLines(value);

      onChangeScriptEditorInput(lines);
      callbackEditorValue(value);
    } else {
      onChangeScriptEditorInput([]);
    }
  };

  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: typeof Monaco) => {
    editorRef.current = editor;

    editor.setScrollPosition({ scrollTop: scroolTop });
    scroolTopCallback(editor.getScrollTop());

    editorRef.current.onDidScrollChange((param: any) => {
      scroolTopCallback(param.scrollTop);
    });
  };

  useEffect(() => {
    if (editorRef.current) editorRef.current.setScrollPosition({ scrollTop: scroolTop });
  }, []);

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
