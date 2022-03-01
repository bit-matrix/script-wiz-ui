import WizData from '@script-wiz/wiz-data';
import CustomWhisper from '../components/CustomWhisper/CustomWhisper';

export const getWhispers = (stackDataArray: WizData[], lineNumber?: number) =>
  stackDataArray.map((stackData: WizData, index: number) => {
    const key = `whisper-${lineNumber && lineNumber.toString()}-${index.toString()}-text`;
    let displayValue = '0x' + stackData.hex;
    if (stackData.number !== undefined) displayValue = stackData.number.toString();
    else if (stackData.text !== undefined) displayValue = stackData.text;
    return <CustomWhisper key={key} tooltip={stackData.hex} display={displayValue} label={stackData.label} />;
  });
