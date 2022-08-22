import React from 'react';
import { getOutputValueType } from '../../helper';

const CustomWhisper = ({ tooltip, display }) => {
  return (
    <div className="tooltip">
      <div className={`editor-output-text ${getOutputValueType(display)} `}>{display}</div>
      <span className="tooltiptext">{'0x' + tooltip}</span>
    </div>
  );
};

export default CustomWhisper;
