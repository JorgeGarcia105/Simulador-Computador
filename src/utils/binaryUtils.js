export const binaryToDec = (binStr, wordSize = 8) => {
    const mask = (1 << wordSize) - 1;
    return parseInt(binStr, 2) & mask;
  };
  
  export const decToBinary = (num, wordSize = 8) => {
    const mask = (1 << wordSize) - 1;
    return (num & mask).toString(2).padStart(wordSize, '0');
  };
  
  export const decToHex = (num, wordSize = 8) => {
    const mask = (1 << wordSize) - 1;
    return '0x' + (num & mask).toString(16).padStart(wordSize / 4, '0').toUpperCase();
  };
  