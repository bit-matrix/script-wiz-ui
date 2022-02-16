import { VM } from '@script-wiz/lib';

const convertEditorLines = (formattedLines: string): string[] => {
  let lines = formattedLines.split('\n');
  lines = lines.map((line) => line.replace(/ /g, ''));

  lines = lines.map((line) => line.replaceAll('\r', ''));

  lines = lines.map((line) => line.replaceAll('\t', ''));

  lines = lines.map((line) => {
    const commentIndex = line.indexOf('//');

    if (commentIndex > -1) {
      return line.substr(0, commentIndex);
    }
    return line;
  });

  return lines;
};

const getOutputValueType = (value: string): string => {
  if (value.startsWith('0x')) {
    return 'hex';
  }

  if (!isNaN(Number(value))) {
    return 'number';
  }

  return 'string';
};

const deepCopy = <T>(oldObject: T): T => {
  return JSON.parse(JSON.stringify(oldObject)) as T;
};

const upsertVM = <T extends { vm: VM }>(currentArray: T[], newObject: T): T[] => {
  const currentIndex = currentArray.findIndex((cd: T) => cd.vm.ver === newObject.vm.ver && cd.vm.network === newObject.vm.network);

  const clonedArray = [...currentArray];

  if (currentIndex > -1) {
    clonedArray[currentIndex] = newObject;
  } else {
    clonedArray.push(newObject);
  }

  return clonedArray;
};

const LOCAL_STORAGE_KEY = 'scriptWizEditorV1';

export { convertEditorLines, getOutputValueType, deepCopy, upsertVM, LOCAL_STORAGE_KEY };
