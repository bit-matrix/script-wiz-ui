/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import * as languageOptions from "../../editor/options/languageOptions";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import themeOptions from "../../editor/options/themeOptions";
import Editor, { useMonaco } from "@monaco-editor/react";
import editorOptions from "../../editor/options/editorOptions";

import { scriptWizEditor } from "../../editor/utils/constant";

interface IScriptEditorInput {
  onChangeScriptEditorInput: (lines: string[]) => void;
}

const ScriptEditorInput: React.FC<IScriptEditorInput> = ({ onChangeScriptEditorInput }) => {
  const monaco = useMonaco();

  useEffect(() => {
    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: scriptWizEditor.LANGUAGE });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme(scriptWizEditor.THEME, themeOptions);

      monaco.languages.setLanguageConfiguration(scriptWizEditor.LANGUAGE, languageOptions.languageConfigurations(monaco.languages));

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider(scriptWizEditor.LANGUAGE, languageOptions.tokenProviders);

      monaco.languages.registerHoverProvider(scriptWizEditor.LANGUAGE, languageOptions.hoverProvider);

      monaco.languages.registerCompletionItemProvider(scriptWizEditor.LANGUAGE, {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = languageOptions.languageSuggestions(monaco.languages, model, position);
          return { suggestions: suggestions };
        },
      });
    }

    /*    return () => {
      if (monaco) {
        monaco.editor.getModels().forEach((model) => model.dispose());
      }
    }; */
  }, [monaco]);

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lines = value.split("\n");
      lines = lines.map((line) => line.trim());
      // TODO all replace list for format chars
      lines = lines.map((line) => line.replaceAll("\r", ""));
      lines = lines.map((line) => line.replaceAll("\t", ""));
      onChangeScriptEditorInput(lines);
    }
  };

  if (monaco != null) {
    return (
      <Editor
        height="100vh"
        width="100%"
        onMount={() => {
          console.log("loading state");
        }}
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
