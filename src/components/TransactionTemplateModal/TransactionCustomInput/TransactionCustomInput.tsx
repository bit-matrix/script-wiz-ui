import { SyntheticEvent, useEffect, useState } from 'react';
import { inputConverter } from '@script-wiz/lib-core/convertion';
import { Input, Radio, RadioGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import { VALUE_TYPES } from '../../../utils/enum/VALUE_TYPES';
import './TransactionCustomInput.scss';

type Props = {
  name: string;
  label: string;
  value: string; // local storage icerisindeki degeri getirmek icin
  valueOnChange: (value: string) => void; // degeri local storage a kaydetmek lazim
  placeholder?: string;
  defaultValueType?: VALUE_TYPES;
};

type InputWithRadio = {
  typeValue: VALUE_TYPES;
  value: string;
};

const TransactionCustomInput: React.FC<Props> = ({ name, label, value, valueOnChange, placeholder, defaultValueType }) => {
  const [typeValue, setTypeValue] = useState<VALUE_TYPES | undefined>(defaultValueType);
  const [customValue, setCustomValue] = useState<InputWithRadio>({ typeValue: defaultValueType as VALUE_TYPES, value: '' }); // valueType degerine gore sonuc degisecek

  const radioChange = (value: VALUE_TYPES) => {
    setTypeValue(value);
    showInputValue(value);
  };

  const placeholderOnChange = () => {
    if (typeValue === VALUE_TYPES.DECIMAL) {
      return '0';
    } else if (typeValue === VALUE_TYPES.BE || typeValue === VALUE_TYPES.LE) {
      if (name === 'sequence') return '4-bytes';
      if (name === 'amount') return '8-bytes';
    }

    return placeholder;
  };

  const showInputValue = (radioValue: VALUE_TYPES) => {
    if (!customValue.value) setCustomValue({ typeValue: VALUE_TYPES.BE, value: '' });
    else {
      //selected value be
      if (radioValue === VALUE_TYPES.BE) {
        //le(previous value) to be
        if (customValue.typeValue === VALUE_TYPES.LE) {
          if (name === 'amount') {
            const bytes8Values = inputConverter(customValue.value, VALUE_TYPES.LE, '8-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.BE, value: bytes8Values.be });
          }
          if (name === 'sequence') {
            const bytes4Values = inputConverter(customValue.value, VALUE_TYPES.LE, '4-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.BE, value: bytes4Values.be });
          }
        }

        //decimal(previous value) to be
        if (customValue.typeValue === VALUE_TYPES.DECIMAL) {
          if (name === 'amount') {
            const bytes8Values = inputConverter(customValue.value, VALUE_TYPES.DECIMAL, '8-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.BE, value: bytes8Values.be });
          }

          if (name === 'sequence') {
            const bytes4Values = inputConverter(customValue.value, VALUE_TYPES.DECIMAL, '4-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.BE, value: bytes4Values.be });
          }
        }
      }

      //selected value le
      if (radioValue === VALUE_TYPES.LE) {
        //be(previous value) to le
        if (customValue.typeValue === VALUE_TYPES.BE) {
          if (name === 'amount') {
            const bytes8Values = inputConverter(customValue.value, VALUE_TYPES.BE, '8-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.LE, value: bytes8Values.le });
          }

          if (name === 'sequence') {
            const bytes4Values = inputConverter(customValue.value, VALUE_TYPES.BE, '4-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.LE, value: bytes4Values.le });
            console.log(customValue);
          }
        }

        //decimal(previous value) to le
        if (customValue.typeValue === VALUE_TYPES.DECIMAL) {
          if (name === 'amount') {
            const bytes8Values = inputConverter(customValue.value, VALUE_TYPES.DECIMAL, '8-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.LE, value: bytes8Values.le });
          }

          if (name === 'sequence') {
            const bytes4Values = inputConverter(customValue.value, VALUE_TYPES.DECIMAL, '4-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.LE, value: bytes4Values.le });
          }
        }
      }

      //selected value decimal
      if (radioValue === VALUE_TYPES.DECIMAL) {
        //be(previous value) to decimal
        if (customValue.typeValue === VALUE_TYPES.BE) {
          if (name === 'amount') {
            const bytes8Values = inputConverter(customValue.value, VALUE_TYPES.BE, '8-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.DECIMAL, value: (Number(bytes8Values.decimal) / 100000000).toString() });
          }

          if (name === 'sequence') {
            const bytes4Values = inputConverter(customValue.value, VALUE_TYPES.BE, '4-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.DECIMAL, value: bytes4Values.decimal });
          }
        }

        //le(previous value) to decimal
        if (customValue.typeValue === VALUE_TYPES.LE) {
          if (name === 'amount') {
            const bytes8Values = inputConverter(customValue.value, VALUE_TYPES.LE, '8-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.DECIMAL, value: (Number(bytes8Values.decimal) / 100000000).toString() });
          }

          if (name === 'sequence') {
            const bytes4Values = inputConverter(customValue.value, VALUE_TYPES.LE, '4-bytes');
            setCustomValue({ typeValue: VALUE_TYPES.DECIMAL, value: bytes4Values.decimal });
          }
        }
      }
    }
  };

  useEffect(() => {
    if (defaultValueType) {
      setCustomValue({ value: value, typeValue: typeValue as VALUE_TYPES });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValueType, value]);

  return (
    <div className="tx-custom-input-item">
      <div className="tx-custom-input-label-radio">
        <div className="tx-custom-input-label">{label}</div>
        {customValue.typeValue && (
          <RadioGroup
            inline
            name="radioList"
            value={typeValue}
            onChange={(value: ValueType, event: SyntheticEvent<Element, Event>) => radioChange(value as VALUE_TYPES)}
          >
            <Radio value={VALUE_TYPES.BE}>{VALUE_TYPES.BE}</Radio>
            <Radio value={VALUE_TYPES.LE}>{VALUE_TYPES.LE}</Radio>
            <Radio value={VALUE_TYPES.DECIMAL}>{VALUE_TYPES.DECIMAL}</Radio>
          </RadioGroup>
        )}
      </div>
      <Input
        value={defaultValueType ? customValue.value : value}
        placeholder={placeholderOnChange()}
        onChange={(value: string) => {
          valueOnChange(value);
        }}
      />
    </div>
  );
};

export default TransactionCustomInput;
