import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './RAMViewer.css';

// Opcodes de ejemplo, ajusta según tu InstructionSet real
const OPCODES = {
  LOAD: '0001',
  STORE: '0010',
  ADD: '0011',
  SUB: '0100',
  JMP: '0101',
  NOP: '0000',
  HLT: '1111',
  // ...agrega los que uses
};

function toBin(num, bits) {
  return Number(num).toString(2).padStart(bits, '0');
}

const ROM = ({
  memory = [], // ROM inicial de initialState.js
  onProgramLoad, // función para cargar el programa en la ROM real
}) => {
  const [input, setInput] = useState('');

  // Traduce instrucciones tipo LOAD 2 a binario
  const parseToBinary = (line) => {
    const [inst, arg] = line.trim().split(/\s+/);
    const opcode = OPCODES[inst?.toUpperCase()] || '0000';
    const operand = arg !== undefined ? toBin(arg, 12) : '000000000000';
    return opcode + operand;
  };

  // Procesa el texto del usuario
  const lines = input.split('\n').filter(Boolean);
  const binProgram = lines.map(parseToBinary);

  // Al hacer click en "Cargar programa", reemplaza la ROM real
  const handleLoad = () => {
    if (onProgramLoad) onProgramLoad(binProgram);
  };

  return (
    <div className="rom-component">
      {/* ROM inicial solo referencia */}
      <div className="rom-header">
        <h3>Contenido Actual de la ROM</h3>
      </div>
      <div className="memory-grid" style={{ marginBottom: 24 }}>
        {memory.map((bin, i) => (
          <div key={i} className="memory-cell">
            <div className="address">{i.toString().padStart(3, '0')}:</div>
            <div className="value">{bin}</div>
          </div>
        ))}
      </div>

      {/* Editor de programa */}
      <div className="rom-header">
        <h3>Editor de Programa (ROM)</h3>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={8}
        style={{ width: '100%', fontFamily: 'monospace', fontSize: 16, marginBottom: 12 }}
        placeholder="Ejemplo:\nLOAD 2\nADD 4\nSTORE 5\nHLT"
      />
      <button onClick={handleLoad}>
        Cargar programa
      </button>
      <div className="memory-grid">
        {binProgram.map((bin, i) => (
          <div key={i} className="memory-cell">
            <div className="address">{i.toString().padStart(3, '0')}:</div>
            <div className="value">{bin}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

ROM.propTypes = {
  memory: PropTypes.array,
  wordSize: PropTypes.number,
  onProgramLoad: PropTypes.func,
};

export default ROM;