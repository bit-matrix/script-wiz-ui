/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Dropdown, Icon, IconButton, Tooltip, Whisper } from 'rsuite';
import logo from '../../images/transparent_white.png';
import { SponsorModal } from './SponsorModal/SponsorModal';
import './ScriptNavbar.scss';
import { VM } from '@script-wiz/lib';

type Props = {
  vm: VM;
  onSelectVm: (selectedVm: VM) => void;
};

const ScriptNavbar: React.FC<Props> = ({ vm, onSelectVm }) => {
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);

  return (
    <div className="script-editor-header-bar">
      <SponsorModal
        show={showSponsorModal}
        close={() => setShowSponsorModal(false)}
      ></SponsorModal>
      <div className="script-editor-header-left-section">
        <div>
          <img className="script-wiz-logo" src={logo} />
        </div>
        <a
          href="https://github.com/bit-matrix/script-wiz-lib"
          target="_blank"
          className="script-editor-header-icon-item"
          rel="noreferrer"
        >
          <Icon icon="github" />
          <span className="script-editor-header-icon-item-text hidden-mobile">
            Github
          </span>
        </a>
        <a
          href="https://www.npmjs.com/package/@script-wiz/lib"
          target="_blank"
          className="script-editor-header-icon-item npm-div"
          rel="noreferrer"
        >
          <i className="fab fa-npm fa-2x"></i>
          <span className="script-editor-header-icon-item-text  hidden-mobile">
            Npm
          </span>
        </a>
        <a
          href="https://twitter.com/script_wizard"
          target="_blank"
          className="script-editor-header-icon-item"
          rel="noreferrer"
        >
          <Icon icon="twitter" />
          <span className="script-editor-header-icon-item-text  hidden-mobile">
            Twitter
          </span>
        </a>
        <a
          href="https://medium.com/script-wizard"
          className="script-editor-header-icon-item"
        >
          <Icon icon="medium" />
          <span className="script-editor-header-icon-item-text  hidden-mobile">
            Medium
          </span>
        </a>
        <a
          href="https://t.me/scriptwizard"
          target="_blank"
          className="script-editor-header-icon-item"
          rel="noreferrer"
        >
          <Icon icon="telegram" />
          <span className="script-editor-header-icon-item-text hidden-mobile">
            Telegram
          </span>
        </a>
      </div>
      <div className="script-editor-header-right-section">
        <Whisper
          placement="bottom"
          trigger="hover"
          speaker={<Tooltip>Become a sponsor</Tooltip>}
        >
          <IconButton
            icon={<Icon icon="heart" />}
            circle
            size="sm"
            className="sponsor-button"
            onClick={() => setShowSponsorModal(true)}
          />
        </Whisper>

        <Dropdown
          className="script-editor-header-right-section-dropdown"
          title={
            <div className="dropdown-item">
              <span>Liquid (SegWit/Legacy)</span>
            </div>
          }
          activeKey="a"
        >
          <Dropdown.Item disabled eventKey="b">
            {
              <div className="dropdown-item">
                <span>Liquid (Tapscript)</span>
              </div>
            }
          </Dropdown.Item>
          <Dropdown.Item disabled eventKey="c">
            {
              <div className="dropdown-item">
                <span>Bitcoin (SegWit/Legacy)</span>
              </div>
            }
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};

export default ScriptNavbar;
