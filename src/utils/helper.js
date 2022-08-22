const validByte = (byte) => 0 <= byte && byte <= 255;
const validBin = (bin) => !/[^01]/u.test(bin) && bin.length % 8 === 0;
const validHex = (hex) => hex.length % 2 === 0 && !/[^a-fA-F0-9]/u.test(hex);
const validNumber = (number) => !isNaN(number);
const validBytes = (bytes) => bytes.every(validByte) && bytes.every(validNumber);
const reverseHex = (value) => Buffer.from(value, 'hex').reverse().toString('hex');
const convertBase64 = (hexValue) => Buffer.from(hexValue, 'hex').toString('base64');

export { validByte, validBin, validHex, validNumber, validBytes, reverseHex, convertBase64 };
