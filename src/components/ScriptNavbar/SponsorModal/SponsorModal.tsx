import React, { useState } from 'react';
import { Button, Input, InputGroup, Modal, Nav, Tooltip, Whisper } from 'rsuite';
import CopyIcon from '../../../Svg/Icons/Copy';
import btcQr from './qrImages/btc.png';
import liquidQr from './qrImages/liquid.png';
import './SponsorModal.scss';

interface SponsorModalProps {
  show: boolean;
  close: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ show, close }) => {
  const [activeSponsorType, setActiveSponsorType] = useState<string>('btc');

  const copyToClipboard = () => {
    const btcAddress =
      activeSponsorType === 'btc'
        ? 'bc1qvhdd984jla9dkr5nad2f6a2wlwt9htucmy3yj3scgmkjymn7usmsjygcta'
        : 'VJL9AAstGGHSyF83M6ineuZj3TjQDtykb6zJ5dzxa8fJPUhwEGatuAPjKcBjKKcNeYzicxQ6GostkFoo';

    navigator.clipboard.writeText(btcAddress);
  };

  return (
    <Modal size="sm" open={show} backdrop={false} onClose={close}>
      <Nav activeKey={activeSponsorType} appearance="subtle" onSelect={(sponsorType) => setActiveSponsorType(sponsorType)}>
        <Nav.Item eventKey="btc">BTC (Bech32)</Nav.Item>
        <Nav.Item eventKey="lbtc">L-BTC</Nav.Item>
      </Nav>
      <Modal.Body>
        <div className="sponsor-modal-body">
          {activeSponsorType === 'btc' ? <img src={btcQr} alt="btcqr" /> : <img src={liquidQr} alt="lbtcqr" />}
        </div>
        <div>
          <InputGroup>
            <Input
              name="input"
              className="sponsor-modal-address-input"
              onChange={() => {}}
              value={`${
                activeSponsorType === 'btc'
                  ? 'bc1qvhdd984jla9dkr5nad2f6a2wlwt9htucmy3yj3scgmkjymn7usmsjygcta'
                  : 'VJL9AAstGGHSyF83M6ineuZj3TjQDtykb6zJ5dzxa8fJPUhwEGatuAPjKcBjKKcNeYzicxQ6GostkFoo'
              }`}
            />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={copyToClipboard}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close} appearance="primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
