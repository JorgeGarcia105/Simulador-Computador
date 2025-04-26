import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ALU = ({ operation, operandA, operandB, flags, onResult }) => {
  // Funciones de conversión (deberían estar en un archivo de utilidades)
  const toBinary = (value, bits = 8) => (value >>> 0).toString(2).padStart(bits, '0');
  const fromBinary = (binaryStr) => parseInt(binaryStr, 2);

  // Operaciones ALU
  const operations = {
    ADD: (a, b) => {
      const numA = fromBinary(a);
      const numB = fromBinary(b);
      const result = numA + numB;
      return {
        result: toBinary(result & 0xFF),
        flags: {
          Z: (result & 0xFF) === 0 ? '1' : '0',
          C: result > 255 ? '1' : '0',
          S: (result & 0x80) !== 0 ? '1' : '0',
          O: ((numA & 0x80) === (numB & 0x80)) && ((result & 0x80) !== (numA & 0x80)) ? '1' : '0'
        }
      };
    },
    // ... otras operaciones (similar al ejemplo anterior)
  };

  // Calcular resultado cuando cambian los props
  useEffect(() => {
    if (operation && operations[operation]) {
      const result = operations[operation](operandA, operandB);
      onResult(result);
    }
  }, [operation, operandA, operandB]);

  return (
    <div className="alu">
      <h3>Unidad Aritmético-Lógica (ALU)</h3>
      
      <div className="alu-inputs">
        <div>Operando A: {operandA} (0x{fromBinary(operandA).toString(16).toUpperCase()})</div>
        <div>Operando B: {operandB} (0x{fromBinary(operandB).toString(16).toUpperCase()})</div>
      </div>
      
      <div className="alu-operation">
        Operación: {operation || 'Ninguna'}
      </div>
      
      <div className="alu-flags">
        <h4>Flags:</h4>
        <div>Zero (Z): {flags?.Z || '0'}</div>
        <div>Carry (C): {flags?.C || '0'}</div>
        <div>Sign (S): {flags?.S || '0'}</div>
        <div>Overflow (O): {flags?.O || '0'}</div>
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
  onResult: PropTypes.func.isRequired
};

export default ALU;