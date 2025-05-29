/**
 * Utilidades para operaciones con números binarios
 * Todas las funciones trabajan exclusivamente con strings binarios
 */

export const WORD_SIZE = 12;
export const ADDRESS_SIZE = 12;

// Validación de strings binarios
const validateBinary = (binStr) => {
  if (typeof binStr !== 'string') {
    throw new Error(`Se esperaba string binario, se recibió: ${typeof binStr}`);
  }
  if (!/^[01]+$/.test(binStr)) {
    throw new Error(`String no binario: ${binStr}`);
  }
};

// Conversión básica mejorada
export const binaryToDec = (binStr, wordSize = WORD_SIZE) => {
  validateBinary(binStr, wordSize);
  const mask = (1 << wordSize) - 1;
  const result = parseInt(binStr, 2) & mask;
  return result < 1 << (wordSize - 1) ? result : result - (1 << wordSize);
};

export const decToBinary = (num, wordSize = WORD_SIZE) => {
  if (typeof num !== 'number') {
    throw new Error(`Se esperaba número, se recibió: ${typeof num}`);
  }
  const mask = (1 << wordSize) - 1;
  const value = num & mask;
  return value.toString(2).padStart(wordSize, '0');
};

export const decToHex = (num, wordSize = WORD_SIZE) => {
  const hexDigits = Math.ceil(wordSize / 4);
  const mask = (1 << wordSize) - 1;
  return '0x' + (num & mask).toString(16).padStart(hexDigits, '0').toUpperCase();
};

// Versiones seguras de tus funciones originales
export const toBinary = (value, bits = WORD_SIZE) => {
  if (value < 0) {
    // Manejo de números negativos (complemento a 2)
    return (value >>> 0).toString(2).slice(-bits);
  }
  return (value >>> 0).toString(2).padStart(bits, '0');
};

export const fromBinary = (binaryStr) => {
  validateBinary(binaryStr);
  const num = parseInt(binaryStr, 2);
  // Manejo de complemento a 2 para números negativos
  return binaryStr[0] === '1' 
    ? num - (1 << binaryStr.length)
    : num;
};

// Nuevas funciones para operaciones binarias puras
export const binaryAdd = (a, b, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  validateBinary(b, wordSize);
  
  let result = '';
  let carry = 0;
  
  for (let i = wordSize - 1; i >= 0; i--) {
    const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
    result = (sum % 2) + result;
    carry = sum > 1 ? 1 : 0;
  }
  
  // Cálculo de flags (ZSCO)
  const flags = {
    Z: result === '0'.repeat(wordSize) ? '1' : '0',
    S: result[0] === '1' ? '1' : '0',
    C: carry.toString(),
    O: (a[0] === b[0] && result[0] !== a[0]) ? '1' : '0'
  };
  
  return { result, flags };
};

export const binarySubtract = (a, b, wordSize = WORD_SIZE) => {
  // Resta mediante suma del complemento a 2
  const negB = binaryNegate(b, wordSize);
  const { result, flags } = binaryAdd(a, negB, wordSize);
  return { result, flags };
};

export const binaryNegate = (binStr, wordSize = WORD_SIZE) => {
  validateBinary(binStr, wordSize);
  // Complemento a 1 + 1 = complemento a 2
  let inverted = '';
  for (let i = 0; i < wordSize; i++) {
    inverted += binStr[i] === '0' ? '1' : '0';
  }
  const { result } = binaryAdd(inverted, '0'.repeat(wordSize - 1) + '1', wordSize);
  return result;
};

export const binaryAnd = (a, b, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  validateBinary(b, wordSize);
  let result = '';
  for (let i = 0; i < wordSize; i++) {
    result += a[i] === '1' && b[i] === '1' ? '1' : '0';
  }
  return result;
};

export const binaryOr = (a, b, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  validateBinary(b, wordSize);
  let result = '';
  for (let i = 0; i < wordSize; i++) {
    result += a[i] === '1' || b[i] === '1' ? '1' : '0';
  }
  return result;
};

export const binaryXor = (a, b, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  validateBinary(b, wordSize);
  let result = '';
  for (let i = 0; i < wordSize; i++) {
    result += a[i] !== b[i] ? '1' : '0';
  }
  return result;
};

export const binaryNot = (a, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  let result = '';
  for (let i = 0; i < wordSize; i++) {
    result += a[i] === '0' ? '1' : '0';
  }
  return result;
};

// Shift operations
export const binaryShiftLeft = (a, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  const result = a.substring(1) + '0';
  const carry = a[0];
  return { result, carry };
};

export const binaryShiftRight = (a, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  const result = '0' + a.substring(0, wordSize - 1);
  const carry = a[wordSize - 1];
  return { result, carry };
};

// Comparadores binarios
export const binaryIsEqual = (a, b, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  validateBinary(b, wordSize);
  return a === b;
};

export const binaryIsGreater = (a, b, wordSize = WORD_SIZE) => {
  validateBinary(a, wordSize);
  validateBinary(b, wordSize);
  for (let i = 0; i < wordSize; i++) {
    if (a[i] !== b[i]) {
      return a[i] === '1';
    }
  }
  return false;
};