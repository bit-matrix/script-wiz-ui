import WizData from '@script-wiz/wiz-data';

export const lineCompile = (input) => {
  // HEX DATA INPUT
  if (input.startsWith('0x')) {
    const newInput = input.substr(2, input.length);
    return WizData.fromHex(newInput);
  }

  if ((input.startsWith('"') && input.endsWith('"')) || (input.startsWith("'") && input.endsWith("'"))) {
    const formattedInput = input.substr(1, input.length - 2);
    return WizData.fromText(formattedInput);
  }

  // NUMBER INPUT
  if (!isNaN(input)) {
    return WizData.fromNumber(Number(input));
  }

  // eslint-disable-next-line no-throw-literal
  throw 'Compile Final Input Error: it is not a valid final input string!';
};
