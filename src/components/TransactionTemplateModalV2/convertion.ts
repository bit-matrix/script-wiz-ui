import WizData, { hexLE } from '@script-wiz/wiz-data';
import BN from 'bn.js';

export const convert64 = (wizData: WizData): WizData => {
  const isNegate = wizData.bin.charAt(0) === '1';

  let input = new BN(wizData.bin, 2);

  if (!isNegate) {
    const input64 = input.toString(2, 64);

    return WizData.fromBin(input64);
  } else {
    if (wizData.number) input = new BN(wizData.number || 0);

    const negateValue = input.abs().neg();

    const twosNegateValue = negateValue.toTwos(64);

    const twosNegateValue64 = twosNegateValue.toString(2, 64);

    return WizData.fromBin(twosNegateValue64);
  }
};

export const numToLE64 = (wizData: WizData): WizData => {
  const inputByteLength = wizData.bytes.length;

  if (inputByteLength > 8) throw 'Input byte length must be maximum 8 byte';

  return convert64(wizData);
};

export const numToLE64LE = (wizData: WizData): WizData => {
  const inputHex = numToLE64(wizData).hex;
  const inputHexLe = hexLE(inputHex);

  return WizData.fromHex(inputHexLe);
};

export const numToLE32 = (wizData: WizData): WizData => {
  const inputByteLength = wizData.bytes.length;

  if (inputByteLength > 4) throw 'Input byte length must be maximum 4 byte';

  return convert32(wizData);
};

export const convert32 = (wizData: WizData): WizData => {
  const isNegate = wizData.bin.charAt(0) === '1';

  let input = new BN(wizData.bin, 2);

  if (!isNegate) {
    const input32 = input.toString(2, 32);

    return WizData.fromBin(input32);
  } else {
    if (wizData.number) input = new BN(wizData.number || 0);

    const negateValue = input.abs().neg();

    const twosNegateValue = negateValue.toTwos(32);

    const twosNegateValue32 = twosNegateValue.toString(2, 32);

    return WizData.fromBin(twosNegateValue32);
  }
};

export const LE64ToNum = (wizData: WizData): WizData => {
  const inputBytes = wizData.bytes;

  if (inputBytes.length !== 8) throw 'Input byte length must be equal 8 byte';

  let inputArray = Array.from(wizData.bytes);
  let i = 7;

  while (i >= 0) {
    if (inputArray[i] === 0) {
      inputArray.pop();
      i--;
    } else {
      break;
    }
  }

  const lastElement = WizData.fromNumber(inputArray[inputArray.length - 1]);
  const misingByte = lastElement.bytes.length > 1 ? 1 : 0;

  const inputBN = new BN(wizData.bin, 2);

  const inputBnByteLength = inputBN.byteLength() + misingByte;

  if (wizData.bin.charAt(0) === '1') {
    const binputPos = inputBN.fromTwos(64).abs();

    const inputWizData = WizData.fromBin(binputPos.toString(2, (binputPos.byteLength() + misingByte) * 8));

    if (inputWizData.number) {
      return WizData.fromNumber(inputWizData.number * -1);
    }

    return inputWizData;
  }

  const finalBinValue = inputBN.toString(2, inputBnByteLength * 8);

  if (finalBinValue === '0') {
    return WizData.fromNumber(0);
  }

  return WizData.fromBin(finalBinValue);
};

export const LE32toLE64 = (wizData: WizData): WizData => {
  if (wizData.bytes.length !== 4) throw 'Input byte length must be equal 4 byte';

  return numToLE64(wizData);
};

export const LE32ToNum = (wizData: WizData): WizData => {
  const inputBytes = wizData.bytes;

  if (inputBytes.length !== 4) throw 'Input byte length must be equal 4 byte';

  let inputArray = Array.from(wizData.bytes);
  let i = 3;

  while (i >= 0) {
    if (inputArray[i] === 0) {
      inputArray.pop();
      i--;
    } else {
      break;
    }
  }

  const lastElement = WizData.fromNumber(inputArray[inputArray.length - 1]);
  const misingByte = lastElement.bytes.length > 1 ? 1 : 0;

  const inputBN = new BN(wizData.bin, 2);

  const inputBnByteLength = inputBN.byteLength() + misingByte;

  if (wizData.bin.charAt(0) === '1') {
    const binputPos = inputBN.fromTwos(32).abs();

    const inputWizData = WizData.fromBin(binputPos.toString(2, (binputPos.byteLength() + misingByte) * 4));

    if (inputWizData.number) {
      return WizData.fromNumber(inputWizData.number * -1);
    }

    return inputWizData;
  }

  const finalBinValue = inputBN.toString(2, inputBnByteLength * 4);

  if (finalBinValue === '0') {
    return WizData.fromNumber(0);
  }

  return WizData.fromBin(finalBinValue);
};

// LE64TONum alternative
// export const LE64ToNum = (wizData: WizData): WizData => {
//   const inputBytes = wizData.bytes;

//   if (inputBytes.length !== 8) throw "Input byte length must be equal 8 byte";

//   let result = Array.from(inputBytes);

//   let i = 7;

//   while (i >= 0) {
//     if (inputBytes[i] > 0) {
//       break;
//     }

//     result = result.slice(0, -1);
//     i--;
//   }

//   const finalResult = new Uint8Array(result);

//   return WizData.fromBytes(finalResult);
// };

export const inputConverter = (
  value: string,
  type: 'BE' | 'LE' | 'Decimal',
  byteLength: '4-bytes' | '8-bytes',
): { be: string; le: string; decimal: string } => {
  if (byteLength === '8-bytes') {
    if (type === 'BE') {
      const valueWizData = WizData.fromHex(value);

      //le
      const le = hexLE(valueWizData.hex);

      //decimal
      const leWizData = WizData.fromHex(le);
      const decimal = LE64ToNum(leWizData).number?.toString();

      return { be: value, le, decimal: decimal || '' };
    }

    if (type === 'LE') {
      const valueWizData = WizData.fromHex(value);

      //be
      const be = hexLE(valueWizData.hex);

      //decimal
      const decimal = LE64ToNum(valueWizData).number?.toString();

      return { be, le: value, decimal: decimal || '' };
    }

    if (type === 'Decimal') {
      //decimal
      const sathoshi = Number(value) * 100000000;
      const sathoshiWizData = WizData.fromNumber(sathoshi);

      //le
      const le = numToLE64(sathoshiWizData);

      //be
      const beHex = hexLE(le.hex);

      return { be: beHex, le: le.hex, decimal: value };
    }
  }

  if (byteLength === '4-bytes') {
    if (type === 'BE') {
      const valueWizData = WizData.fromHex(value);

      //le
      const le = hexLE(valueWizData.hex);

      //decimal
      const leWizData = WizData.fromHex(le);
      const decimal = LE32ToNum(leWizData).number?.toString();

      return { be: value, le, decimal: decimal || '' };
    }

    if (type === 'LE') {
      const valueWizData = WizData.fromHex(value);

      //be
      const be = hexLE(valueWizData.hex);

      //decimal
      const decimal = LE32ToNum(valueWizData).number?.toString();

      return { be, le: value, decimal: decimal || '' };
    }

    if (type === 'Decimal') {
      //decimal
      const sathoshiWizData = WizData.fromNumber(Number(value));

      //le
      const le = numToLE32(sathoshiWizData);

      //be
      const beHex = hexLE(le.hex);

      return { be: beHex, le: le.hex, decimal: value };
    }
  }

  return { decimal: '', le: '', be: '' };
};
