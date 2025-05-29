import React, { useState } from 'react';
import ROM from './ROM';
import RAM from './RAM';

const App = () => {
  // Configuración de memoria
  const ROM_SIZE = 256;
  const RAM_SIZE = 4096;
  const CODE_START = 0x800;

  // Set de instrucciones (opcode de 4 bits)
  const instructionSet = {
    '0001': { name: 'LOAD', description: 'Load from memory' },
    '0010': { name: 'STORE', description: 'Store to memory' },
    '0011': { name: 'ADD', description: 'Add to ACC' },
    '0100': { name: 'SUB', description: 'Subtract from ACC' },
    '0101': { name: 'JMP', description: 'Jump to address' },
    '0110': { name: 'JZ', description: 'Jump if zero' },
    '1111': { name: 'HLT', description: 'Halt execution' }
  };

  // Estado inicial con programa de ejemplo en ROM
  const [rom] = useState(
    Array(ROM_SIZE).fill(0).map((_, i) => {
      if (i === 0) return 0b0001000000000000; // LOAD 0x00
      if (i === 1) return 0b0011000000000001; // ADD 0x01
      if (i === 2) return 0b0010000000000010; // STORE 0x02
      if (i === 3) return 0b1111000000000000; // HLT
      return 0;
    })
  );

  // Estado de RAM (inicializada a ceros)
  const [ram, setRam] = useState(
    Array(RAM_SIZE).fill('00000000').map((val, addr) => {
      if (addr === 0x00) return '00001111'; // 15 en decimal
      if (addr === 0x01) return '00000001'; // 1 en decimal
      return val;
    })
  );

  // Estado de ejecución
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSpeed, setExecutionSpeed] = useState(1000);

  // Cargar programa de ROM a RAM
  const loadProgram = () => {
    const newRam = [...ram];
    
    // Convertir palabras de 16 bits a 2 bytes de 8 bits
    rom.slice(0, 4).forEach((word, i) => {
      const byte1 = (word >> 8).toString(2).padStart(8, '0');
      const byte2 = (word & 0xFF).toString(2).padStart(8, '0');
      
      newRam[CODE_START + i*2] = byte1;
      newRam[CODE_START + i*2 + 1] = byte2;
    });
    
    setRam(newRam);
    setCurrentAddress(CODE_START);
  };

  // Simular ejecución paso a paso
  const executeStep = () => {
    if (!currentAddress || currentAddress >= CODE_START + 8) {
      setIsExecuting(false);
      return;
    }

    const nextAddress = currentAddress + 1;
    setCurrentAddress(nextAddress);

    // Simular efecto de ejecución (ejemplo)
    if (currentAddress === CODE_START) {
      // Efecto de LOAD
      setTimeout(() => {
        setCurrentAddress(0x00);
        setTimeout(() => setCurrentAddress(CODE_START + 1), executionSpeed/2);
      }, executionSpeed/2);
    }
  };

  // Ejecutar/Detener programa
  const toggleExecution = () => {
    if (isExecuting) {
      setIsExecuting(false);
    } else {
      setIsExecuting(true);
      loadProgram();
    }
  };

  // Efecto para la ejecución automática
  React.useEffect(() => {
    let timer;
    if (isExecuting) {
      timer = setInterval(executeStep, executionSpeed);
    }
    return () => clearInterval(timer);
  }, [isExecuting, currentAddress]);

  return (
    <div className="app-container">
      <h1>Simulador de CPU - Memoria ROM/RAM</h1>
      
      <div className="control-panel">
        <button 
          onClick={toggleExecution}
          className={isExecuting ? 'stop-button' : 'start-button'}
        >
          {isExecuting ? 'Detener Ejecución' : 'Iniciar Programa'}
        </button>
        
        <div className="speed-control">
          <label>Velocidad:</label>
          <select
            value={executionSpeed}
            onChange={(e) => setExecutionSpeed(Number(e.target.value))}
            disabled={isExecuting}
          >
            <option value={2000}>Lenta (2s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={500}>Rápida (0.5s)</option>
          </select>
        </div>
      </div>

      <div className="memory-system">
        <div className="rom-panel">
          <h2>Memoria ROM (Programa)</h2>
          <ROM 
            memory={rom}
            wordSize={16}
            currentAddress={null}
            instructionSet={instructionSet}
          />
          <button 
            onClick={loadProgram}
            disabled={isExecuting}
            className="load-button"
          >
            Cargar en RAM
          </button>
        </div>

        <div className="ram-panel">
          <h2>Memoria RAM (Ejecución)</h2>
          <RAM 
            memory={ram}
            currentAddress={currentAddress}
            onMemoryChange={(addr, val) => {
              const newRam = [...ram];
              newRam[addr] = val.padStart(8, '0');
              setRam(newRam);
            }}
            wordSize={8}
            isExecuting={isExecuting}
          />
        </div>
      </div>

      <div className="cpu-status">
        <h3>Estado de la CPU</h3>
        <div>PC: 0x{currentAddress?.toString(16).padStart(3, '0') || '---'}</div>
        <div>Última instrucción: {
          currentAddress ? ram[currentAddress] || '----' : '----'
        }</div>
      </div>
    </div>
  );
};

export default App;