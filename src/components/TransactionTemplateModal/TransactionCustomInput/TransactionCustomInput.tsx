import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Input, Radio, RadioGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import { convertion } from '@script-wiz/lib-core';
import { types } from '../../../utils/enum/TYPES';
import './TransactionCustomInput.scss';

type Props = {
  name?: string;
  label: string;
  placeholderValue?: string;
  showTypes: boolean;
  defaultType?: types;
  txModalOnChange: (value: string) => void;
  value: string | undefined;
  disableInput?: boolean;
};

type RadioInput = {
  inputValue: string;
  inputType: types;
};

const TransactionCustomInput: FC<Props> = ({ name, label, placeholderValue, showTypes, defaultType, txModalOnChange, value, disableInput }) => {
  const [type, setType] = useState<types | undefined>(defaultType);
  const [customValue, setCustomValue] = useState<RadioInput>({ inputValue: '', inputType: defaultType as types });

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
    if (!customValue.inputValue) setCustomValue({ inputType: types.BE, inputValue: '' });
    else {
      //selected value be
      if (radioValue === types.BE) {
        //le(previous value) to be
        if (customValue.inputType === types.LE) {
          if (name === 'amount') {
            const bytes8Values = convertion.inputConverter(customValue.inputValue, types.LE, '8-bytes');
            setCustomValue({ inputType: types.BE, inputValue: bytes8Values.be });
          }
          if (name === 'sequence') {
            const bytes4Values = convertion.inputConverter(customValue.inputValue, types.LE, '4-bytes');
            setCustomValue({ inputType: types.BE, inputValue: bytes4Values.be });
          }
        }

        //decimal(previous value) to be
        if (customValue.inputType === types.DECIMAL) {
          if (name === 'amount') {
            const bytes8Values = convertion.inputConverter(customValue.inputValue, types.DECIMAL, '8-bytes');
            setCustomValue({ inputType: types.BE, inputValue: bytes8Values.be });
          }

          if (name === 'sequence') {
            const bytes4Values = convertion.inputConverter(customValue.inputValue, types.DECIMAL, '4-bytes');
            setCustomValue({ inputType: types.BE, inputValue: bytes4Values.be });
          }
        }
      }

      //selected value le
      if (radioValue === types.LE) {
        //be(previous value) to le
        if (customValue.inputType === types.BE) {
          if (name === 'amount') {
            const bytes8Values = convertion.inputConverter(customValue.inputValue, types.BE, '8-bytes');
            setCustomValue({ inputType: types.LE, inputValue: bytes8Values.le });
          }

          if (name === 'sequence') {
            const bytes4Values = convertion.inputConverter(customValue.inputValue, types.BE, '4-bytes');
            setCustomValue({ inputType: types.LE, inputValue: bytes4Values.le });
          }
        }

        //decimal(previous value) to le
        if (customValue.inputType === types.DECIMAL) {
          if (name === 'amount') {
            const bytes8Values = convertion.inputConverter(customValue.inputValue, types.DECIMAL, '8-bytes');
            setCustomValue({ inputType: types.LE, inputValue: bytes8Values.le });
          }

          if (name === 'sequence') {
            const bytes4Values = convertion.inputConverter(customValue.inputValue, types.DECIMAL, '4-bytes');
            setCustomValue({ inputType: types.LE, inputValue: bytes4Values.le });
          }
        }
      }

      //selected value decimal
      if (radioValue === types.DECIMAL) {
        //be(previous value) to decimal
        if (customValue.inputType === types.BE) {
          if (name === 'amount') {
            const bytes8Values = convertion.inputConverter(customValue.inputValue, types.BE, '8-bytes');
            setCustomValue({ inputType: types.DECIMAL, inputValue: (Number(bytes8Values.decimal) / 100000000).toString() });
          }

          if (name === 'sequence') {
            const bytes4Values = convertion.inputConverter(customValue.inputValue, types.BE, '4-bytes');
            setCustomValue({ inputType: types.DECIMAL, inputValue: bytes4Values.decimal });
          }
        }

        //le(previous value) to decimal
        if (customValue.inputType === types.LE) {
          if (name === 'amount') {
            const bytes8Values = convertion.inputConverter(customValue.inputValue, types.LE, '8-bytes');
            setCustomValue({ inputType: types.DECIMAL, inputValue: (Number(bytes8Values.decimal) / 100000000).toString() });
          }

          if (name === 'sequence') {
            const bytes4Values = convertion.inputConverter(customValue.inputValue, types.LE, '4-bytes');
            setCustomValue({ inputType: types.DECIMAL, inputValue: bytes4Values.decimal });
          }
        }
      }
    }
  };

  useEffect(() => {
    if (showTypes) {
      setCustomValue({ inputValue: value as string, inputType: type as types });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        style={disableInput ? { color: '#979797' } : { color: 'none' }}
      />
    </div>
  );
};

export default TransactionCustomInput;
