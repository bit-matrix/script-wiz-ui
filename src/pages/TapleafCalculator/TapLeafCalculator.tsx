/* eslint-disable no-throw-literal */
import React, { useState } from 'react';
import { Button, Input, InputGroup, Tooltip, Whisper } from 'rsuite';
import { taproot } from '@script-wiz/lib-core';
import WizData from '@script-wiz/wiz-data';
import { CopyIcon } from '../../components/Svg/Icons/Copy';

export const TapLeafCalculator = () => {
  const [scriptByteCode, setScriptByteCode] = useState<string>('');
  const [tapLeafResult, setTapLeafResult] = useState<string>('');

  const calculateTapLeaf = () => {
    const result = taproot.treeHelper([WizData.fromHex(scriptByteCode)], 'c4');
    setTapLeafResult(result);
  };

  console.log(tapLeafResult);

  return (
    <div className="signature-tools-page-main">
      <div className="signature-tools-page-item">
        <div className="signature-tools-tab-item">
          <div className="signature-tools-result-text">
            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Script Byte Code</h6>
              <div>
                <InputGroup className="signature-tools-compile-modal-input-group">
                  <Input value={scriptByteCode} onChange={(value) => setScriptByteCode(value)} />
                </InputGroup>
              </div>
            </div>

            <Button className="signature-tools-button" appearance="primary" size="md" onClick={calculateTapLeaf} disabled={!scriptByteCode}>
              Calculate
            </Button>

            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Calculated Tap Leaf Result</h6>
              <div>
                <InputGroup className="signature-tools-compile-modal-input-group">
                  <Input value={tapLeafResult || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Calculated Tap Leaf Result has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tapLeafResult || '')}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
