import React from "react";
import { Dropdown, Icon } from "rsuite";
import logo from "../../images/transparent_white.png";
import "./ScriptNavbar.scss";

const ScriptNavbar = () => {
    return (
        <div className="script-editor-header-bar">
            <div className="script-editor-header-left-section">
                <div>
                    <img className="script-wiz-logo" src={logo} />
                </div>
                <a href="https://github.com/bit-matrix" className="script-editor-header-icon-item">
                    <Icon icon="github" />
                    <span className="script-editor-header-icon-item-text">Github</span>
                </a>
                <a href="https://twitter.com/bitmatrix_" className="script-editor-header-icon-item">
                    <Icon icon="twitter" />
                    <span className="script-editor-header-icon-item-text">Npm</span>
                </a>
                <a href="https://twitter.com/bitmatrix_" className="script-editor-header-icon-item">
                    <Icon icon="twitter" />
                    <span className="script-editor-header-icon-item-text">Twitter</span>
                </a>
                <a className="script-editor-header-icon-item">
                    <Icon icon="medium" />
                    <span className="script-editor-header-icon-item-text">Medium</span>
                </a>
                <a href="https://t.me/bitmatrix_community" className="script-editor-header-icon-item">
                    <Icon icon="telegram" />
                    <span className="script-editor-header-icon-item-text">Telegram</span>
                </a>
            </div>
            <div className="script-editor-header-right-section">
                <Dropdown
                    className="script-editor-header-right-section-dropdown"
                    title={
                        <div className="dropdown-item">
                            <span>Liquid Network</span>
                        </div>
                    }
                    activeKey="a"
                >
                    <Dropdown.Item eventKey="a">
                        {
                            <div className="dropdown-item">
                                <span>Bitcoin Network</span>
                            </div>
                        }
                    </Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    );
};

export default ScriptNavbar;
