const convertEditorLines = (formattedLines) => {
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

const getOutputValueType = (value) => {
  if (value.startsWith('0x')) {
    return 'hex';
  }

  if (!isNaN(Number(value))) {
    return 'number';
  }

  return 'string';
};

const deepCopy = (oldObject) => {
  return JSON.parse(JSON.stringify(oldObject));
};

const upsertVM = (newObject, currentArray) => {
  if (currentArray) {
    const currentIndex = currentArray.findIndex((cd) => cd.vm.ver === newObject.vm.ver && cd.vm.network === newObject.vm.network);

    const clonedArray = [...currentArray];

    if (currentIndex > -1) {
      clonedArray[currentIndex] = newObject;
    } else {
      clonedArray.push(newObject);
    }

    return clonedArray;
  }

  return [newObject];
};

const LOCAL_STORAGE_OLD_KEY = 'scriptWizEditorV1';
const LOCAL_STORAGE_KEY = 'scriptWizEditor';

export { convertEditorLines, getOutputValueType, deepCopy, upsertVM, LOCAL_STORAGE_KEY, LOCAL_STORAGE_OLD_KEY };
