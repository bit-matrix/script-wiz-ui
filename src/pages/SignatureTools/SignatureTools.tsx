/* eslint-disable no-throw-literal */
import React, { useState } from 'react';
import { Button, Checkbox, Divider, Input, InputGroup, Radio, RadioGroup, Tooltip, Whisper } from 'rsuite';
import { crypto } from '@script-wiz/lib-core';
import WizData from '@script-wiz/wiz-data';
import { validHex } from '../../utils/helper';
import CopyIcon from '../../components/Svg/Icons/Copy';
import { ValueType } from 'rsuite/esm/Radio';
import './SignatureTools.scss';

export const SignatureTools = () => {
  const [privateKey, setPrivateKey] = useState<WizData>();
  const [publicKey, setPublicKey] = useState<WizData>();
  const [uncompressedPublicKey, setUncompressedPublicKey] = useState<WizData>();
  const [signMessage, setSignMessage] = useState<string>('');
  const [signSignature, setSignSignature] = useState<WizData>();
  const [derEncodedSignature, setDerEncodedSignature] = useState<WizData>();
  const [signAlgorithm, setSignAlgorithm] = useState<string>('ECDSA');
  const [importPrivateKey, setImportPrivateKey] = useState<boolean>(false);
  const [privateKeyInput, setPrivateKeyInput] = useState<string>('');
  const [verifySignature, setVerifySignature] = useState<string>('');
  const [verifyMessage, setVerifyMessage] = useState<string>('');
  const [verifyPublicKey, setVerifyPublicKey] = useState<string>('');
  const [keysErrorMessage, setKeysErrorMessage] = useState<string>('');
  const [signErrorMessage, setSignErrorMessage] = useState<string>('');
  const [verifyErrorMessage, setVerifyErrorMessage] = useState<string>('');

  const generateKey = () => {
    if (signAlgorithm === 'ECDSA') {
      const keys = crypto.secp256k1KeyGenerator();

      setPrivateKey(keys.privateKey);
      setPublicKey(keys.publicKey);
      setUncompressedPublicKey(keys.uncompressedPubKey);
    } else {
      const keys = crypto.schnorrKeyGenerator();

      setPrivateKey(keys.privateKey);
      setPublicKey(keys.publicKey);
      setUncompressedPublicKey(keys.uncompressedPubKey);
    }
  };

  const MessageSign = () => {
    if (signAlgorithm === 'ECDSA') {
      if (!privateKey) throw 'Unknown private key';

      try {
        const signResult = crypto.secp256k1Sign(WizData.fromHex(signMessage), privateKey);

        setSignSignature(signResult.sign);
        setDerEncodedSignature(signResult.derEncodedSign);
      } catch (err) {
        setSignErrorMessage(err as string);
      }
    } else {
      if (!privateKey) throw 'Unknown private key';

      try {
        const signResult = crypto.schnorrSign(WizData.fromHex(signMessage), privateKey);

        setSignSignature(signResult.sign);
        // setDerEncodedSignature(signResult.derEncodedSign);
      } catch (err) {
        setSignErrorMessage(err as string);
      }
    }
  };

  const createPublicKey = () => {
    if (signAlgorithm === 'ECDSA') {
      try {
        const keys = crypto.secp256k1CreatePublicKey(WizData.fromHex(privateKeyInput));
        setPrivateKey(keys.privateKey);
        setPublicKey(keys.publicKey);
        setUncompressedPublicKey(keys.uncompressedPubKey);
      } catch (err) {
        setKeysErrorMessage(err as string);
      }
    } else {
      try {
        const keys = crypto.schnorrCreatePublicKey(WizData.fromHex(privateKeyInput));

        setPrivateKey(keys.privateKey);
        setPublicKey(keys.publicKey);
        setUncompressedPublicKey(keys.uncompressedPubKey);
      } catch (err) {
        setKeysErrorMessage(err as string);
      }
    }
  };

  const generateButtonClick = () => {
    if (importPrivateKey) {
      createPublicKey();
    } else {
      generateKey();
    }
  };

  const messageVerify = () => {
    if (!verifySignature) throw 'Unknown signature';
    if (!verifyMessage) throw 'Unknown message';
    if (!verifyPublicKey) throw 'Unknown public key';

    const wizDataVerifySignature = WizData.fromHex(verifySignature);
    const wizDataVerifyMessage = WizData.fromHex(verifyMessage);
    const wizDataVerifyPublicKey = WizData.fromHex(verifyPublicKey);

    if (signAlgorithm === 'ECDSA') {
      try {
        const ecdsaVerify = crypto.ecdsaVerify(wizDataVerifySignature, wizDataVerifyMessage, wizDataVerifyPublicKey);

        console.log(ecdsaVerify);
      } catch (err) {
        setVerifyErrorMessage(err as string);
      }
    } else {
      try {
        const shnorrVerify = crypto.shnorrSigVerify(wizDataVerifySignature, wizDataVerifyMessage, wizDataVerifyPublicKey);

        console.log(shnorrVerify);
      } catch (err) {
        setVerifyErrorMessage(err as string);
      }
    }
  };

  const clearKeys = () => {
    setPrivateKey(undefined);
    setPublicKey(undefined);
    setUncompressedPublicKey(undefined);
    setSignSignature(undefined);
    setDerEncodedSignature(undefined);
    setSignMessage('');
    setKeysErrorMessage('');
    setSignErrorMessage('');
    setVerifyErrorMessage('');
  };

  const generateButtonValidation = () => {
    if (!importPrivateKey) return true;

    if (privateKeyInput.length !== 64) return false;

    if (!validHex(privateKeyInput)) return false;

    return true;
  };

  return (
    <div className="signature-tools-page-main">
      <div className="signature-tools-page-tabs">
        <RadioGroup
          name="radioList"
          inline
          appearance="picker"
          defaultValue={signAlgorithm}
          onChange={(value: ValueType) => {
            setSignAlgorithm(value.toString());
            clearKeys();
          }}
        >
          <Radio value="ECDSA">ECDSA</Radio>
          <Radio value="SCHNORR">SCHNORR</Radio>
        </RadioGroup>
      </div>

      <div className="signature-tools-page-item">
        <div className="signature-tools-tab-item">
          <div className="signature-tools-result-text">
            <div className="signature-tools-result-item">
              <div className="signature-tools-tab-header-container">
                <h6 className="signature-tools-tab-header">Private Key</h6>
                <Checkbox
                  className="signature-tools-import-checkbox"
                  value="Import"
                  onChange={(value, checked) => {
                    setImportPrivateKey(checked);
                    clearKeys();
                  }}
                >
                  Import
                </Checkbox>
              </div>
              <div>
                {!importPrivateKey ? (
                  <InputGroup className="signature-tools-compile-modal-input-group">
                    <Input value={privateKey?.hex || ''} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>Private Key has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(privateKey?.hex || '')}>
                        <CopyIcon width="1rem" height="1rem" />
                      </InputGroup.Button>
                    </Whisper>
                  </InputGroup>
                ) : (
                  <Input value={privateKeyInput} onChange={(value) => setPrivateKeyInput(value)} />
                )}
              </div>

              {keysErrorMessage ? <div className="signature-tools-error-message error-div">{keysErrorMessage}</div> : null}
            </div>
            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Public Key</h6>
              <div>
                <InputGroup className="signature-tools-compile-modal-input-group">
                  <Input value={publicKey?.hex || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Public Key has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(publicKey?.hex || '')}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Uncompressed Public Key</h6>
              <div>
                <InputGroup className="signature-tools-compile-modal-input-group">
                  <Input value={uncompressedPublicKey?.hex || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Uncompressed Public Key has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(uncompressedPublicKey?.hex || '')}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
            <Button
              className="signature-tools-button"
              appearance="primary"
              size="md"
              onClick={generateButtonClick}
              disabled={!generateButtonValidation()}
            >
              Generate Key
            </Button>

            <Divider />

            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Message (Hex)</h6>
              <Input
                className="signature-tools-main-input"
                type="text"
                value={signMessage}
                onChange={(value: string) => setSignMessage(value.replace(/\s/g, ''))}
              />

              {signErrorMessage ? <div className="signature-tools-error-message error-div">{signErrorMessage}</div> : null}
            </div>
            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Signature</h6>
              <div>
                <InputGroup className="signature-tools-compile-modal-input-group">
                  <Input value={signSignature?.hex || ''} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Signature has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(signSignature?.hex || '')}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            </div>
            {signAlgorithm === 'ECDSA' && (
              <div className="signature-tools-result-item">
                <h6 className="signature-tools-tab-header">Der Encoded Signature</h6>
                <div>
                  <InputGroup className="signature-tools-compile-modal-input-group">
                    <Input value={derEncodedSignature?.hex || ''} disabled />
                    <Whisper placement="top" trigger="click" speaker={<Tooltip>Der Encoded Signature has been copied to clipboard!</Tooltip>}>
                      <InputGroup.Button onClick={() => navigator.clipboard.writeText(derEncodedSignature?.hex || '')}>
                        <CopyIcon width="1rem" height="1rem" />
                      </InputGroup.Button>
                    </Whisper>
                  </InputGroup>
                </div>
              </div>
            )}

            <Button className="signature-tools-button" appearance="primary" size="md" onClick={MessageSign} disabled={!privateKey}>
              Sign
            </Button>

            <Divider />

            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Signature (Hex)</h6>
              <Input
                className="signature-tools-main-input"
                type="text"
                value={verifySignature}
                onChange={(value: string) => setVerifySignature(value.replace(/\s/g, ''))}
              />

              {verifyErrorMessage ? <div className="signature-tools-error-message error-div">{verifyErrorMessage}</div> : null}
            </div>
            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Message (Hex)</h6>
              <Input
                className="signature-tools-main-input"
                type="text"
                value={verifyMessage}
                onChange={(value: string) => setVerifyMessage(value.replace(/\s/g, ''))}
              />

              {verifyErrorMessage ? <div className="signature-tools-error-message error-div">{verifyErrorMessage}</div> : null}
            </div>
            <div className="signature-tools-result-item">
              <h6 className="signature-tools-tab-header">Public Key (Hex)</h6>
              <Input
                className="signature-tools-main-input"
                type="text"
                value={verifyPublicKey}
                onChange={(value: string) => setVerifyPublicKey(value.replace(/\s/g, ''))}
              />

              {verifyErrorMessage ? <div className="signature-tools-error-message error-div">{verifyErrorMessage}</div> : null}
            </div>
            <div className="signature-tools-message-verify">
              <Button className="signature-tools-button" appearance="primary" size="md" onClick={messageVerify}>
                Verify Message
              </Button>
              <Input value={''} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
