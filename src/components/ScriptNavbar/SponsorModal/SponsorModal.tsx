import React, { useState } from 'react';
import { Button, Input, InputGroup, Modal, Nav, Tooltip, Whisper } from 'rsuite';
import CopyIcon from '../../Svg/Icons/Copy';
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
        ? 'bc1qxs7cmf53kqmey0xzt308l0mq2hm35utu45qcjy'
        : 'lq1qqdz4844m679zvpvvnulu6q4zm9nqr4ws2gr7u46xncva5ma3p7yphytwtuc64rtuefs2s45f45nfv9xwk6kgwhrkkauz7xsy2';

    navigator.clipboard.writeText(btcAddress);
  };

  return (
    <Modal size="sm" open={show} backdrop={false} onClose={close}>
      <Nav activeKey={activeSponsorType} appearance="subtle" onSelect={(sponsorType) => setActiveSponsorType(sponsorType)}>
        <Nav.Item eventKey="btc">BTC</Nav.Item>
        <Nav.Item eventKey="lbtc">L-BTC</Nav.Item>
      </Nav>
      <Modal.Body>
        <div>
          <InputGroup>
            <Input
              name="input"
              className="sponsor-modal-address-input"
              onChange={() => {}}
              value={`${
                activeSponsorType === 'btc'
                  ? 'bc1qxs7cmf53kqmey0xzt308l0mq2hm35utu45qcjy'
                  : 'lq1qqdz4844m679zvpvvnulu6q4zm9nqr4ws2gr7u46xncva5ma3p7yphytwtuc64rtuefs2s45f45nfv9xwk6kgwhrkkauz7xsy2'
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
