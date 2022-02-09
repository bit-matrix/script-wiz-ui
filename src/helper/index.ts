const convertEditorLines = (formattedLines: string): string[] => {
  let lines = formattedLines.split('\n');

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

const deepCopy = <T>(oldObject: T): T => {
  return JSON.parse(JSON.stringify(oldObject)) as T;
};

export { convertEditorLines, deepCopy };
