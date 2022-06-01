import React, { FC, useState } from 'react';
import { Input, Radio, RadioGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import './TransactionCustomInput.scss';

enum types {
  BE = 'BE',
  LE = 'LE',
  DECIMAL = 'Decimal',
}

type Props = {
  name?: string;
  label: string;
  placeholderValue?: string;
  showTypes: boolean;
  defaultType?: types;
  txModalOnChange: (value: string) => void;
  value: string | undefined;
};

const TransactionCustomInput: FC<Props> = ({ name, label, placeholderValue, showTypes, defaultType, txModalOnChange, value }) => {
  const [type, setType] = useState<types | undefined>(defaultType);

  const placeholderSelector = () => {
    if (type === types.DECIMAL) {
      return '0';
    } else if (type === types.BE || type === types.LE) {
      if (name === 'sequence') return '4-bytes';
      if (name === 'amount') return '8-bytes';
    }

    return placeholderValue;
  };

  return (
    <div className="tx-custom-input-item">
      <div className="tx-custom-input-label-radio">
        <div className="tx-custom-input-label">{label}</div>
        {showTypes && (
          <RadioGroup
            inline
            name="radioList"
            value={type}
            onChange={(value: ValueType) => {
              setType(value as types);
            }}
          >
            <Radio value={types.BE}>{types.BE}</Radio>
            <Radio value={types.LE}>{types.LE}</Radio>
            <Radio value={types.DECIMAL}>{types.DECIMAL}</Radio>
          </RadioGroup>
        )}
      </div>
      <Input
        value={value}
        placeholder={placeholderSelector()}
        onChange={(value: string) => {
          txModalOnChange(value);
        }}
      />
    </div>
  );
};

export default TransactionCustomInput;
