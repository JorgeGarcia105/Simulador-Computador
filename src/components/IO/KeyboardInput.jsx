import { useState } from 'react';
import PropTypes from 'prop-types';

const KeyboardInput = ({ onInput, onProgramSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text', 'number', 'hex', 'program'
  const [inputHistory, setInputHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    let output;
    let programOutput = null;

    switch (inputMode) {
      case 'number':
        if (!isNaN(inputValue)) {
          output = `Número ingresado: ${inputValue} (Decimal)`;
        } else {
          output = `Entrada inválida: ${inputValue} no es un número`;
        }
        break;

      case 'hex':
        if (/^0x[0-9A-Fa-f]+$/.test(inputValue)) {
          const decimalValue = parseInt(inputValue, 16);
          output = `Hexadecimal ${inputValue} = Decimal ${decimalValue}`;
        } else {
          output = `Formato hexadecimal inválido. Use 0x seguido de dígitos (0-9, A-F)`;
        }
        break;

      case 'program': {
        const instructions = inputValue.split('\n').filter(line => line.trim());
        if (instructions.every(validateInstruction)) {
          output = `Programa recibido (${instructions.length} instrucciones)`;
          programOutput = instructions;
        } else {
          output = `Error en el programa. Instrucciones válidas: LOAD, ADD, SUB, STORE, JMP, JZ, HLT`;
        }
        break;
      }

      default: // text
        output = `Entrada recibida: ${inputValue}`;
    }

    // Agregar a historial
    setInputHistory(prev => [
      { input: inputValue, output, timestamp: new Date(), mode: inputMode },
      ...prev.slice(0, 9) // Mantener solo 10 elementos
    ]);

    // Enviar salida
    onInput(output);
    
    // Si es un programa válido, enviarlo al simulador
    if (programOutput && onProgramSubmit) {
      onProgramSubmit(programOutput);
    }

    setInputValue('');
  };

  const validateInstruction = (line) => {
    const parts = line.trim().split(/\s+/);
    const op = parts[0].toUpperCase();
    const validOps = ['LOAD', 'ADD', 'SUB', 'STORE', 'JMP', 'JZ', 'HLT'];
    
    if (!validOps.includes(op)) return false;
    
    // Validar operandos según la instrucción
    switch(op) {
      case 'HLT':
        return parts.length === 1;
      default:
        return parts.length === 2 && 
               (parts[1].startsWith('0x') ? /^0x[0-9A-Fa-f]+$/.test(parts[1]) : !isNaN(parts[1]));
    }
  };

  const handleModeChange = (mode) => {
    setInputMode(mode);
    setInputValue('');
  };

  return (
    <div className="keyboard-component">
      <h3>Entrada por Teclado</h3>
      
      <div className="mode-selector">
        <button 
          className={inputMode === 'text' ? 'active' : ''}
          onClick={() => handleModeChange('text')}
        >
          Texto
        </button>
        <button 
          className={inputMode === 'number' ? 'active' : ''}
          onClick={() => handleModeChange('number')}
        >
          Número
        </button>
        <button 
          className={inputMode === 'hex' ? 'active' : ''}
          onClick={() => handleModeChange('hex')}
        >
          Hexadecimal
        </button>
        <button 
          className={inputMode === 'program' ? 'active' : ''}
          onClick={() => handleModeChange('program')}
        >
          Programa
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {inputMode === 'program' ? (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ejemplo:\nLOAD 0x01\nADD 0x02\nSTORE 0x03\nHLT`}
            rows={5}
          />
        ) : (
          <input
            type={inputMode === 'number' ? 'number' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              inputMode === 'text' ? 'Escribe texto...' :
              inputMode === 'number' ? 'Ingresa número decimal...' :
              inputMode === 'hex' ? 'Ingresa valor hexadecimal (0x...)':
              'Escribe instrucciones...'
            }
          />
        )}
        
        <button type="submit">Enviar</button>
      </form>

      {inputHistory.length > 0 && (
        <div className="input-history">
          <h4>Historial:</h4>
          <ul>
            {inputHistory.map((item, index) => (
              <li key={index} className={`history-item ${item.mode}`}>
                <span className="timestamp">
                  {item.timestamp.toLocaleTimeString()}:
                </span>
                <span className="input">{item.input}</span>
                <span className="output">{item.output}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

KeyboardInput.propTypes = {
  onInput: PropTypes.func.isRequired,
  onProgramSubmit: PropTypes.func
};

export default KeyboardInput;