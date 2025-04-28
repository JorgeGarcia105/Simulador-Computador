import { binaryToDec, decToBinary } from '../utils/binaryUtils';

export const aluOperations = {
  ADD: (a, b, wordSize) => {
    const maxValue = (1 << wordSize) - 1;
    const aDec = binaryToDec(a, wordSize);
    const bDec = binaryToDec(b, wordSize);
    const result = aDec + bDec;
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: (result & maxValue) === 0 ? '1' : '0',
        C: result > maxValue ? '1' : '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: ((aDec & (1 << (wordSize - 1))) === (bDec & (1 << (wordSize - 1)))) &&
           ((result & (1 << (wordSize - 1))) !== (aDec & (1 << (wordSize - 1)))) ? '1' : '0'
      }
    };
  },
  SUB: (a, b, wordSize) => {
    const maxValue = (1 << wordSize) - 1;
    const aDec = binaryToDec(a, wordSize);
    const bDec = binaryToDec(b, wordSize);
    const result = aDec - bDec;
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: (result & maxValue) === 0 ? '1' : '0',
        C: result < 0 ? '1' : '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: ((aDec & (1 << (wordSize - 1))) !== (bDec & (1 << (wordSize - 1)))) &&
           ((result & (1 << (wordSize - 1))) !== (aDec & (1 << (wordSize - 1)))) ? '1' : '0'
      }
    };
  },
  AND: (a, b, wordSize) => {
    const result = binaryToDec(a, wordSize) & binaryToDec(b, wordSize);
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: result === 0 ? '1' : '0',
        C: '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: '0'
      }
    };
  },
  OR: (a, b, wordSize) => {
    const result = binaryToDec(a, wordSize) | binaryToDec(b, wordSize);
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: result === 0 ? '1' : '0',
        C: '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: '0'
      }
    };
  },
  XOR: (a, b, wordSize) => {
    const result = binaryToDec(a, wordSize) ^ binaryToDec(b, wordSize);
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: result === 0 ? '1' : '0',
        C: '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: '0'
      }
    };
  },
  NOT: (a, _, wordSize) => {
    const maxValue = (1 << wordSize) - 1;
    const result = (~binaryToDec(a, wordSize)) & maxValue;
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: result === 0 ? '1' : '0',
        C: '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: '0'
      }
    };
  },
  SHL: (a, _, wordSize) => {
    const maxValue = (1 << wordSize) - 1;
    const result = (binaryToDec(a, wordSize) << 1) & maxValue;
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: result === 0 ? '1' : '0',
        C: (binaryToDec(a, wordSize) & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: '0'
      }
    };
  },
  SHR: (a, _, wordSize) => {
    const result = binaryToDec(a, wordSize) >> 1;
    return {
      result: decToBinary(result, wordSize),
      flags: {
        Z: result === 0 ? '1' : '0',
        C: (binaryToDec(a, wordSize) & 1) !== 0 ? '1' : '0',
        S: '0',
        O: '0'
      }
    };
  },
  CMP: (a, b, wordSize) => {
    const maxValue = (1 << wordSize) - 1;
    const aDec = binaryToDec(a, wordSize);
    const bDec = binaryToDec(b, wordSize);
    const result = aDec - bDec;
    return {
      result: a,
      flags: {
        Z: (aDec === bDec) ? '1' : '0',
        C: aDec < bDec ? '1' : '0',
        S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
        O: ((aDec & (1 << (wordSize - 1))) !== (bDec & (1 << (wordSize - 1)))) &&
           ((result & (1 << (wordSize - 1))) !== (aDec & (1 << (wordSize - 1)))) ? '1' : '0'
      }
    };
  }
};
