import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Input, Radio, RadioGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import WizData, { hexLE } from '@script-wiz/wiz-data';
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
};

type RadioInput = {
  inputValue: string;
  inputType: types;
};

const TransactionCustomInput: FC<Props> = ({ name, label, placeholderValue, showTypes, defaultType, txModalOnChange, value }) => {
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
          const be = hexLE(customValue.inputValue);

          setCustomValue({ inputType: types.BE, inputValue: be });
        }

        //decimal(previous value) to be
        if (customValue.inputType === types.DECIMAL) {
          const numberWizData = WizData.fromNumber(Number(customValue.inputValue));
          const le = convertion.numToLE32(numberWizData).hex;
          const be = hexLE(le);

          setCustomValue({ inputType: types.BE, inputValue: be });
        }
      }

      //selected value le
      if (radioValue === types.LE) {
        //be(previous value) to le
        if (customValue.inputType === types.BE) {
          const le = hexLE(customValue.inputValue);

          setCustomValue({ inputType: types.LE, inputValue: le });
        }

        //decimal(previous value) to le
        if (customValue.inputType === types.DECIMAL) {
          const numberWizData = WizData.fromNumber(Number(customValue.inputValue));
          const le = convertion.numToLE32(numberWizData).hex;

          setCustomValue({ inputType: types.LE, inputValue: le });
        }
      }

      //selected value decimal
      if (radioValue === types.DECIMAL) {
        //be(previous value) to decimal
        if (customValue.inputType === types.BE) {
          const le = hexLE(customValue.inputValue);
          const leWizData = WizData.fromHex(le);
          const decimal = convertion.LE64ToNum(leWizData).number?.toString() ?? '';

          setCustomValue({ inputType: types.DECIMAL, inputValue: decimal });
        }

        //le(previous value) to decimal
        if (customValue.inputType === types.LE) {
          const leWizData = WizData.fromHex(customValue.inputValue);
          const decimal = convertion.LE64ToNum(leWizData).number?.toString() ?? '';

          setCustomValue({ inputType: types.DECIMAL, inputValue: decimal });
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
      />
    </div>
  );
};

export default TransactionCustomInput;
