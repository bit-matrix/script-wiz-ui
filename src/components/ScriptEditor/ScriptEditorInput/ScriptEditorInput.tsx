/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createRef, useEffect, useRef } from "react";

import * as languageOptions from "../../../options/editorOptions/languageOptions";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import themeOptions from "../../../options/editorOptions/themeOptions";
import Editor, { useMonaco } from "@monaco-editor/react";
import editorOptions from "../../../options/editorOptions/editorOptions";

import { scriptWizEditor } from "../../../options/editorOptions/utils/constant";
import "./ScriptEditorInput.scss";

interface IScriptEditorInput {
    onChangeScriptEditorInput: (lines: string[]) => void;
}

const ScriptEditorInput: React.FC<IScriptEditorInput> = ({
    onChangeScriptEditorInput,
}) => {
    const monaco = useMonaco();

    useEffect(() => {
        // language define
        if (monaco !== null) {
            monaco.languages.register({ id: scriptWizEditor.LANGUAGE });

            // Define a new theme that contains only rules that match this language
            monaco.editor.defineTheme(scriptWizEditor.THEME, themeOptions);

            monaco.languages.setLanguageConfiguration(
                scriptWizEditor.LANGUAGE,
                languageOptions.languageConfigurations(monaco.languages),
            );

            // Register a tokens provider for the language
            monaco.languages.setMonarchTokensProvider(
                scriptWizEditor.LANGUAGE,
                languageOptions.tokenProviders,
            );

            monaco.languages.registerHoverProvider(
                scriptWizEditor.LANGUAGE,
                languageOptions.hoverProvider,
            );

            monaco.languages.registerCompletionItemProvider(
                scriptWizEditor.LANGUAGE,
                {
                    provideCompletionItems: (model: any, position: any) => {
                        const suggestions = languageOptions.languageSuggestions(
                            monaco.languages,
                            model,
                            position,
                        );
                        return { suggestions: suggestions };
                    },
                },
            );
        }

        /*    return () => {
      if (monaco) {
        monaco.editor.getModels().forEach((model) => model.dispose());
      }
    }; */
    }, [monaco]);

    const onChangeEditor = (
        value: string | undefined,
        ev: Monaco.editor.IModelContentChangedEvent,
    ) => {
        if (value) {
            let lines = value.split("\n");
            lines = lines.map(line => line.replace(/ /g, ""));
            // TODO all replace list for format chars

            lines = lines.map(line => line.replaceAll("\r", ""));

            lines = lines.map(line => line.replaceAll("\t", ""));

            lines = lines.map(line => {
                const commentIndex = line.indexOf("//");

                if (commentIndex > -1) {
                    return line.substr(0, commentIndex);
                }
                return line;
            });

            onChangeScriptEditorInput(lines);
        } else {
            onChangeScriptEditorInput([]);
        }
    };

    if (monaco != null) {
        return (
            <Editor
                // height="100vh"
                width="100%"
                className="script-wiz-monaco-editor"
                onMount={() => {
                    console.log("loading state");
                }}
                defaultValue={
                    "// Welcome to Script Wizard online Bitcoin script editor."
                }
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
