import React from 'react';
import { getOutputValueType } from '../../helper';

type Props = {
  key: string;
  tooltip: string;
  display: string;
};

const Whisper: React.FC<Props> = ({ key, tooltip, display }) => {
  return (
    <div className="tooltip" key={key}>
      <div className={`editor-output-text ${getOutputValueType(display)} `}>{display}</div>
      <span className="tooltiptext">{'0x' + tooltip}</span>
    </div>
  );
};

export default Whisper;
