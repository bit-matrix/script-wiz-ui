const validByte = (byte: number): boolean => 0 <= byte && byte <= 255;
const validBin = (bin: string): boolean => !/[^01]/u.test(bin) && bin.length % 8 === 0;
const validHex = (hex: string) => hex.length % 2 === 0 && !/[^a-fA-F0-9]/u.test(hex);
const validNumber = (number: number): boolean => !isNaN(number);
const validBytes = (bytes: number[]) => bytes.every(validByte) && bytes.every(validNumber);

export { validByte, validBin, validHex, validNumber, validBytes };
