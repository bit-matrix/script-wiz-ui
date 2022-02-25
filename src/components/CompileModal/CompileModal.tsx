import React, { useEffect, useState } from 'react';
import { ScriptWiz, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
import { address, taproot, TAPROOT_VERSION } from '@script-wiz/lib-core';
import { Button, Form, Input, InputGroup, Modal, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import WizData from '@script-wiz/wiz-data';
import { ValueType } from 'rsuite/esm/Radio';
import CopyIcon from '../Svg/Icons/Copy';
import './CompileModal.scss';
import { Address } from '@script-wiz/lib-core/taproot/model';

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

type TaprootState = {
  tweak: string;
  scriptPubkey: string;
  address: Address;
};

const CompileModal: React.FC<Props> = ({ scriptWiz, compileModalData, showCompileModal }) => {
  const [keyPath, setKeyPath] = useState<KeyPath>(KeyPath.UNKNOWN);
  const [tapleafVersion, setTapleafVersion] = useState<TapleafVersion>(TapleafVersion.DEFAULT);
  const [pubKeyInput, setPubKeyInput] = useState<string>('');
  const [tapleafInput, setTapleafInput] = useState<string>('');
  const [tweakedResult, setTweakedResult] = useState<TaprootState>({ tweak: '', scriptPubkey: '', address: { mainnet: '', testnet: '' } });
  const [segwitAddress, setSegwitAddress] = useState<Address>();

  const pubkeyDefaultValue: string = '1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624';
  const tapleafDefaultValue: string = scriptWiz.vm.network === VM_NETWORK.LIQUID ? '0xc4' : '0xc0';

  useEffect(() => {
    const script = compileModalData.data?.substr(2) || scriptWiz.compile().substr(2);
    let pubkey = pubkeyDefaultValue;
    let version = undefined;

    if (scriptWiz.vm.network === VM_NETWORK.BTC && scriptWiz.vm.ver === VM_NETWORK_VERSION.SEGWIT) {
      const newMainnetAddress = address.createBech32Address(WizData.fromHex(script), 'bc', 0);
      const newTestnetAddress = address.createBech32Address(WizData.fromHex(script), 'tb', 0);

      setSegwitAddress({ testnet: newTestnetAddress, mainnet: newMainnetAddress });
    }

    if (scriptWiz.vm.network === VM_NETWORK.LIQUID && scriptWiz.vm.ver === VM_NETWORK_VERSION.SEGWIT) {
      const newMainnetAddress = address.createBech32Address(WizData.fromHex(script), 'ex', 0);
      const newTestnetAddress = address.createBech32Address(WizData.fromHex(script), 'tex', 0);

      setSegwitAddress({ testnet: newTestnetAddress, mainnet: newMainnetAddress });
    }

    if (keyPath === KeyPath.CUSTOM) pubkey = pubKeyInput;

    if (tapleafVersion === TapleafVersion.CUSTOM) version = tapleafInput.substr(2);

    if (
      (pubkey.length >= 64 && tapleafVersion === TapleafVersion.DEFAULT) ||
      (tapleafVersion === TapleafVersion.CUSTOM && version !== undefined && version?.length >= 2)
    ) {
      try {
        const result = taproot.tapRoot(
          WizData.fromHex(pubkey),
          [WizData.fromHex(script)],
          scriptWiz.vm.network === VM_NETWORK.LIQUID ? TAPROOT_VERSION.LIQUID : TAPROOT_VERSION.BITCOIN,
        );
        setTweakedResult({ tweak: result.tweak.hex, scriptPubkey: result.scriptPubkey.hex, address: result.address });
      } catch {
        setTweakedResult({
          tweak: 'Invalid result',
          scriptPubkey: 'Invalid result',
          address: { mainnet: 'Invalid result', testnet: 'Invalid result' },
        });
      }
    } else if (pubKeyInput.length < 64 && pubKeyInput.length > 0) {
      setTweakedResult({
        tweak: 'Invalid result',
        scriptPubkey: 'Invalid result',
        address: { mainnet: 'Invalid result', testnet: 'Invalid result' },
      });
    } else if (tapleafVersion === TapleafVersion.CUSTOM && version !== undefined && version.length < 4) {
      setTweakedResult({
        tweak: 'Invalid result',
        scriptPubkey: 'Invalid result',
        address: { mainnet: 'Invalid result', testnet: 'Invalid result' },
      });
    } else {
      setTweakedResult({ tweak: '', scriptPubkey: '', address: { mainnet: '', testnet: '' } });
    }
  }, [compileModalData.data, keyPath, pubKeyInput, scriptWiz, tapleafInput, tapleafVersion]);

  return (
    <Modal size="sm" open={compileModalData.show} backdrop={false} onClose={() => showCompileModal(false)}>
      <Modal.Header />
      <Modal.Body className="compile-modal-body scroll">
        <h5 className="compile-modal-item">Compile Result</h5>
        <p className="compile-data-p">{compileModalData.data}</p>

        {scriptWiz.vm.ver === VM_NETWORK_VERSION.SEGWIT && (
          <>
            <div className="compile-modal-item">
              <div className="compile-modal-label">Mainnet Address:</div>
              <InputGroup className="compile-modal-input-group">
                <Input value={segwitAddress?.mainnet} />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(segwitAddress?.mainnet || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
            <div className="compile-modal-item">
              <div className="compile-modal-label">Testnet Address:</div>
              <InputGroup className="compile-modal-input-group">
                <Input value={segwitAddress?.testnet} />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(segwitAddress?.testnet || '')}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </div>
          </>
        )}

        {((scriptWiz.vm.network === VM_NETWORK.BTC && scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT) ||
          (scriptWiz.vm.network === VM_NETWORK.LIQUID && scriptWiz.vm.ver === VM_NETWORK_VERSION.TAPSCRIPT)) && (
          <Form fluid>
            <h5 className="compile-modal-item">Taproot Output</h5>
            <div>
              <div className="compile-modal-label">Key-path:</div>
              <RadioGroup
                className="compile-modal-radio-group"
                inline
                value={keyPath}
                onChange={(value: ValueType) => {
                  setKeyPath(value as KeyPath);
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
                onChange={(value: ValueType) => {
                  setTapleafVersion(value as TapleafVersion);
                }}
              >
                <Radio value={TapleafVersion.DEFAULT}>Default</Radio>
                <Radio value={TapleafVersion.CUSTOM}>Custom</Radio>
              </RadioGroup>

              <Input
                className="tapleaf-input"
                // disabled={tapleafVersion === TapleafVersion.DEFAULT}
                //  value={tapleafVersion === TapleafVersion.DEFAULT ? tapleafDefaultValue : tapleafInput}
                value={tapleafDefaultValue}
                disabled
                onChange={(value: string, event: React.SyntheticEvent<HTMLElement, Event>) => {
                  setTapleafInput(value);
                }}
              />
            </div>

            <Form.Group>
              <h6>Tweak Result</h6>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Tweaked Key:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.tweak} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.tweak)}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">scriptPubKey:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.scriptPubkey} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.scriptPubkey)}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Mainnet address:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.address.mainnet} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.address.mainnet)}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
              <div className="compile-modal-item">
                <div className="compile-modal-label">Testnet address:</div>
                <InputGroup className="compile-modal-input-group">
                  <Input value={tweakedResult.address.testnet} />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(tweakedResult.address.testnet)}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="compile-modal-footer">
        <Button onClick={() => showCompileModal(false)} appearance="primary">
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompileModal;
