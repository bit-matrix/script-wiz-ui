import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
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
  const [customValue, setCustomValue] = useState<RadioInput>({ inputValue: '', inputType: defaultType as types });
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
    //secilen deger be
    if (radioValue === types.BE) {
      //le(onceki deger) to be
      if (customValue.inputType === types.LE) {
        const result = hexLE(customValue.inputValue);

        setBEResult({ inputType: types.BE, inputValue: result });
        setCustomValue({ inputType: types.BE, inputValue: result });
      }

      //decimal(onceki deger) to be
      if (customValue.inputType === types.DECIMAL) {
        setBEResult({ inputType: types.BE, inputValue: 'aaa' });
        setCustomValue({ inputType: types.BE, inputValue: 'aaa' });
      }
    }

    //secilen deger le
    if (radioValue === types.LE) {
      //be(onceki deger) to le
      if (customValue.inputType === types.BE) {
        const result = hexLE(customValue.inputValue);

        setLEResult({ inputType: types.LE, inputValue: result });
        setCustomValue({ inputType: types.LE, inputValue: result });
      }

      //decimal(onceki deger) to le
      if (customValue.inputType === types.DECIMAL) {
        setLEResult({ inputType: types.LE, inputValue: 'bbb' });
        setCustomValue({ inputType: types.LE, inputValue: 'bbb' });
      }
    }

    //secilen deger decimal
    if (radioValue === types.DECIMAL) {
      //be(onceki deger) to decimal
      if (customValue.inputType === types.BE) {
        const decimal = hexLE(customValue.inputValue);
        const decimalWizData = WizData.fromHex(decimal);
        const result = convertion.LE32ToNum(decimalWizData).number?.toString() ?? '';

        setDecimalResult({ inputType: types.DECIMAL, inputValue: result });
        setCustomValue({ inputType: types.DECIMAL, inputValue: result });
      }

      //le(onceki deger) to decimal
      if (customValue.inputType === types.LE) {
        const decimalWizData = WizData.fromHex(customValue.inputValue);
        const result = convertion.LE32ToNum(decimalWizData).number?.toString() ?? '';

        setDecimalResult({ inputType: types.DECIMAL, inputValue: result });
        setCustomValue({ inputType: types.DECIMAL, inputValue: result });
      }
    }
  };

  useEffect(() => {
    if (showTypes && value) {
      setCustomValue({ inputValue: value, inputType: defaultType as types });
    }
  }, [defaultType, showTypes, value]);

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
        value={showTypes ? customValue.inputValue : value}
        placeholder={placeholderSelector()}
        onChange={(value: string) => {
          txModalOnChange(value);
        }}
      />
    </div>
  );
};

export default TransactionCustomInput;
