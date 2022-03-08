import React, { useCallback } from 'react';
import { getOutputValueType } from '../../helper';
import WizData from '@script-wiz/wiz-data';

type Props = {
  key: string;
  tooltip: string;
  display: string;
  label?: string;
};

const CustomWhisper: React.FC<Props> = ({ key, tooltip, display, label }) => {
  return (
    <div className="tooltip" key={key}>
      <div className={`editor-output-text ${getOutputValueType(display)} `}>
        {label ? <em className="editor-output-label">{label} </em> : ''}
        {display}
      </div>
      <span className="tooltiptext">{'0x' + tooltip}</span>
    </div>
  );
};

export default CustomWhisper;
