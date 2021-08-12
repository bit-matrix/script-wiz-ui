import React, { useEffect, useState } from 'react';
import { ScriptWiz, tapRoot, VM_NETWORK, VM_NETWORK_VERSION, WizData } from '@script-wiz/lib';
import { Button, Form, FormGroup, Icon, Input, InputGroup, Modal, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import './CompileModal.scss';

type Props = {
  scriptWiz: ScriptWiz;
  compileModalData: { show: boolean; data?: string };
  showCompileModal: (show: boolean) => void;
};

enum KeyPath {
  UNKNOWN = 'unknown',
  CUSTOM = 'custom',
}

enum TapleafVersion {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

type Taproot = {
  tweak: string;
  scriptPubkey: string;
  bech32: string;
};

const CompileModal: React.FC<Props> = ({ scriptWiz, compileModalData, showCompileModal }) => {
  const [keyPath, setKeyPath] = useState<KeyPath>(KeyPath.UNKNOWN);
  const [tapleafVersion, setTapleafVersion] = useState<TapleafVersion>(TapleafVersion.DEFAULT);
  const [pubKeyInput, setPubKeyInput] = useState<string>('');
  const [tapleafInput, setTapleafInput] = useState<string>('');
  const [tweakedResult, setTweakedResult] = useState<Taproot>({ tweak: '', scriptPubkey: '', bech32: '' });

  const pubkeyDefaultValue: string = '021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624';
  const tapleafDefaultValue: string = '0xc0';

  useEffect(() => {
    const script = compileModalData.data?.substr(2) || scriptWiz.compile().substr(2);
    let pubkey = pubkeyDefaultValue;
    let version = undefined;

    if (keyPath === KeyPath.CUSTOM) pubkey = pubKeyInput;

    if (tapleafVersion === TapleafVersion.CUSTOM) version = tapleafInput.substr(2);

    if (
      (pubkey.length >= 64 && tapleafVersion === TapleafVersion.DEFAULT) ||
      (tapleafVersion === TapleafVersion.CUSTOM && version !== undefined && version?.length >= 2)
    ) {
      try {
        const result = tapRoot(WizData.fromHex(pubkey), WizData.fromHex(script), version);
        setTweakedResult({ tweak: result.tweak.hex, scriptPubkey: result.scriptPubKey.hex, bech32: result.bech32 });
      } catch {
        setTweakedResult({ tweak: 'Invalid result', scriptPubkey: 'Invalid result', bech32: 'Invalid result' });
      }
    } else if (pubKeyInput.length < 64 && pubKeyInput.length > 0) {
      setTweakedResult({ tweak: 'Invalid result', scriptPubkey: 'Invalid result', bech32: 'Invalid result' });
    } else if (tapleafVersion === TapleafVersion.CUSTOM && version !== undefined && version.length < 4) {
      setTweakedResult({ tweak: 'Invalid result', scriptPubkey: 'Invalid result', bech32: 'Invalid result' });
    } else {
      setTweakedResult({ tweak: '', scriptPubkey: '', bech32: '' });
    }
  }, [compileModalData.data, keyPath, pubKeyInput, scriptWiz, tapleafInput, tapleafVersion]);

  return (
    <Modal size="sm" show={compileModalData.show} backdrop={false} onHide={() => showCompileModal(false)}>
      <Modal.Header />
      <Modal.Body className="compile-modal-body scroll">
        <h5 className="compile-modal-item">Compile Result</h5>
        <p className="compile-data-p">{compileModalData.data}</p>
        {scriptWiz.vm.network === VM_NETWORK.BTC && scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT && (
          <Form fluid>
            <h5 className="compile-modal-item">Taproot Output</h5>
            <div>
              <div className="compile-modal-label">Key-path:</div>
              <RadioGroup
                className="compile-modal-radio-group"
                inline
                value={keyPath}
                onChange={(value: KeyPath) => {
                  setKeyPath(value);
                }}
              >
                <Radio value={KeyPath.UNKNOWN}>Unknown discrete logarithm</Radio>
                <Radio value={KeyPath.CUSTOM}>Custom</Radio>
              </RadioGroup>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Inner Key:</div>
                <Input
                  disabled={keyPath === KeyPath.UNKNOWN}
                  value={keyPath === KeyPath.UNKNOWN ? pubkeyDefaultValue : pubKeyInput}
                  onChange={(value: string) => {
                    setPubKeyInput(value);
                  }}
                />
              </div>
            </div>

            <div className="compile-modal-item">
              <div className="compile-modal-label">Tapleaf version:</div>
              <RadioGroup
                className="compile-modal-radio-group"
                inline
                value={tapleafVersion}
                onChange={(value: TapleafVersion) => {
                  setTapleafVersion(value);
                }}
              >
                <Radio value={TapleafVersion.DEFAULT}>Default</Radio>
                <Radio value={TapleafVersion.CUSTOM}>Custom</Radio>
              </RadioGroup>

              <Input
                className="tapleaf-input"
                disabled={tapleafVersion === TapleafVersion.DEFAULT}
                value={tapleafVersion === TapleafVersion.DEFAULT ? tapleafDefaultValue : tapleafInput}
                onChange={(value: string, event: React.SyntheticEvent<HTMLElement, Event>) => {
                  setTapleafInput(value);
                }}
              />
            </div>

            <FormGroup>
              <h6>Tweak Result</h6>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Tweaked Key:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.tweak} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.tweak)}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">scriptPubkey:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.scriptPubkey} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.scriptPubkey)}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Bech32m address:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.bech32} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.bech32)}>
                      <Icon icon="copy" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </FormGroup>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="compile-modal-footer">
        <Button onClick={() => showCompileModal(false)} appearance="primary">
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompileModal;
