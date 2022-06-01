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
  label: string;
  placeholderValue?: string;
  typeOnChange?: (type: types) => void;
  showTypes: boolean;
  txModalOnChange: (value: string) => void;
  localStorageValue: string;
};

const TransactionCustomInput: FC<Props> = ({ label, placeholderValue, typeOnChange, showTypes, txModalOnChange, localStorageValue }) => {
  const [type, setType] = useState<types>(types.BE);

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
              if (showTypes) typeOnChange?.(value as types);
            }}
          >
            <Radio value={types.BE}>{types.BE}</Radio>
            <Radio value={types.LE}>{types.LE}</Radio>
            <Radio value={types.DECIMAL}>{types.DECIMAL}</Radio>
          </RadioGroup>
        )}
      </div>
      <Input
        value={localStorageValue}
        placeholder={placeholderValue ? placeholderValue : ''}
        onChange={(value: string) => {
          txModalOnChange(value);
        }}
      />
    </div>
  );
};

export default TransactionCustomInput;
