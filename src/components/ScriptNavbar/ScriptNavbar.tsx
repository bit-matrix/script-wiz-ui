/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from 'react';
import { Dropdown, Tooltip, Whisper } from 'rsuite';
import logo from '../../images/transparent_white.png';
import { SponsorModal } from './SponsorModal/SponsorModal';
import { VM, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
import { ROUTE_PATH } from '../../router/ROUTE_PATH';
import GithubIcon from '../Svg/Icons/Github';
import TwitterIcon from '../Svg/Icons/Twitter';
import MediumIcon from '../Svg/Icons/Medium';
import TelegramIcon from '../Svg/Icons/Telegram';
import HeartIcon from '../Svg/Icons/Heart';
import NpmIcon from '../Svg/Icons/Npm';
import ToolsIcon from '../Svg/Icons/Tools';
import MagicIcon from '../Svg/Icons/Magic';
import './ScriptNavbar.scss';

type Props = {
  vm: VM;
  onSelectVm: (selectedVm: VM) => void;
};

const ScriptNavbar: React.FC<Props> = ({ vm, onSelectVm }) => {
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);

  const title = useMemo(() => {
    if (vm.network === VM_NETWORK.LIQUID && vm.ver === VM_NETWORK_VERSION.SEGWIT) {
      return 'Liquid (SegWit/Legacy)';
    } else if (vm.network === VM_NETWORK.LIQUID && vm.ver === VM_NETWORK_VERSION.TAPSCRIPT) {
      return 'Liquid (Tapscript)';
    } else if (vm.network === VM_NETWORK.BTC && vm.ver === VM_NETWORK_VERSION.SEGWIT) {
      return 'Bitcoin (SegWit/Legacy)';
    } else if (vm.network === VM_NETWORK.BTC && vm.ver === VM_NETWORK_VERSION.TAPSCRIPT) {
      return 'Bitcoin (Tapscript)';
    }
  }, [vm]);

  return (
    <div className="script-editor-header-bar">
      <SponsorModal show={showSponsorModal} close={() => setShowSponsorModal(false)}></SponsorModal>
      <div className="script-editor-header-left-section">
        <div>
          <img className="script-wiz-logo" src={logo} />
        </div>
        <a href="https://github.com/bit-matrix/script-wiz-lib" target="_blank" className="script-editor-header-icon-item" rel="noreferrer">
          <GithubIcon width="1rem" height="1rem" />
          <span className="script-editor-header-icon-item-text hidden-mobile">Github</span>
        </a>
        <a href="https://www.npmjs.com/package/@script-wiz/lib" target="_blank" className="script-editor-header-icon-item npm-div" rel="noreferrer">
          <NpmIcon />
          <span className="script-editor-header-icon-item-text  hidden-mobile script-editor-header-npm-text">Npm</span>
        </a>
        <a href="https://twitter.com/script_wizard" target="_blank" className="script-editor-header-icon-item" rel="noreferrer">
          <TwitterIcon width="0.85rem" height="0.85rem" />
          <span className="script-editor-header-icon-item-text  hidden-mobile">Twitter</span>
        </a>
        <a href="https://medium.com/script-wizard" className="script-editor-header-icon-item">
          <MediumIcon width="0.85rem" height="0.85rem" />
          <span className="script-editor-header-icon-item-text  hidden-mobile">Medium</span>
        </a>
        <a href="https://t.me/scriptwizard" target="_blank" className="script-editor-header-icon-item" rel="noreferrer">
          <TelegramIcon width="0.85rem" height="0.85rem" />
          <span className="script-editor-header-icon-item-text hidden-mobile">Telegram</span>
        </a>
      </div>
      <div className="script-editor-header-right-section">
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Signature Tools</Tooltip>}>
          <div onClick={() => window.open(ROUTE_PATH.SIGNATURE_TOOLS, '_blank')} className="route-button">
            <ToolsIcon width="1rem" height="1rem" />
          </div>
        </Whisper>
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Wiz Data Tools</Tooltip>}>
          <div className="route-button" onClick={() => window.open(ROUTE_PATH.HELPER, '_blank')}>
            <MagicIcon width="1rem" height="1rem" />
          </div>
        </Whisper>
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Become a sponsor</Tooltip>}>
          <div className="sponsor-button" onClick={() => setShowSponsorModal(true)}>
            <HeartIcon fill="#FF69B4" width="1rem" height="1rem" />
          </div>
        </Whisper>

        <Dropdown className="script-editor-header-right-section-dropdown" title={<span>{title}</span>} activeKey={`${vm.network} - ${vm.ver}`}>
          <Dropdown.Item
            eventKey={`${VM_NETWORK.LIQUID} - ${VM_NETWORK_VERSION.SEGWIT}`}
            onSelect={() => {
              onSelectVm({ network: VM_NETWORK.LIQUID, ver: VM_NETWORK_VERSION.SEGWIT });
            }}
          >
            {
              <div className="dropdown-item">
                <span>Liquid (SegWit/Legacy)</span>
              </div>
            }
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={`${VM_NETWORK.BTC} - ${VM_NETWORK_VERSION.SEGWIT}`}
            onSelect={() => {
              onSelectVm({ network: VM_NETWORK.BTC, ver: VM_NETWORK_VERSION.SEGWIT });
            }}
          >
            {
              <div className="dropdown-item">
                <span>Bitcoin (SegWit/Legacy)</span>
              </div>
            }
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={`${VM_NETWORK.LIQUID} - ${VM_NETWORK_VERSION.TAPSCRIPT}`}
            onSelect={() => {
              onSelectVm({ network: VM_NETWORK.LIQUID, ver: VM_NETWORK_VERSION.TAPSCRIPT });
            }}
          >
            {
              <div className="dropdown-item">
                <span>Liquid (Tapscript)</span>
              </div>
            }
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={`${VM_NETWORK.BTC} - ${VM_NETWORK_VERSION.TAPSCRIPT}`}
            onSelect={() => {
              onSelectVm({ network: VM_NETWORK.BTC, ver: VM_NETWORK_VERSION.TAPSCRIPT });
            }}
          >
            {
              <div className="dropdown-item">
                <span>Bitcoin (Tapscript)</span>
              </div>
            }
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};

export default ScriptNavbar;
