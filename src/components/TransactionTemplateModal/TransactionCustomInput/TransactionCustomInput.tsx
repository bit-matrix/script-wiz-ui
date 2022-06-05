import React, { FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Input, Radio, RadioGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import WizData, { hexLE } from '@script-wiz/wiz-data';
import { convertion } from '@script-wiz/lib-core';
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

type RadioInput = {
  inputValue: string;
  inputType: types;
};

const TransactionCustomInput: FC<Props> = ({ name, label, placeholderValue, showTypes, defaultType, txModalOnChange, value }) => {
  const [type, setType] = useState<types | undefined>(defaultType);
  const [customValue, setCustomValue] = useState<string | undefined>();
  const [BEResult, setBEResult] = useState<RadioInput>({ inputValue: '', inputType: types.BE });
  const [LEResult, setLEResult] = useState<RadioInput>({ inputValue: '', inputType: types.LE });
  const [decimalResult, setDecimalResult] = useState<RadioInput>({ inputValue: '', inputType: types.DECIMAL });

  const placeholderSelector = () => {
    if (type === types.DECIMAL) {
      return '0';
    } else if (type === types.BE || type === types.LE) {
      if (name === 'sequence') return '4-bytes';
      if (name === 'amount') return '8-bytes';
    }

    return placeholderValue;
  };

  const radioOnChange = (radioValue: types) => {
    setType(radioValue);

    showInputValue(radioValue);
  };

  const showInputValue = (radioValue: types) => {
    if (customValue) {
      if (BEResult.inputType === types.BE) {
        setBEResult({ inputType: types.BE, inputValue: customValue });

        if (radioValue === types.BE) {
          setCustomValue(BEResult.inputValue);
        }

        if (radioValue === types.LE) {
          const le = hexLE(customValue);

          setLEResult({ inputType: types.LE, inputValue: le });
          setCustomValue(le);
        }

        if (radioValue === types.DECIMAL) {
          const decimal = hexLE(customValue);
          const decimalWizData = WizData.fromHex(decimal);
          const result = convertion.LE32ToNum(decimalWizData).number?.toString() ?? '';

          setDecimalResult({ inputType: types.DECIMAL, inputValue: result });
          setCustomValue(result);
        }
      }
    }
  };

  useEffect(() => {
    if (showTypes) {
      setCustomValue(value);
      // console.log('BEValue', BEResult);
      // console.log('LEValue', LEResult);
      // console.log('DecimalValue', decimalResult);
    }
  }, [showTypes, value]);

  return (
    <div className="tx-custom-input-item">
      <div className="tx-custom-input-label-radio">
        <div className="tx-custom-input-label">{label}</div>
        {showTypes && (
          <RadioGroup
            inline
            name="radioList"
            value={type}
            onChange={(value: ValueType, event: SyntheticEvent<Element, Event>) => radioOnChange(value as types)}
          >
            <Radio value={types.BE}>{types.BE}</Radio>
            <Radio value={types.LE}>{types.LE}</Radio>
            <Radio value={types.DECIMAL}>{types.DECIMAL}</Radio>
          </RadioGroup>
        )}
      </div>
      <Input
        value={showTypes ? customValue : value}
        placeholder={placeholderSelector()}
        onChange={(value: string) => {
          txModalOnChange(value);
        }}
      />
    </div>
  );
};

export default TransactionCustomInput;
