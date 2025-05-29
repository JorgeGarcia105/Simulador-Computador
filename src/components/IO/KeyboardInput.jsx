import { useState } from 'react';
import PropTypes from 'prop-types';

const KeyboardInput = ({ onInput, onProgramLoad }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('command'); // 'command' o 'program'
  const [history, setHistory] = useState([]);

  // Convierte instrucciones ensamblador a binario
  const assemblyToBinary = (instruction) => {
    const parts = instruction.toUpperCase().split(/\s+/);
    const op = parts[0];
    const operand = parts[1] || '0';

    const opcodes = {
      'LOAD': '0001',
      'STORE': '0010',
      'ADD': '0011',
      'SUB': '0100',
      'JMP': '0101',
      'JZ': '0110',
      'HLT': '1111'
    };

    const opcode = opcodes[op] || '0000';
    const operandBinary = parseInt(operand, 10).toString(2).padStart(4, '0');
    return opcode + operandBinary;
  };

  // Maneja el envío de instrucciones
  const handleSubmit = () => {
    if (!input.trim()) return;

    let output;
    let binaryData;

    if (mode === 'program') {
      const instructions = input.split('\n').filter(line => line.trim());
      const binaryProgram = instructions.map(assemblyToBinary);
      onProgramLoad(binaryProgram); // Enviar el programa a la ROM
      output = `Programa cargado (${instructions.length} instrucciones)`;
    } else {
      if (input.startsWith('0b')) {
        binaryData = input.slice(2);
      } else if (/^[0-9A-F]+$/.test(input)) {
        binaryData = parseInt(input, 16).toString(2).padStart(8, '0');
      } else if (input === 'run') {
        onInput('execute');
        output = 'Ejecutando programa...';
      } else if (input.startsWith('mem ')) {
        const address = parseInt(input.split(' ')[1], 10);
        onInput(`mem ${address}`);
        return;
      } else {
        binaryData = assemblyToBinary(input);
      }

      if (binaryData) {
        onInput(binaryData); // Envía la instrucción a la CPU
        output = `Instrucción: ${binaryData}`;
      }
    }

    // Actualiza el historial de comandos
    setHistory(prev => [
      { input, output, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9)
    ]);
    setInput('');
  };

  return (
    <div className="keyboard-component">
      <h3>Teclado del Computador</h3>
      <div className="mode-selector">
        <button 
          className={mode === 'command' ? 'active' : ''} 
          onClick={() => setMode('command')}
        >
          Comandos
        </button>
        <button 
          className={mode === 'program' ? 'active' : ''} 
          onClick={() => setMode('program')}
        >
          Cargar Programa
        </button>
      </div>
      
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'command' ? 'Introduce una instrucción...' : 'Introduce instrucciones del programa...'}
        rows={6}
      />
      <button onClick={handleSubmit}>Enviar</button>
      
      <div className="history">
        {history.map((item, index) => (
          <div key={index} className="history-item">
            <p>{item.timestamp}: <strong>{item.input}</strong> - {item.output}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

KeyboardInput.propTypes = {
  onInput: PropTypes.func.isRequired,
  onProgramLoad: PropTypes.func.isRequired
};

export default KeyboardInput;
