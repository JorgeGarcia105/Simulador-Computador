import { useState, useEffect } from 'react';
import CPU from './components/CPU/CPU';
import RAM from './components/Memory/RAM';
import ROM from './components/Memory/ROM';
import DataBus from './components/BusSystem/DataBus';
import AddressBus from './components/BusSystem/AddressBus';
import ControlBus from './components/BusSystem/ControlBus';
import KeyboardInput from './components/IO/KeyboardInput';
import ScreenOutput from './components/IO/ScreenOutput';
import DiskDrive from './components/Disk/DiskDrive';
import InstructionSet from './components/InstructionSet';
import './styles/global.css';

function App() {
  const [systemState, setSystemState] = useState({
    cpu: {
      registers: {
        PC: 0,
        IR: 0,
        ACC: 0,
        MAR: 0,
        MBR: 0,
        FLAGS: 0
      },
      alu: {
        operation: null,
        result: 0
      }
    },
    memory: {
      ram: Array(256).fill(0),
      rom: [
        'LOAD 0x02',
        'ADD 0x03',
        'STORE 0x04',
        'HLT',
        ...Array(252).fill(0)
      ]      
    },
    buses: {
      data: null,
      address: null,
      control: null
    },
    io: {
      input: '',
      output: {
        text: 'Bienvenido al simulador de computador. Escribe "help" para ver comandos disponibles.',
        program: null,
        memoryDump: null,
        lastCommand: null
      }
    },
    disk: Array(1024).fill(0),
    running: false,
    speed: 5,
    currentStep: 'fetch'
  });

  // Función para actualizar memoria RAM
  const updateMemory = (address, value) => {
    const newRam = [...systemState.memory.ram];
    newRam[address] = value;
    setSystemState(prev => ({
      ...prev,
      memory: {
        ...prev.memory,
        ram: newRam
      }
    }));
  };

  // Función para manejar entrada del teclado
  const handleInput = (input) => {
    if (input.toLowerCase() === 'help') {
      handleOutput('text', 
        `Comandos disponibles:
        - mem [inicio] [fin]: Muestra memoria
        - reg: Muestra registros
        - run: Ejecuta programa
        - step: Paso a paso
        - reset: Reinicia simulador
        - clear: Limpia pantalla`);
      return;
    }
    
    setSystemState(prev => ({
      ...prev,
      io: {
        ...prev.io,
        input,
        output: {
          ...prev.io.output,
          text: `Entrada recibida: ${input}`
        }
      }
    }));
  };

  // Función para manejar salida a pantalla
  const handleOutput = (type, content) => {
    setSystemState(prev => {
      const newOutput = {...prev.io.output};
      
      switch(type) {
        case 'text':
          newOutput.text = content;
          newOutput.lastCommand = {type: 'text', content};
          break;
        case 'program':
          newOutput.program = content;
          newOutput.lastCommand = {type: 'program', content};
          break;
        case 'memory':
          newOutput.memoryDump = content;
          newOutput.lastCommand = {type: 'memory', content};
          break;
        case 'clear':
          return {
            ...prev,
            io: {
              ...prev.io,
              output: {
                text: 'Consola limpiada',
                program: null,
                memoryDump: null,
                lastCommand: null
              }
            }
          };
      }
      
      return {
        ...prev,
        io: {
          ...prev.io,
          output: newOutput
        }
      };
    });
  };

  // Función principal para ejecutar instrucciones
  const executeNextInstruction = () => {
    const pc = systemState.cpu.registers.PC;
    
    // Verificar si hemos llegado al final de la ROM
    if (pc >= systemState.memory.rom.length) {
      handleOutput('text', 'Fin del programa alcanzado');
      setSystemState(prev => ({ ...prev, running: false }));
      return;
    }

    const instruction = systemState.memory.rom[pc];
    
    // Mostrar la instrucción actual en la salida
    handleOutput('text', `[PC=0x${pc.toString(16).toUpperCase()}] Ejecutando: ${instruction}`);

    if (!instruction || instruction === '0') {
      handleOutput('text', 'Instrucción no válida encontrada');
      setSystemState(prev => ({ ...prev, running: false }));
      return;
    }

    const [opcode, operand] = instruction.split(' ');
    const address = operand ? (operand.startsWith('0x') ? parseInt(operand, 16) : parseInt(operand)) : null;

    const newState = JSON.parse(JSON.stringify(systemState)); // Deep copy
    const { ACC } = newState.cpu.registers;

    try {
      switch(opcode) {
        case 'LOAD':
          if (address === null || isNaN(address)) {
            throw new Error('Dirección inválida para LOAD');
          }
          newState.cpu.registers.ACC = newState.memory.ram[address];
          newState.cpu.registers.PC += 1;
          newState.currentStep = 'fetch';
          break;

        case 'ADD':
          if (address === null || isNaN(address)) {
            throw new Error('Dirección inválida para ADD');
          }
          newState.cpu.registers.ACC += newState.memory.ram[address];
          newState.cpu.registers.PC += 1;
          newState.currentStep = 'fetch';
          break;

        case 'STORE':
          if (address === null || isNaN(address)) {
            throw new Error('Dirección inválida para STORE');
          }
          newState.memory.ram[address] = ACC;
          newState.cpu.registers.PC += 1;
          newState.currentStep = 'fetch';
          // Crear copia del array para forzar actualización
          newState.memory.ram = [...newState.memory.ram];
          break;

        case 'JMP':
          if (address === null || isNaN(address)) {
            throw new Error('Dirección inválida para JMP');
          }
          newState.cpu.registers.PC = address;
          newState.currentStep = 'fetch';
          break;

        case 'HLT':
          newState.running = false;
          handleOutput('text', 'Programa detenido por instrucción HLT');
          break;

        default:
          throw new Error(`Instrucción no reconocida: ${opcode}`);
      }

      // Actualizar registro IR con la instrucción actual
      newState.cpu.registers.IR = instruction;

      // Actualizar buses
      newState.buses = {
        data: newState.cpu.registers.ACC,
        address: newState.cpu.registers.PC,
        control: opcode
      };

      setSystemState(newState);

    } catch (error) {
      handleOutput('text', `Error: ${error.message}`);
      setSystemState(prev => ({ ...prev, running: false }));
    }
  };

  // Función para ejecución automática
  const startAutoExecution = () => {
    if (systemState.running) return;
    
    setSystemState(prev => ({ ...prev, running: true }));
  };

  // Efecto para la ejecución automática
  useEffect(() => {
    let intervalId;
    
    if (systemState.running) {
      intervalId = setInterval(() => {
        setSystemState(prev => {
          if (!prev.running) {
            clearInterval(intervalId);
            return prev;
          }
          executeNextInstruction();
          return prev;
        });
      }, 1000 / systemState.speed);
    }

    return () => clearInterval(intervalId);
  }, [systemState.running, systemState.speed]);

  // Función para reiniciar el simulador
  const resetSimulator = () => {
    setSystemState({
      cpu: {
        registers: {
          PC: 0,
          IR: 0,
          ACC: 0,
          MAR: 0,
          MBR: 0,
          FLAGS: 0
        },
        alu: {
          operation: null,
          result: 0
        }
      },
      memory: {
        ram: Array(256).fill(0),
        rom: [
          'LOAD 0x02',
          'ADD 0x03',
          'STORE 0x04',
          'HLT',
          ...Array(252).fill(0)
        ]
      },
      buses: {
        data: null,
        address: null,
        control: null
      },
      io: {
        input: '',
        output: {
          text: 'Simulador reiniciado. Listo para ejecutar.',
          program: null,
          memoryDump: null,
          lastCommand: null
        }
      },
      disk: Array(1024).fill(0),
      running: false,
      speed: systemState.speed,
      currentStep: 'fetch'
    });
  };

  return (
    <div className="computer-simulator">
      <h1>Simulador de Computador</h1>
      
      <div className="control-panel">
        <button onClick={executeNextInstruction}>Paso a Paso</button>
        <button onClick={startAutoExecution} disabled={systemState.running}>
          {systemState.running ? 'Ejecutando...' : 'Ejecutar Automático'}
        </button>
        <button onClick={resetSimulator}>Reiniciar</button>
        <div className="speed-control">
          <span>Velocidad:</span>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={systemState.speed}
            onChange={(e) => setSystemState(prev => ({
              ...prev,
              speed: parseInt(e.target.value)
            }))}
          />
          <span>{systemState.speed}x</span>
        </div>
      </div>
      
      <div className="computer-components">
        <CPU state={systemState.cpu} currentStep={systemState.currentStep} />
        
        <div className="memory-section">
          <RAM memory={systemState.memory.ram} onMemoryChange={updateMemory} />
          <ROM memory={systemState.memory.rom} currentAddress={systemState.cpu.registers.PC} />
        </div>
        
        <div className="bus-section">
          <DataBus value={systemState.buses.data} active={systemState.running} />
          <AddressBus value={systemState.buses.address} active={systemState.running} />
          <ControlBus signal={systemState.buses.control} />
        </div>
        
        <div className="io-section">
          <KeyboardInput onInput={handleInput} />
          <ScreenOutput
            text={systemState.io.output.text}
            program={systemState.io.output.program}
            memoryDump={systemState.io.output.memoryDump}
            onClear={() => handleOutput('clear')}
          />
        </div>
        
        <div className="disk-section">
          <DiskDrive 
            disk={systemState.disk}
            onDiskRead={(sector) => console.log('Leyendo sector:', sector)}
            onDiskWrite={(sector) => console.log('Escribiendo sector:', sector)}
          />
        </div>
        
        <InstructionSet />
      </div>
    </div>
  );
}

export default App;