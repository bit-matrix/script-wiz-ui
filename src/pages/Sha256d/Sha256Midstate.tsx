import React, { useState } from 'react';
import { Button, Input, InputGroup, Tooltip, Whisper } from 'rsuite';
import CopyIcon from '../../components/Svg/Icons/Copy';
import { sha256d } from '@script-wiz/lib-core';

export const Sha256Midstate = () => {
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');

  const calculateSha256Midstate = () => {
    const res = sha256d.sha256Midstate(key);

    setResult(res.toString('hex'));
  };

  return (
    <div className="signature-tools-page-main">
      <div className="signature-tools-result-item">
        <h6 className="signature-tools-tab-header">(Hex)</h6>
        <Input
          className="signature-tools-main-input"
          type="text"
          placeholder="32-byte key"
          value={key}
          onChange={(value: string) => setKey(value.replace(/\s/g, ''))}
        />
      </div>{' '}
      <div className="signature-tools-result-item">
        <h6 className="signature-tools-tab-header">Signature</h6>
        <div>
          <InputGroup className="signature-tools-compile-modal-input-group">
            <Input value={result} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Result has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result)}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </div>
      </div>
      <Button className="signature-tools-button" appearance="primary" size="md" onClick={calculateSha256Midstate}>
        Generate Key
      </Button>
    </div>
  );
};
