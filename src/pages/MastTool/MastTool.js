import React, { useState } from 'react';
import { taproot, TAPROOT_VERSION } from '@script-wiz/lib-core';
import { Button, Col, Form, Grid, Input, InputGroup, RadioGroup, Row, Tooltip, Whisper, Modal } from 'rsuite';
import Radio from 'rsuite/esm/Radio/Radio';
import WizData from '@script-wiz/wiz-data';
import { validHex } from '../../utils/helper';
import './MastTool.scss';
import CopyIcon from '../../components/Svg/Icons/Copy';

export const MastTool = () => {
  const [version, setVersion] = useState(TAPROOT_VERSION.BITCOIN);
  const [innerKey, setInnerkey] = useState('');
  const [scripts, setScripts] = useState(['']);
  const [taprootResult, setTaprootResult] = useState();
  const [controlBlockModal, setControlBlockModal] = useState({ show: false, data: '' });

  const calculateTaprootResult = (versionInput) => {
    const innerKeyWiz = WizData.fromHex(innerKey);
    const scriptsWiz = scripts.map((sc) => WizData.fromHex(sc));
    const result = taproot.tapRoot(innerKeyWiz, scriptsWiz, versionInput || version);

    setTaprootResult(result);

    return result;
  };

  const showControlBlock = (index) => {
    const scriptsWiz = scripts.map((sc) => WizData.fromHex(sc));
    let vs = 'c0';

    if (version === TAPROOT_VERSION.LIQUID) vs = 'c4';

    const result = taproot.controlBlockCalculation(scriptsWiz, vs, innerKey, index);

    setControlBlockModal({ show: true, data: result });
  };

  const checkInnerKeyValid = () => {
    return validHex(innerKey) && innerKey.length === 64;
  };

  return (
    <div className="signature-tools-page-main ">
      <div className="signature-tools-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={version}
          onChange={(value) => {
            setVersion(value.toString());
            calculateTaprootResult(value.toString());
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
          onChange={(value) => setInnerkey(value.replace(/\s/g, ''))}
        />
        <div className="helper-tab-info">
          {!checkInnerKeyValid() && innerKey !== '' ? <div className="helper-error-message">Invalid Inner Key</div> : null}
        </div>
      </div>
      {scripts.map((sc, index) => {
        return (
          <div key={index} className="mast-tools-result-item">
            <h6 className="signature-tools-tab-header">Leaf {index + 1} (Hex)</h6>
            <Grid fluid>
              <Row className="show-grid">
                <Col xs={20}>
                  <Input
                    className="signature-tools-main-input"
                    type="text"
                    value={sc}
                    placeholder="0x"
                    onChange={(value) => {
                      const clonedScripts = [...scripts];
                      clonedScripts[index] = value.replace(/\s/g, '');
                      setScripts(clonedScripts);
                    }}
                  />
                </Col>
                <Col xs={4}>
                  <Button
                    className="mast-tools-button"
                    appearance="primary"
                    size="md"
                    onClick={() => {
                      showControlBlock(index);
                    }}
                    disabled={!checkInnerKeyValid() || !validHex(scripts[index]) || scripts[index] === ''}
                  >
                    Show Control Block
                  </Button>
                </Col>
              </Row>
            </Grid>
            <div className="helper-tab-info">{!validHex(scripts[index]) ? <div className="helper-error-message">Invalid Leaf Hex</div> : null}</div>
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
            const newScripts = [...scripts];
            newScripts.pop();
            setScripts(newScripts);
          }}
        >
          + Remove Last Leaf
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
          disabled={!checkInnerKeyValid()}
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

      <Modal
        size="sm"
        open={controlBlockModal.show}
        backdrop={false}
        onClose={() => {
          setControlBlockModal({ ...controlBlockModal, show: false });
        }}
      >
        <Modal.Body>
          <div className="compile-modal-item">
            <div className="compile-modal-label">Control Block :</div>
            <InputGroup className="compile-modal-input-group">
              <Input value={controlBlockModal.data} />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(controlBlockModal.data)}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setControlBlockModal({ ...controlBlockModal, show: false });
            }}
            appearance="primary"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
