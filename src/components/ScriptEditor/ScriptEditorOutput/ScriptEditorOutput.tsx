import React from "react";
import IStackData from "@script-wiz/lib/model/IStackData";
import "./ScriptEditorOutput.scss";
import { Icon, Tooltip, Whisper } from "rsuite";

interface IScriptEditorInput {
    lastStackDataList: Array<IStackData>;
    lineStackDataListArray: Array<Array<IStackData>>;
    errorMessage: string | undefined;
}

const ScriptEditorOutput: React.FC<IScriptEditorInput> = ({
    lastStackDataList,
    lineStackDataListArray,
    errorMessage,
}) => {
    const getOutputValueType = (value: string): string => {
        if (value.startsWith("0x")) {
            return "hex";
        }

        if (!isNaN(Number(value))) {
            return "number";
        }

        return "string";
    };

    const getWhispers = (stackDataArray: IStackData[], lineNumber: number) =>
        stackDataArray.map((stackData: IStackData, index: number) => {
            const key = `whisper-${lineNumber.toString()}-${index.toString()}-text`;
            console.log(stackData.byteValueDisplay);
            return getWhisper(
                key,
                stackData.byteValue,
                stackData.byteValueDisplay,
            );
        });

    const getWhisper = (key: string, tooltip: string, display: string) => (
        <Whisper
            key={key}
            delayShow={100}
            placement="rightEnd"
            trigger="hover"
            speaker={
                <Tooltip className="whisper-tooltip">
                    Compiled : {tooltip}
                </Tooltip>
            }
        >
            <span
                className={`editor-output-text ${getOutputValueType(display)} `}
            >
                {display}
            </span>
        </Whisper>
    );

    return (
        <>
            {lineStackDataListArray.map(
                (lineStackDataList, lineNumber: number) => (
                    <div
                        className="script-editor-output-main"
                        key={`script-editor-output-main-${lineNumber.toString()}`}
                    >
                        <span
                            key={`editor-output-text-page-number-${lineNumber.toString()}`}
                            className="editor-output-text-page-number"
                        >
                            {lineNumber + 1}
                        </span>
                        {getWhispers(lineStackDataList, lineNumber)}
                        <br />
                    </div>
                ),
            )}
            {errorMessage ? (
                <div
                    className="script-editor-output-main"
                    key={`script-editor-output-main-error`}
                >
                    <span
                        key={`editor-output-text-page-number-error`}
                        className="editor-output-text-page-number"
                    ></span>
                    <span className="error-message">
                        <Icon icon="ban" className="error-message-ban-icon" />
                        {errorMessage}
                    </span>
                </div>
            ) : undefined}
        </>
    );
};

export default ScriptEditorOutput;
