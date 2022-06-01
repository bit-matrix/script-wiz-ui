import React, { FC, useState } from 'react';
import { Input, Radio, RadioGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';

enum types {
  BE = 'BE',
  LE = 'LE',
  DECIMAL = 'Decimal',
}

type Props = {
  label: string;
  showPlaceholder: boolean;
  placeholderValue?: string;
  typeOnChange?: (type: types) => void;
  showTypes: boolean;
  txModalOnChange: (value: string) => void;
};

const TransactionCustomInput: FC<Props> = ({ label, showPlaceholder, placeholderValue, typeOnChange, showTypes, txModalOnChange }) => {
  const [type, setType] = useState<types>(types.BE);

  return (
    <div className="tx-input-item">
      <div className="tx-modal-label-with-radio">
        <div className="tx-modal-label">{label}</div>
        {showTypes && (
          <RadioGroup inline name="radioList" value={type} onChange={(value: ValueType) => {}}>
            <Radio value={types.BE}>{types.BE}</Radio>
            <Radio value={types.LE}>{types.LE}</Radio>
            <Radio value={types.DECIMAL}>{types.DECIMAL}</Radio>
          </RadioGroup>
        )}
      </div>
      <Input
        placeholder={showPlaceholder ? placeholderValue : ''}
        onChange={(value: string) => {
          txModalOnChange(value);
        }}
      />
    </div>
  );
};

export default TransactionCustomInput;
