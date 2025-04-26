import { useState } from 'react';
import PropTypes from 'prop-types';

const KeyboardInput = ({ onInput, onProgramSubmit, onSaveToMemory, onMemoryRead }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputMode, setInputMode] = useState('text');
  const [inputHistory, setInputHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    let output;
    let programOutput = null;
    let commandData = null;

    switch (inputMode) {
      case 'number':
        output = `Número ingresado: ${inputValue}`;
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

      default: // text mode - procesar comandos
        if (inputValue.toLowerCase() === 'help') {
          output = `Comandos disponibles:
          - save [dir] [valor]: Guarda valor en memoria (ej: save 5 10101010)
          - mem [dir]: Muestra contenido de memoria
          - reg: Muestra registros
          - run: Ejecuta programa
          - step: Ejecuta paso a paso
          - reset: Reinicia el simulador`;
        } 
        else if (inputValue.startsWith('save ')) {
          const saveMatch = inputValue.match(/^save\s+(\d+)\s+([01]+|\d+|0x[0-9A-Fa-f]+)$/i);
          if (saveMatch) {
            commandData = {
              type: 'save',
              address: saveMatch[1],
              value: saveMatch[2]
            };
            output = `Procesando comando: guardar ${saveMatch[2]} en dirección ${saveMatch[1]}`;
          } else {
            output = `Formato inválido. Use: save [dirección] [valor] (ej: save 5 10101010)`;
          }
        }
        else if (inputValue.startsWith('mem ')) {
          const memMatch = inputValue.match(/^mem\s+(\d+)$/);
          if (memMatch) {
            commandData = {
              type: 'mem',
              address: memMatch[1]
            };
            output = `Solicitando contenido de memoria en dirección ${memMatch[1]}`;
          } else {
            output = `Formato inválido. Use: mem [dirección]`;
          }
        }
        else {
          output = `Entrada recibida: ${inputValue}`;
        }
    }

    // Agregar a historial
    setInputHistory(prev => [
      { 
        input: inputValue, 
        output, 
        timestamp: new Date().toLocaleTimeString(), 
        mode: inputMode 
      },
      ...prev.slice(0, 9) // Mantener máximo 10 elementos en historial
    ]);

    // Procesar comandos especiales
    if (commandData) {
      switch(commandData.type) {
        case 'save':
          if (onSaveToMemory) onSaveToMemory(commandData.address, commandData.value);
          break;
        case 'mem':
          if (onMemoryRead) onMemoryRead(commandData.address);
          break;
      }
    } 
    else if (programOutput && onProgramSubmit) {
      onProgramSubmit(programOutput);
    } 
    else {
      onInput(output);
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
              inputMode === 'text' ? 'Escribe texto o comandos...' :
              inputMode === 'number' ? 'Ingresa número decimal...' :
              inputMode === 'hex' ? 'Ingresa valor hexadecimal (0x...)':
              'Escribe instrucciones...'
            }
          />
        )}
        
        <button type="submit">Enviar</button>
      </form>

      <div className="input-history">
        <h4>Historial:</h4>
        <ul>
          {inputHistory.map((item, index) => (
            <li key={index} className={`history-item ${item.mode}`}>
              <span className="timestamp">{item.timestamp}:</span>
              <span className="input">{item.input}</span>
              {item.output && <div className="output">{item.output}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

KeyboardInput.propTypes = {
  onInput: PropTypes.func.isRequired,
  onProgramSubmit: PropTypes.func,
  onSaveToMemory: PropTypes.func,
  onMemoryRead: PropTypes.func
};

export default KeyboardInput;