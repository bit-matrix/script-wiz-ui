import React from 'react';
import { Popover, Whisper } from 'rsuite';
import { getOutputValueType } from '../../helper';
import './CustomWhisper.scss';

type Props = {
  tooltip: string;
  display: string;
  label?: string;
  key: string;
};

const CustomWhisper: React.FC<Props> = ({ tooltip, display, label, key }) => {
  const speaker = (
    <Popover className="custom-popover" title="">
      <span className="tooltiptext">{'0x' + tooltip}</span>
    </Popover>
  );

  return (
    <Whisper delayOpen={500} placement="auto" trigger="hover" speaker={speaker} controlId={key} enterable>
      <div className="tooltip">
        <div className={`editor-output-text ${getOutputValueType(display)}`}>
          {label ? <em className="editor-output-label">{label} </em> : ''}
          {display}
        </div>
      </div>
    </Whisper>
  );
};

export default CustomWhisper;
