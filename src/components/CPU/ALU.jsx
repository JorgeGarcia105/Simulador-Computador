import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  binaryToDec, 
  binaryAdd,
  binarySubtract,
  binaryAnd,
  binaryOr,
  binaryXor,
  binaryNot,
  binaryShiftLeft,
  binaryShiftRight
} from '../../utils/binaryUtils';
import './cpu.css';

const ALU = ({
  operation = 'NOP',
  operandA = '00000000',
  operandB = '00000000',
  flags = {},
  onResult,
  wordSize = 12
}) => {
  // Operaciones disponibles (puramente binarias)
  const operations = {
    ADD: (a, b) => {
      const { result, flags } = binaryAdd(a, b, wordSize);
      return { result, flags };
    },
    SUB: (a, b) => {
      const { result, flags } = binarySubtract(a, b, wordSize);
      return { result, flags };
    },
    AND: (a, b) => {
      const result = binaryAnd(a, b, wordSize);
      return { 
        result,
        flags: {
          Z: result === '0'.repeat(wordSize) ? '1' : '0',
          C: '0',
          S: result[0] === '1' ? '1' : '0',
          O: '0'
        }
      };
    },
    OR: (a, b) => {
      const result = binaryOr(a, b, wordSize);
      return { 
        result,
        flags: {
          Z: result === '0'.repeat(wordSize) ? '1' : '0',
          C: '0',
          S: result[0] === '1' ? '1' : '0',
          O: '0'
        }
      };
    },
    XOR: (a, b) => {
      const result = binaryXor(a, b, wordSize);
      return { 
        result,
        flags: {
          Z: result === '0'.repeat(wordSize) ? '1' : '0',
          C: '0',
          S: result[0] === '1' ? '1' : '0',
          O: '0'
        }
      };
    },
    NOT: (a) => {
      const result = binaryNot(a, wordSize);
      return { 
        result,
        flags: {
          Z: result === '0'.repeat(wordSize) ? '1' : '0',
          C: '0',
          S: result[0] === '1' ? '1' : '0',
          O: '0'
        }
      };
    },
    SHL: (a) => {
      const { result, carry } = binaryShiftLeft(a, wordSize);
      return { 
        result,
        flags: {
          Z: result === '0'.repeat(wordSize) ? '1' : '0',
          C: carry,
          S: result[0] === '1' ? '1' : '0',
          O: '0'
        }
      };
    },
    SHR: (a) => {
      const { result, carry } = binaryShiftRight(a, wordSize);
      return { 
        result,
        flags: {
          Z: result === '0'.repeat(wordSize) ? '1' : '0',
          C: carry,
          S: '0', // Right shift can't produce negative numbers
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
    
    let result;
    try {
      result = operations[operation](
        operandA, 
        operation === 'NOT' || operation === 'SHL' || operation === 'SHR' ? null : operandB
      );
    } catch (error) {
      console.error(`Error en ALU: ${error.message}`);
      return;
    }
    
    console.log(`Resultado de la operación: ${result.result}`);
    console.log(`Flags: ${JSON.stringify(result.flags)}`);
  
    if (onResult) {
      onResult(result);
    }
  }, [operation, operandA, operandB, wordSize, onResult]);

  // Display values (converted only for display purposes)
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
        </div>

        <div className="operation-display">
          <h4>{operation || 'NOP'}</h4>
        </div>

        {operation !== 'NOT' && operation !== 'SHL' && operation !== 'SHR' && (
          <div className="operand">
            <label>Operando B:</label>
            <div className="value binary">{operandB}</div>
            <div className="value decimal">{bDec}</div>
          </div>
        )}
      </div>

      <div>
        <strong>Operación:</strong> {operation || 'Ninguna'}
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
      
      {/* Explicación de los flags 
      /*
      ==========================
      EXPLICACIÓN DE LOS FLAGS
      ==========================
      Los "flags" son indicadores que la ALU activa automáticamente después de cada operación para informar sobre el resultado. Son útiles para tomar decisiones en el flujo del programa (por ejemplo, saltar si el resultado es cero o negativo).

      - Z (Zero): Se activa (1) si el resultado es cero. Sirve para saber si una operación produjo un resultado nulo.
      - C (Carry): Se activa si hubo acarreo (overflow) en suma/resta o si se desplazó un bit fuera en SHL/SHR.
      - S (Sign): Se activa si el resultado es negativo (en complemento a dos, es decir, si el bit más significativo es 1).
      - O (Overflow): Se activa si hubo desbordamiento aritmético (por ejemplo, suma de dos positivos da negativo).

      ¿Por qué existen?
      Los flags permiten que el procesador tome decisiones automáticas tras una operación, como saltar a otra instrucción si el resultado fue cero, negativo o hubo acarreo.

      ¿Cuándo se activan?
      Se actualizan automáticamente después de cada operación aritmética o lógica, según el resultado obtenido.
      ==========================
      <div className="alu-flags-explanation" style={{marginTop: 16, fontSize: '0.95em', background: '#f8f8f8', padding: 12, borderRadius: 8}}>
        <h4>¿Qué son los flags?</h4>
        <p>
          Los <strong>flags</strong> son indicadores que la ALU activa automáticamente después de cada operación para informar sobre el resultado. Son útiles para tomar decisiones en el flujo del programa (por ejemplo, saltar si el resultado es cero o negativo).
        </p>
        <ul>
          <li><strong>Z (Zero):</strong> Se activa (<b>1</b>) si el resultado es <b>cero</b>. Sirve para saber si una operación produjo un resultado nulo.</li>
          <li><strong>C (Carry):</strong> Se activa si hubo <b>acarreo</b> (overflow) en suma/resta o si se desplazó un bit fuera en SHL/SHR.</li>
          <li><strong>S (Sign):</strong> Se activa si el resultado es <b>negativo</b> (en complemento a dos, es decir, si el bit más significativo es 1).</li>
          <li><strong>O (Overflow):</strong> Se activa si hubo <b>desbordamiento aritmético</b> (por ejemplo, suma de dos positivos da negativo).</li>
        </ul>
        <p>
          <b>¿Por qué existen?</b> Los flags permiten que el procesador tome decisiones automáticas tras una operación, como saltar a otra instrucción si el resultado fue cero, negativo o hubo acarreo.
        </p>
        <p>
          <b>¿Cuándo se activan?</b> Se actualizan automáticamente después de cada operación aritmética o lógica, según el resultado obtenido.
        </p>
      </div>
      ==========================
      */}
      

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