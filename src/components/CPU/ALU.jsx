import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { binaryToDec, decToHex } from '../../utils/binaryUtils'; // Utilidades de conversión

const ALU = ({
  operation = 'NOP',
  operandA = '00000000',
  operandB = '00000000',
  flags = {},
  onResult,
  wordSize = 8
}) => {
  const MAX_VALUE = Math.pow(2, wordSize) - 1;

  // Funciones internas de conversión
  const toBinary = (value) => (value >>> 0).toString(2).padStart(wordSize, '0');
  const fromBinary = (binaryStr) => parseInt(binaryStr, 2);

  // Operaciones disponibles
  const operations = {
    ADD: (a, b) => {
      const numA = fromBinary(a); 
      const numB = fromBinary(b);
      const result = numA + numB;

      console.log(`ADD: ${numA} ${operation} ${numB} = ${result}`); // Log para depurar
      // Si el resultado es mayor que el máximo valor, se ajusta al tamaño de palabra
      if (result > MAX_VALUE) {
        console.warn(`Resultado excede el valor máximo (${MAX_VALUE}). Ajustando...`);
      }

      return {
        result: toBinary(result & MAX_VALUE), // Asegurarse de que el resultado esté dentro del rango
        flags: {
          Z: (result & MAX_VALUE) === 0 ? '1' : '0', // Flag de cero
          C: result > MAX_VALUE ? '1' : '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: ((numA & (1 << (wordSize - 1))) === (numB & (1 << (wordSize - 1)))) &&
             ((result & (1 << (wordSize - 1))) !== (numA & (1 << (wordSize - 1)))) ? '1' : '0'
        }
      };
    },
    SUB: (a, b) => {
      const numA = fromBinary(a);
      const numB = fromBinary(b);
      const result = numA - numB;
      console.log(`SUB: ${numA} - ${numB} = ${result}`); // Log para depurar
      return {
        result: toBinary(result & MAX_VALUE),
        flags: {
          Z: (result & MAX_VALUE) === 0 ? '1' : '0',
          C: result < 0 ? '1' : '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: ((numA & (1 << (wordSize - 1))) !== (numB & (1 << (wordSize - 1)))) &&
             ((result & (1 << (wordSize - 1))) !== (numA & (1 << (wordSize - 1)))) ? '1' : '0'
        }
      };
    },
    AND: (a, b) => {
      const result = fromBinary(a) & fromBinary(b);
      console.log(`AND: ${a} & ${b} = ${result}`); // Log para depurar
      return {
        result: toBinary(result),
        flags: {
          Z: result === 0 ? '1' : '0',
          C: '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: '0'
        }
      };
    },
    OR: (a, b) => {
      const result = fromBinary(a) | fromBinary(b);
      console.log(`OR: ${a} | ${b} = ${result}`); // Log para depurar
      return {
        result: toBinary(result),
        flags: {
          Z: result === 0 ? '1' : '0',
          C: '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: '0'
        }
      };
    },
    XOR: (a, b) => {
      const result = fromBinary(a) ^ fromBinary(b);
      console.log(`XOR: ${a} ^ ${b} = ${result}`); // Log para depurar
      return {
        result: toBinary(result),
        flags: {
          Z: result === 0 ? '1' : '0',
          C: '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: '0'
        }
      };
    },
    NOT: (a) => {
      const result = ~fromBinary(a) & MAX_VALUE;
      console.log(`NOT: ~${a} = ${result}`); // Log para depurar
      return {
        result: toBinary(result),
        flags: {
          Z: result === 0 ? '1' : '0',
          C: '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: '0'
        }
      };
    },
    SHL: (a) => {
      const numA = fromBinary(a);
      const result = (numA << 1) & MAX_VALUE;
      console.log(`SHL: ${a} << 1 = ${result}`); // Log para depurar
      return {
        result: toBinary(result),
        flags: {
          Z: result === 0 ? '1' : '0',
          C: (numA & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          S: (result & (1 << (wordSize - 1))) !== 0 ? '1' : '0',
          O: '0'
        }
      };
    },
    SHR: (a) => {
      const numA = fromBinary(a);
      const result = numA >> 1;
      console.log(`SHR: ${a} >> 1 = ${result}`); // Log para depurar
      return {
        result: toBinary(result),
        flags: {
          Z: result === 0 ? '1' : '0',
          C: (numA & 0x1) !== 0 ? '1' : '0',
          S: '0',
          O: '0'
        }
      };
    }
  };
  useEffect(() => {
    if (!operation || !operations[operation]) {
      console.log("Operación inválida o vacía. No se ejecuta nada.");
      return;
    }
  
    console.log(`Ejecutando operación: ${operation} con operandos A: ${operandA}, B: ${operandB}`);
    const { result, flags } = operations[operation](operandA, operandB);
    console.log(`Resultado de la operación: ${result}`);
    console.log(`Flags: ${JSON.stringify(flags)}`);
  
    if (onResult) {
      onResult({ result, flags });
    }
  }, [operation, operandA, operandB, wordSize, onResult]);
  

  const aDec = binaryToDec(operandA, wordSize);
  const bDec = binaryToDec(operandB, wordSize);

  return (
    <div className="alu-component">
      <h3>🔢 ALU ({wordSize}-bits)</h3>

      <div className="alu-inputs">
        <div className="operand">
          <label>Operando A:</label>
          <div className="value binary">{operandA}</div>
          <div className="value decimal">{aDec}</div>
          <div className="value hexadecimal">{decToHex(aDec, wordSize)}</div>
        </div>

        <div className="operation-display">
          <h4>{operation || 'NOP'}</h4>
        </div>

        <div className="operand">
          <label>Operando B:</label>
          <div className="value binary">{operandB}</div>
          <div className="value decimal">{bDec}</div>
          <div className="value hexadecimal">{decToHex(bDec, wordSize)}</div>
        </div>
      </div>

      <div className="alu-operation">
        Operación: {operation || 'NINGUNA'}
      </div>

      <div className="alu-flags">
        <h4>🚩 Flags de Estado</h4>
        <div className="flags-grid">
          {['Z', 'C', 'S', 'O'].map((flag) => (
            <div key={flag} className={`flag ${flags[flag] === '1' ? 'active' : ''}`}>
              <span className="flag-name">{flag}</span>
              <span className="flag-value">{flags[flag] || '0'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="alu-info">
        <p>Operaciones soportadas: ADD, SUB, AND, OR, XOR, NOT, SHL, SHR</p>
      </div>
    </div>
  );
};

ALU.propTypes = {
  operation: PropTypes.string,
  operandA: PropTypes.string,
  operandB: PropTypes.string,
  flags: PropTypes.shape({
    Z: PropTypes.string,
    C: PropTypes.string,
    S: PropTypes.string,
    O: PropTypes.string
  }),
  onResult: PropTypes.func,
  wordSize: PropTypes.number
};

export default ALU;