import React from 'react';
import { getOutputValueType } from '../../helper';

type Props = {
  tooltip: string;
  display: string;
  label?: string;
};

const CustomWhisper: React.FC<Props> = ({ tooltip, display, label }) => {
  return (
    <div className="tooltip">
      <div className={`editor-output-text ${getOutputValueType(display)}`}>
        {label ? <em className="editor-output-label">{label} </em> : ''}
        {display}
      </div>
      <span className="tooltiptext">{'0x' + tooltip}</span>
    </div>
  );
};

export default CustomWhisper;
