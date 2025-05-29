import { toBinary, fromBinary } from '../utils/binaryUtils';

const WORD_SIZE = 8; // 8 bits para palabras
const ADDRESS_SIZE = 8; // 8 bits para direcciones (256 posiciones)

// Función para actualizar la memoria RAM
export const updateMemory = (systemState, setSystemState, address, value) => {
  const newRam = [...systemState.memory.ram];
  newRam[address] = value; // Actualiza el valor en la dirección indicada
  setSystemState(prev => ({
    ...prev,
    memory: {
      ...prev.memory,
      ram: newRam
    }
  }));
  // Guardar la memoria actualizada en localStorage
  localStorage.setItem('simulator_ram_data', JSON.stringify(newRam));
};

// Función para guardar un valor en la memoria RAM
export const handleSaveToMemory = (systemState, setSystemState, addressStr, valueStr) => {
  try {
    const address = parseInt(addressStr, 10); // Dirección de memoria
    if (isNaN(address)) {
        throw new Error('Dirección inválida. Debe ser un número entero.');
      }
    if (address < 0 || address >= 2**ADDRESS_SIZE) { // Rango de direcciones
      throw new Error(`Dirección inválida. Rango permitido: 0-${2**ADDRESS_SIZE-1}`);
    }

    let binaryValue; // Valor a guardar en memoria
      // Validar el valor ingresado (binario, hexadecimal o decimal)
      // Acepta binario (0b), hexadecimal (0x) o decimal
      if (/^[01]+$/.test(valueStr)) { // Binario
        // Asegurarse de que el valor binario tenga el formato correcto
        binaryValue = '0b' + valueStr.padStart(WORD_SIZE, '0');
      } 
      else if (/^0x[0-9a-fA-F]+$/.test(valueStr)) { // Hexadecimal
        const num = parseInt(valueStr, 16);
        if (num < 0 || num >= 2**WORD_SIZE) {
          throw new Error(`Valor hexadecimal debe estar entre 0x0-0x${(2**WORD_SIZE-1).toString(16)}`);
        }
        binaryValue = toBinary(num, WORD_SIZE);
      }
      else { // Decimal
        const num = parseInt(valueStr, 10);
        if (!Number.isInteger(num)) {  // Verificar si el número es entero
          throw new Error(`El valor decimal debe ser un número entero.`);
        }
        if (num < 0 || num >= 2**WORD_SIZE) {
          throw new Error(`Valor decimal debe estar entre 0-${2**WORD_SIZE-1}`);
        }
        binaryValue = toBinary(num, WORD_SIZE);
    }

    updateMemory(toBinary(address, ADDRESS_SIZE), binaryValue);
    return `Dato guardado: Dir. ${address} = ${binaryValue} (${fromBinary(binaryValue)})`;
    
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

// Función para leer un valor desde la memoria RAM
export const handleMemoryRead = (systemState, addressStr) => {
  const address = parseInt(addressStr, 10);
  if (address >= 0 && address < systemState.memory.ram.length) {
    const value = systemState.memory.ram[address];
    return `Memoria [${address}]: ${value} (${fromBinary(value)} decimal)`;
  } else {
    return `Error: Dirección ${address} fuera de rango`;
  }
};
