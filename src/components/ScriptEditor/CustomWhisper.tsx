import React from 'react';
import { getOutputValueType } from '../../helper';

type Props = {
  tooltip: string;
  display: string;
};

export const CustomWhisper: React.FC<Props> = ({ tooltip, display }) => {
  return (
    <div className="tooltip">
      <div className={`editor-output-text ${getOutputValueType(display)} `}>{display}</div>
      <span className="tooltiptext">{'0x' + tooltip}</span>
    </div>
  );
};
