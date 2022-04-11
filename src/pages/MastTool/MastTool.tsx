import React, { useState } from 'react';
import { taproot, TAPROOT_VERSION } from '@script-wiz/lib-core';
import { Button, Form, Input, InputGroup, RadioGroup, Tooltip, Whisper } from 'rsuite';
import Radio, { ValueType } from 'rsuite/esm/Radio/Radio';
import WizData from '@script-wiz/wiz-data';
import { validHex } from '../../utils/helper';
import './MastTool.scss';
import { Taproot } from '@script-wiz/lib-core/taproot/model';
import CopyIcon from '../../components/Svg/Icons/Copy';

export const MastTool: React.FC = () => {
  const [version, setVersion] = useState<TAPROOT_VERSION>(TAPROOT_VERSION.BITCOIN);
  const [innerKey, setInnerkey] = useState<string>('');
  const [scripts, setScripts] = useState<string[]>(['']);
  const [taprootResult, setTaprootResult] = useState<Taproot>();

  const calculateTaprootResult = (versionInput?: TAPROOT_VERSION) => {
    const innerKeyWiz = WizData.fromHex(innerKey);
    const scriptsWiz = scripts.map((sc) => WizData.fromHex(sc));
    const result = taproot.tapRoot(innerKeyWiz, scriptsWiz, versionInput || version);

    setTaprootResult(result);
  };

  return (
    <div className="signature-tools-page-main ">
      <div className="signature-tools-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={version}
          onChange={(value: ValueType) => {
            setVersion(value.toString() as TAPROOT_VERSION);
            calculateTaprootResult(value.toString() as TAPROOT_VERSION);
          }}
        >
          <Radio value={TAPROOT_VERSION.BITCOIN}>Bitcoin</Radio>
          <Radio value={TAPROOT_VERSION.LIQUID}>Elements</Radio>
        </RadioGroup>
      </div>

      <div className="signature-tools-result-item">
        <h6 className="signature-tools-tab-header">Inner Key (Hex)</h6>
        <Input
          className="signature-tools-main-input"
          type="text"
          placeholder="32-byte inner key"
          value={innerKey}
          onChange={(value: string) => setInnerkey(value.replace(/\s/g, ''))}
        />
      </div>
      {scripts.map((sc, index) => {
        return (
          <div key={index} className="signature-tools-result-item">
            <h6 className="signature-tools-tab-header">Leaf {index + 1} (Hex)</h6>
            <Input
              className="signature-tools-main-input"
              type="text"
              value={sc}
              placeholder="0x"
              onChange={(value: string) => {
                const clonedScripts = [...scripts];
                clonedScripts[index] = value.replace(/\s/g, '');
                setScripts(clonedScripts);
              }}
            />
          </div>
        );
      })}

      <div className="signature-tools-result-item">
        <Button
          className="signature-tools-button"
          appearance="primary"
          size="md"
          onClick={() => {
            const newScripts = [...scripts];
            newScripts.push('');
            setScripts(newScripts);
          }}
          disabled={!validHex(innerKey)}
        >
          + Add Leaf
        </Button>
      </div>

      <div className="signature-tools-result-item">
        <Button
          className="signature-tools-button"
          appearance="primary"
          size="md"
          onClick={() => {
            calculateTaprootResult();
          }}
          disabled={!validHex(innerKey)}
        >
          Show Taproot Result
        </Button>
      </div>
      {taprootResult && (
        <Form>
          <Form.Group>
            <h6>Tweak Result</h6>
            <div className="compile-modal-item">
              <div className="compile-modal-label">Tweaked Key:</div>
              <InputGroup className="compile-modal-input-group">
                <Input value={taprootResult.tweak.hex} />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(taprootResult.tweak.hex)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
            <div className="compile-modal-item">
              <div className="compile-modal-label">scriptPubKey:</div>
              <InputGroup className="compile-modal-input-group">
                <Input value={taprootResult.scriptPubkey.hex} />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(taprootResult.scriptPubkey.hex)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
            <div className="compile-modal-item">
              <div className="compile-modal-label">Mainnet address:</div>
              <InputGroup className="compile-modal-input-group">
                <Input value={taprootResult.address.mainnet} />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(taprootResult.address.mainnet)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
            <div className="compile-modal-item">
              <div className="compile-modal-label">Testnet address:</div>
              <InputGroup className="compile-modal-input-group">
                <Input value={taprootResult.address.testnet} />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(taprootResult.address.testnet)}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </Form.Group>
        </Form>
      )}
    </div>
  );
};
