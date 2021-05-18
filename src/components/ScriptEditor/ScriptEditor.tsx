import React, { useEffect, useState } from "react";
import IStackData from "@script-wiz/lib/model/IStackData";
import * as scriptWiz from "@script-wiz/lib";
import ScriptEditorInput from "./ScriptEditorInput/ScriptEditorInput";
import ScriptEditorOutput from "./ScriptEditorOutput/ScriptEditorOutput";
import "./ScriptEditor.scss";
import ScriptEditorHeader from "./ScriptEditorHeader/ScriptEditorHeader";
import { Button, Modal } from "rsuite";
import initialEditorValue from "./ScriptEditorInput/initialEditorValue";
import { convertEditorLines } from "../../helper";

const initialLineStackDataListArray: Array<Array<IStackData>> = [];
const initialLastStackDataList: Array<IStackData> = [];

const ScriptEditor = () => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [lineStackDataListArray, setLineStackDataListArray] = useState<
        Array<Array<IStackData>>
    >(initialLineStackDataListArray);
    const [lastStackDataList, setLastStackDataList] = useState<
        Array<IStackData>
    >(initialLastStackDataList);
    const [compileModalData, setCompileModalData] = useState<{
        show: boolean;
        data?: string;
    }>({ show: false });

    useEffect(() => {
        let unmounted = false;

        if (!unmounted) {
            let lines = convertEditorLines(initialEditorValue);

            compile(lines);
        }

        return () => {
            unmounted = true;
        };
    }, []);

    const compile = (lines: string[]) => {
        scriptWiz.clearStack();

        const newLineStackDataListArray: Array<Array<IStackData>> = [];
        let newLastStackDataList: Array<IStackData> = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            try {
                if (line !== "") {
                    newLastStackDataList = scriptWiz.parse(line).main;
                    newLineStackDataListArray.push(newLastStackDataList);
                } else {
                    newLineStackDataListArray.push([]);
                }
            } catch (e) {
                setErrorMessage(e);
                break;
            }
        }

        setLineStackDataListArray(newLineStackDataListArray);
        setLastStackDataList(newLastStackDataList);
    };

    const compileScripts = () => {
        const compileScript = scriptWiz.compileScript();
        setCompileModalData({ show: true, data: compileScript });
    };

    return (
        <>
            <Modal
                size="xs"
                show={compileModalData.show}
                backdrop={false}
                onHide={() => setCompileModalData({ show: false })}
            >
                <Modal.Header>
                    <Modal.Title>Compile Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="compile-data-p">{compileModalData.data}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setCompileModalData({ show: false })}
                        appearance="primary"
                    >
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <ScriptEditorHeader compileButtonClick={compileScripts} />
            <div className="script-editor-main-div scroll">
                <div className="script-editor-container">
                    <div className="script-editor-sub-item">
                        <ScriptEditorInput
                            onChangeScriptEditorInput={(lines: string[]) => {
                                setErrorMessage(undefined);
                                setLineStackDataListArray(
                                    initialLineStackDataListArray,
                                );
                                setLastStackDataList(initialLastStackDataList);
                                compile(lines);
                            }}
                        />
                    </div>
                    <div className="script-editor-sub-item scroll">
                        <ScriptEditorOutput
                            lastStackDataList={lastStackDataList}
                            lineStackDataListArray={lineStackDataListArray}
                            errorMessage={errorMessage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScriptEditor;
