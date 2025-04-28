import { useState } from 'react';
import PropTypes from 'prop-types';

const ROM = ({ 
  memory = [], 
  wordSize = 16,  // Cambiado a 16 bits para instrucciones
  currentAddress = null,
  instructionSet = {} 
}) => {
  const [viewMode, setViewMode] = useState('hex');

  // Decodificador de instrucciones
  const decodeInstruction = (value) => {
    const num = typeof value === 'string' ? parseInt(value, 2) : value;
    const binary = num.toString(2).padStart(wordSize, '0');
    const opcode = binary.slice(0, 4);
    const operand = binary.slice(4);
    
    return {
      opcode,
      operand,
      instruction: instructionSet[opcode] || 'UNKNOWN',
      address: parseInt(operand, 2)
    };
  };

  // Formatear valor con decodificación de instrucciones
  const formatValue = (value) => {
    const decoded = decodeInstruction(value);
    
    switch(viewMode) {
      case 'bin':
        return (
          <div>
            <div>{decoded.opcode} {decoded.operand}</div>
            <div className="instruction-info">
              {decoded.instruction.name}: {decoded.instruction.description}
            </div>
          </div>
        );
      case 'hex':
        return `0x${parseInt(value, 2).toString(16).padStart(4, '0').toUpperCase()}`;
      case 'instruction':
        return `${decoded.instruction.name} [${decoded.address}]`;
      default:
        return parseInt(value, 2);
    }
  };

  return (
    <div className="rom-component">
      <div className="rom-header">
        <h3>Memoria ROM ({wordSize}-bits/word)</h3>
        <div className="view-mode-selector">
          <button onClick={() => setViewMode('hex')}>HEX</button>
          <button onClick={() => setViewMode('bin')}>BIN</button>
          <button onClick={() => setViewMode('instruction')}>INST</button>
        </div>
      </div>

      <div className="memory-grid">
        {memory.map((value, address) => (
          <div 
            key={address}
            className={`memory-cell ${address === currentAddress ? 'active' : ''}`}
          >
            <div className="address">0x{address.toString(16).padStart(4, '0')}</div>
            <div className="value">
              {formatValue(value, address)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ROM.propTypes = {
  memory: PropTypes.array.isRequired,
  wordSize: PropTypes.number,
  currentAddress: PropTypes.number,
  instructionSet: PropTypes.object.isRequired
};

export default ROM;