/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { scriptWizEditor } from "./editor/utils/constant";
import themeOptions from "./editor/options/themeOptions";
import editorOptions from "./editor/options/editorOptions";
import * as languageOptions from "./editor/options/languageOptions";
import "./App.css";

function App() {
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
        provideCompletionItems: () => {
          const suggestions = languageOptions.languageSuggestions(monaco.languages);
          return { suggestions: suggestions };
        },
      });
    }
  }, [monaco]);

  if (monaco != null) {
    return <Editor width="%100" options={editorOptions} language={scriptWizEditor.LANGUAGE} height="100vh" theme={scriptWizEditor.THEME} />;
  }

  return null;
}

export default App;
