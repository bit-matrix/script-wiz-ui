import React, { useEffect, useState } from 'react';
import * as scriptWiz from '@script-wiz/lib';
import ScriptEditorInput from './ScriptEditorInput/ScriptEditorInput';
import ScriptEditorOutput from './ScriptEditorOutput/ScriptEditorOutput';
import './ScriptEditor.scss';
import ScriptEditorHeader from './ScriptEditorHeader/ScriptEditorHeader';
import { Button, Modal } from 'rsuite';
import initialEditorValue from './ScriptEditorInput/initialEditorValue';
import { convertEditorLines } from '../../helper';
import { ScriptWiz, WizData } from '@script-wiz/lib';

type Props = {
  scriptWiz: ScriptWiz;
};

const initialLineStackDataListArray: Array<Array<WizData>> = [];
const initialLastStackDataList: Array<WizData> = [];

const ScriptEditor: React.FC<Props> = ({ scriptWiz }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lineStackDataListArray, setLineStackDataListArray] = useState<Array<Array<WizData>>>(initialLineStackDataListArray);
  const [lastStackDataList, setLastStackDataList] = useState<Array<WizData>>(initialLastStackDataList);

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
    scriptWiz.clearStackDataList();
    let hasError: boolean = false;

    const newLineStackDataListArray: Array<Array<WizData>> = [];
    let newLastStackDataList: Array<WizData> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // console.log(i, line);

      if (line !== '') {
        // @To-do
        const scriptWizInstance = scriptWiz.parseText(line);

        const parsed = scriptWiz.stackDataList.main;

        // @To-do scriptWiz error message
        const scriptWizErrorMessage = '';

        if (!hasError) {
          newLastStackDataList = parsed;
          newLineStackDataListArray.push(newLastStackDataList);

          if (scriptWizErrorMessage) {
            hasError = true;
            setErrorMessage(scriptWizErrorMessage);
          }
        }
      } else {
        if (!hasError) newLineStackDataListArray.push([]);
      }
    }

    setLineStackDataListArray(newLineStackDataListArray);
    setLastStackDataList(newLastStackDataList);
    // console.log(scriptWiz.stackDataList);
  };

  const compileScripts = () => {
    const compileScript = scriptWiz.compile();
    setCompileModalData({ show: true, data: compileScript });
  };

  return (
    <>
      <Modal size="xs" show={compileModalData.show} backdrop={false} onHide={() => setCompileModalData({ show: false })}>
        <Modal.Header>
          <Modal.Title>Compile Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="compile-data-p">{compileModalData.data}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setCompileModalData({ show: false })} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <ScriptEditorHeader compileButtonClick={compileScripts} />
      <div className="script-editor-main-div scroll">
        <div className="script-editor-container">
          <div className="script-editor-sub-item">
            <ScriptEditorInput
              scriptWiz={scriptWiz}
              onChangeScriptEditorInput={(lines: string[]) => {
                setErrorMessage(undefined);
                setLineStackDataListArray(initialLineStackDataListArray);
                setLastStackDataList(initialLastStackDataList);
                compile(lines);
              }}
            />
          </div>
          <div className="script-editor-sub-item scroll">
            <ScriptEditorOutput lastStackDataList={lastStackDataList} lineStackDataListArray={lineStackDataListArray} errorMessage={errorMessage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptEditor;
