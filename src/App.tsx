/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as scriptWiz from "@script-wiz/lib";
import { scriptWizEditor } from "./editor/utils/constant";
import themeOptions from "./editor/options/themeOptions";
import editorOptions from "./editor/options/editorOptions";
import * as languageOptions from "./editor/options/languageOptions";
import IStackData from "../../script-wiz-lib/dist/model/IStackData";
import "./App.css";

const initialStackDataList: Array<IStackData | undefined> = [];

function App() {
  const [stackDataList, setStackDataList] = useState<Array<IStackData | undefined>>(initialStackDataList);

  const monaco = useMonaco();

  const compile = (lines: string[]) => {
    setStackDataList(initialStackDataList);
    scriptWiz.clearStack();
    const newStackDataList: Array<IStackData | undefined> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let newStackData: IStackData | undefined = undefined;

      try {
        if (line !== "") {
          const libStackDataList = scriptWiz.parse(line);
          newStackData = libStackDataList.main[libStackDataList.main.length - 1];
        }
        newStackDataList.push(newStackData);
      } catch (e) {
        newStackData = e;
        newStackDataList.push(newStackData);
        continue;
      }
    }

    setStackDataList(newStackDataList);
  };

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lines = value.split("\n");
      lines = lines.map((line) => line.trim());
      lines = lines.map((line) => line.replaceAll("\r", ""));
      lines = lines.map((line) => line.replaceAll("\t", ""));
      compile(lines);
    }
  };

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
  }, [monaco]);

  const output = () => {
    const outputStrings: string[] = [];
    stackDataList.forEach((d, i) => {
      let lineOutput = "";
      for (let j = 0; j < i + 1; j++) {
        const data = stackDataList[j];
        lineOutput += data ? (data.input ? data.input + "(" + data.byteValue : data) + ")" : "";
        lineOutput += " ";
      }
      outputStrings.push(lineOutput);
    });
    return outputStrings;
  };

  if (monaco != null) {
    return (
      <div style={{ height: "100vh", width: "100vw" }}>
        <div style={{ float: "left", height: "100%", width: "50%" }}>
          <Editor height="100vh" width="100%" options={editorOptions} language={scriptWizEditor.LANGUAGE} theme={scriptWizEditor.THEME} onChange={onChangeEditor} />
        </div>
        <div style={{ float: "left", height: "100%", width: "50%" }}>
          {output().map((o) => (
            <>
              <span>{o}</span>
              <br />
            </>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default App;
