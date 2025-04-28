import { useState, useEffect } from 'react';
import ALU from './components/CPU/ALU';
import Registers from './components/CPU/Registers';
import RAM from './components/Memory/RAM';
import ROM from './components/Memory/ROM';
import ControlUnit from './components/CPU/ControlUnit';
import DataBus from './components/BusSystem/DataBus';
import AddressBus from './components/BusSystem/AddressBus';
import ControlBus from './components/BusSystem/ControlBus';
import KeyboardInput from './components/IO/KeyboardInput';
import ScreenOutput from './components/IO/ScreenOutput';
import DiskDrive from './components/Disk/DiskDrive';
import InstructionSet from './components/InstructionSet';
import BusAnimation from './components/BusSystem/BusAnimation.jsx';

// Constantes para el tamaño de datos
const WORD_SIZE = 8; // 8 bits para palabras
const ADDRESS_SIZE = 8; // 8 bits para direcciones (256 posiciones)

// Funciones de utilidad
const toBinary = (value, bits = WORD_SIZE) => {
  return (value >>> 0).toString(2).padStart(bits, '0');
};

const fromBinary = (binaryStr) => {
  return parseInt(binaryStr, 2);
};

function App() {
  // Estado inicial
  console.log("Inicializando estado del simulador...");
  const initialState = {
    cpu: {
      registers: {
        PC: toBinary(0, ADDRESS_SIZE),
        IR: toBinary(0, 16),
        ACC: toBinary(0),
        MAR: toBinary(0, ADDRESS_SIZE),
        MBR: toBinary(0),
        FLAGS: toBinary(0, 4) // [Z, C, S, O]
      },
      alu: {
        operation: null,
        operandA: toBinary(0),
        operandB: toBinary(0)
      }
    },
    memory: {
      ram: JSON.parse(localStorage.getItem('simulator_ram_data')) || 
           Array(256).fill('00000000'),
      rom: [
        '0001000000000010', // LOAD 2
        '0001000000000001', // LOAD 1
        '0011000000000011', // ADD 3
        '0010000000000100', // STORE 4
        '1111000000000000', // HLT
        // Nuevas instrucciones
        '0101000000000101', // SUB 5
        '0110000000000110', // MUL 6
        '0011000000000111', // ADD 7
        '0001000000001000', // LOAD 8
        '1100000000001001', // JMP 9
        '1110000000001010', // JZ 10
        '1011000000001011', // AND 11
        '1010000000001100', // OR 12
        '1001000000001101', // XOR 13
        '1111111111111111', // NOP (No Operation)
        '1000000000001110', // MOV 14
        // Puedes seguir agregando más líneas aquí...
      ]
    },
    
    instructionSet: InstructionSet,
    buses: {
      data: toBinary(0),
      address: toBinary(0, ADDRESS_SIZE),
      control: toBinary(0, 4)
    },
    io: {
      input: '',
      output: {
        text: 'Bienvenido al simulador de CPU. Escribe "help" para comandos.',
        program: null,
        memoryDump: null
      }
    },
    disk: Array(1024).fill(toBinary(0)),
    running: false,
    speed: 5,
    currentStep: 'fetch'
  };

  const [systemState, setSystemState] = useState(initialState);
  const [aluResult, setAluResult] = useState({
    result: toBinary(0),
    flags: toBinary(0, 4)
  });

  // Manejadores de estado
  const updateMemory = (address, value) => {
    const newRam = [...systemState.memory.ram];
    newRam[fromBinary(address)] = value.padStart(WORD_SIZE, '0');
    
    setSystemState(prev => ({
      ...prev,
      memory: {
        ...prev.memory,
        ram: newRam
      }
    }));
  
    // Guardar automáticamente en localStorage
    localStorage.setItem('simulator_ram_data', JSON.stringify(newRam));
  };

  const handleInput = (input) => {
    console.log(`Entrada recibida: ${input}`);
    if (input.toLowerCase() === 'help') {
      handleOutput('text', 
        `Comandos disponibles:
        - mem [dir]: Muestra memoria (ej: mem 5)
        - reg: Muestra registros
        - run: Ejecuta programa
        - step: Paso a paso
        - reset: Reinicia (conserva RAM)
        - reset-all: Reinicia completamente
        - clear: Limpia pantalla
        - save [dir] [valor]: Guarda un valor en memoria (ej: save 5 10101010 o save 5 170)`);
      return;
    }

    // Comando para mostrar memoria
    const memCommand = input.match(/^mem\s+(\d+)$/);
    if (memCommand) {
      const [_, addressStr] = memCommand;
      const addressNum = parseInt(addressStr, 10);
      console.log(`Comando mem detectado. Dirección: ${addressNum}`);
      if (addressNum < 0 || addressNum >= 2**ADDRESS_SIZE) {
        handleOutput('text', 'Error: Dirección fuera de rango (0-255)');
        return;
      }
      
      const address = toBinary(addressNum, ADDRESS_SIZE);
      const value = systemState.memory.ram[addressNum];
      
      handleOutput('text', 
        `Memoria en ${address} (${addressNum}):
        Valor: ${value} (${fromBinary(value)})`);
      return;
    }

    // Comando de guardar en memoria (acepta binario, decimal o hexadecimal)
    const saveCommand = input.match(/^save\s+(\d+)\s+([01]+|\d+|0x[0-9a-fA-F]+)$/i);
    if (saveCommand) {
      const [_, addressStr, valueStr] = saveCommand;
      console.log(`Comando save detectado. Dirección: ${addressStr}, Valor: ${valueStr}`);
      handleSaveToMemory(addressStr, valueStr);
      return;
    }
    

    // Comando reset-all (reinicio completo)
    if (input === 'reset-all') {
      console.log('Comando reset-all detectado.');
      if (window.confirm('¿Reiniciar completamente? Esto borrará toda la RAM')) {
        resetSimulator(true);
      }
      return;
    }

    // Comando reset normal (conserva RAM)
    if (input === 'reset') {
      console.log('Comando reset detectado.');
      resetSimulator(false);
      return;
    }

    setSystemState(prev => ({
      ...prev,
      io: {
        ...prev.io,
        input,
        output: {
          ...prev.io.output,
          text: `Entrada: ${input}`
        }
      }
    }));
  };

  const handleOutput = (type, content) => {
    console.log(`Actualizando salida. Tipo: ${type}, Contenido: ${content}`);
    setSystemState(prev => {
      const newOutput = {...prev.io.output};
      
      switch(type) {
        case 'text':
          newOutput.text = content;
          break;
        case 'program':
          newOutput.program = content;
          break;
        case 'memory':
          newOutput.memoryDump = content;
          break;
        case 'clear':
          return {
            ...prev,
            io: {
              ...prev.io,
              output: {
                text: 'Consola limpiada',
                program: null,
                memoryDump: null
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

  const executeNextInstruction = () => {
    console.log('Ejecutando siguiente instrucción...');
    const pc = systemState.cpu.registers.PC;
    const pcNum = fromBinary(pc);
    console.log(`PC actual: ${pc} (${pcNum})`);
    
    if (pcNum >= systemState.memory.rom.length) {
      handleOutput('text', 'Fin del programa (PC fuera de ROM)');
      setSystemState(prev => ({ ...prev, running: false }));
      return;
    }
    let op = '';

    const instruction = systemState.memory.rom[pcNum];
    console.log(`Instrucción obtenida: ${instruction}`);
    const { opcode, operand } = decodeInstruction(instruction);
    console.log(`Instrucción decodificada: ${instruction} -> Opcode: ${opcode}, Operando: ${operand}`);
    console.log(`Decodificada: Opcode: ${opcode}, Operando: ${operand}`);
    const address = operand;

    handleOutput('text', `[PC: ${pc}] Ejecutando: ${opcode} ${operand}`);

    const newState = JSON.parse(JSON.stringify(systemState));
    
    try {
      switch(newState.currentStep) {
        case 'fetch':
          console.log('Paso FETCH');
          newState.cpu.registers.MAR = pc;
          newState.buses.address = pc;
          newState.cpu.registers.MBR = instruction;
          newState.cpu.registers.IR = instruction;
          newState.buses.data = instruction;
          newState.buses.control = toBinary(0b0001, 4);
          newState.currentStep = 'decode';
          break;
          
        case 'decode':
          console.log('Paso DECODE');
          newState.buses.control = toBinary(0b0010, 4);
          newState.currentStep = 'execute';
          break;

        case 'execute':
          console.log('Paso EXECUTE');
          newState.buses.control = toBinary(0b0100, 4);
          
          newState.cpu.alu.operandA = newState.cpu.registers.ACC; // Preparar operandos para ALU
          newState.cpu.alu.operation = op; // Establecer operación ALU

          switch(opcode) {
            case '0001': // LOAD
              console.log('Ejecutando LOAD');
              newState.cpu.registers.MAR = address; // Dirección de memoria
              newState.buses.address = address; // Actualiza bus de dirección
              newState.cpu.registers.MBR = newState.memory.ram[fromBinary(address)]; // Cargar valor de RAM en MBR
              newState.cpu.registers.ACC = newState.cpu.registers.MBR; // Cargar MBR en ACC
              newState.buses.data = newState.cpu.registers.ACC; // Actualiza bus de datos
              op = 'LOAD'; // Establecer operación ALU
              newState.cpu.alu.operation = op; // Establecer operación ALU
              newState.cpu.registers.PC = toBinary(pcNum + 1, ADDRESS_SIZE); // Actualiza PC
              newState.cpu.registers.FLAGS = toBinary(0, 4); // Reiniciar flags
              break;
            case '0010': // ADD
              console.log('Ejecutando ADD');
              newState.cpu.registers.MAR = address; // Dirección de memoria
              newState.buses.address = address; // Actualiza bus de dirección
              newState.cpu.registers.MBR = newState.memory.ram[fromBinary(address)]; // Cargar valor de RAM en MBR
              newState.cpu.alu.operandB = newState.cpu.registers.MBR; // Cargar MBR en operando B
              op = 'ADD'; // Establecer operación ALU
              newState.cpu.alu.operation = op; // Establecer operación ALU
              newState.cpu.alu.operandB = newState.cpu.registers.MBR;  // Cargar MBR en operando B
              console.log(`Operandos para ALU: A=${newState.cpu.alu.operandA}, B=${newState.cpu.alu.operandB}`); 
              break; 
              
            case '0011': // STORE
              console.log('Ejecutando STORE'); 
              newState.cpu.registers.MAR = address; // Dirección de memoria 
              newState.cpu.registers.MBR = newState.cpu.registers.ACC; // Cargar ACC en MBR
              // Actualiza RAM(con la direccion del segundo dato) con el valor de MBR
              newState.memory.ram[fromBinary(address)] = newState.cpu.registers.MBR; 
              newState.memory.ram = [...newState.memory.ram]; // Forzar re-render
              newState.buses.address = address; // Actualiza bus de dirección
              newState.buses.data = newState.cpu.registers.MBR; // Actualiza bus de datos
              op = 'STORE'; // Establecer operación ALU
              newState.cpu.alu.operation = op; // Establecer operación ALU
              newState.cpu.registers.PC = toBinary(pcNum + 1, ADDRESS_SIZE); // Actualiza PC
              break;
              
            case '1111': // HLT
              console.log('Ejecutando HLT');
              newState.running = false; // Detener ejecución
              op = 'HLT'; // Establecer operación ALU
              newState.cpu.alu.operation = op; // Establecer operación ALU
              handleOutput('text', 'Programa detenido (HLT)'); 
              break;
              
            default:
              console.log(`Instrucción no implementada: ${opcode}`);
              handleOutput('text', `Instrucción no implementada: ${opcode}`);
              newState.cpu.registers.PC = toBinary(pcNum + 1, ADDRESS_SIZE);
          }
          console.log(`Ejecutando instrucción [PC: ${pc}] - Paso: ${newState.currentStep}`);
          
          newState.currentStep = 'fetch';
          break;
      }
      
      setSystemState(newState);
      
    } catch (error) {
      console.error(`Error durante la ejecución: ${error.message}`);
      handleOutput('text', `Error: ${error.message}`);
      setSystemState(prev => ({ ...prev, running: false }));
    }
  };

  const handleSaveToMemory = (addressStr, valueStr) => {
    try {
      const address = parseInt(addressStr, 10); // Dirección de memoria
      if (isNaN(address)) {
        throw new Error('Dirección inválida. Debe ser un número entero.');
      }
      if (address < 0 || address >= 2**ADDRESS_SIZE) { // Rango de direcciones
        throw new Error(`Dirección inválida. Rango permitido: 0-${2**ADDRESS_SIZE-1}`);
      }
  
      let binaryValue; // Valor a guardar en memoria
      // Validar el valor ingresado (binario, hexadecimal o decimal)
      // Acepta binario (0b), hexadecimal (0x) o decimal
      if (/^[01]+$/.test(valueStr)) { // Binario
        // Asegurarse de que el valor binario tenga el formato correcto
        binaryValue = '0b' + valueStr.padStart(WORD_SIZE, '0');
      } 
      else if (/^0x[0-9a-fA-F]+$/.test(valueStr)) { // Hexadecimal
        const num = parseInt(valueStr, 16);
        if (num < 0 || num >= 2**WORD_SIZE) {
          throw new Error(`Valor hexadecimal debe estar entre 0x0-0x${(2**WORD_SIZE-1).toString(16)}`);
        }
        binaryValue = toBinary(num, WORD_SIZE);
      }
      else { // Decimal
        const num = parseInt(valueStr, 10);
        if (!Number.isInteger(num)) {  // Verificar si el número es entero
          throw new Error(`El valor decimal debe ser un número entero.`);
        }
        if (num < 0 || num >= 2**WORD_SIZE) {
          throw new Error(`Valor decimal debe estar entre 0-${2**WORD_SIZE-1}`);
        }
        binaryValue = toBinary(num, WORD_SIZE);
      }
  
      updateMemory(toBinary(address, ADDRESS_SIZE), binaryValue);
      handleOutput('text', `Dato guardado: Dir. ${address} = ${binaryValue} (${fromBinary(binaryValue)})`);
      
    } catch (error) {
      handleOutput('text', `Error: ${error.message}`);
    }
  };
  

  const handleMemoryRead = (addressStr) => {
    const address = parseInt(addressStr, 10);
    if (address >= 0 && address < systemState.memory.ram.length) {
      const value = systemState.memory.ram[address];
      handleOutput('text', `Memoria [${address}]: ${value} (${fromBinary(value)} decimal)`);
    } else {
      handleOutput('text', `Error: Dirección ${address} fuera de rango`);
    }
  };

  // Efecto para actualizar registros con resultado de ALU
  useEffect(() => {
    if (systemState.cpu.alu.operation && aluResult.result) {
      setSystemState(prev => {
        const newState = { ...prev };
        newState.cpu.registers.ACC = aluResult.result;
        newState.cpu.registers.FLAGS = aluResult.flags;
        newState.cpu.registers.PC = toBinary(
          fromBinary(prev.cpu.registers.PC) + 1, 
          ADDRESS_SIZE
        );
        newState.cpu.alu.operation = null;
        return newState;
      });
    }
  }, [aluResult]);

  // Ejecución automática
  const startAutoExecution = () => {
    if (systemState.running) return;
    setSystemState(prev => ({ ...prev, running: true }));
  };

  // Efecto para ejecución automática
  useEffect(() => {
    let intervalId;
    
    if (systemState.running) {
      intervalId = setInterval(() => {
        executeNextInstruction();
      }, 1000 / systemState.speed);
    }

    return () => clearInterval(intervalId);
  }, [systemState.running, systemState.speed]);

  // Reiniciar simulador (con opción para conservar RAM)
  const resetSimulator = (fullReset = false) => {
    setSystemState(prev => ({
      ...initialState,
      memory: {
        ram: fullReset ? [...initialState.memory.ram] : [...prev.memory.ram],
        rom: [...initialState.memory.rom]
      },
      running: false,
      speed: prev.speed,
      io: {
        ...initialState.io,
        output: {
          ...initialState.io.output,
          text: fullReset ? 
            'Simulador reiniciado completamente. RAM borrada.' : 
            'Simulador reiniciado. Los datos en RAM se conservaron.'
        }
      }
    }));
    
    setAluResult({
      result: toBinary(0),
      flags: toBinary(0, 4)
    });
  };

  // Decodificar instrucción
  const decodeInstruction = (instruction) => {
    const binaryStr = instruction.padStart(16, '0');
    return {
      opcode: binaryStr.substring(0, 4),
      operand: binaryStr.substring(4)
    };
  };

  return (
    <div className="computer-simulator">
      <h1>Simulador de CPU Binario</h1>
      
      <div className="control-panel">
        <button onClick={executeNextInstruction}>Paso a Paso</button>
        <button onClick={startAutoExecution} disabled={systemState.running}>
          {systemState.running ? 'Ejecutando...' : 'Ejecutar Auto'}
        </button>
        <button onClick={() => resetSimulator(false)}>Reiniciar (conservar RAM)</button>
        <button onClick={() => resetSimulator(true)} className="danger">Reiniciar Todo</button>
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
        <div className="cpu-section">
          <Registers registers={systemState.cpu.registers} />
          <ALU
            operation={systemState.cpu.alu.operation}
            operandA={systemState.cpu.alu.operandA}
            operandB={systemState.cpu.alu.operandB}
            flags={{
              Z: systemState.cpu.registers.FLAGS[0],
              C: systemState.cpu.registers.FLAGS[1],
              S: systemState.cpu.registers.FLAGS[2],
              O: systemState.cpu.registers.FLAGS[3]
            }}
            onResult={setAluResult}
          />
          <ControlUnit currentStep={systemState.currentStep} />
        </div>
        
        <div className="memory-section">
          <RAM 
            memory={systemState.memory.ram} 
            onMemoryChange={updateMemory} 
            wordSize={WORD_SIZE}
          />
          <ROM 
            memory={systemState.memory.rom} 
            wordSize={16}
            currentAddress={fromBinary(systemState.cpu.registers.PC)}
            instructionSet={systemState.instructionSet}
          />
        </div>
        
        <div className="bus-section">
          <DataBus 
            value={systemState.buses.data} 
            active={systemState.running} 
            label="Datos"
            size={WORD_SIZE}
          />
          <AddressBus 
            value={systemState.buses.address} 
            active={systemState.running} 
            label="Dirección"
            size={ADDRESS_SIZE}
          />
          <BusAnimation type="address" {...systemState.buses.address} />
          <BusAnimation type="data" {...systemState.buses.data} />
          <ControlBus 
            signal={systemState.buses.control} 
            label="Control"
            size={4}
          />
        </div>
        
        <div className="io-section">
          <KeyboardInput 
            onInput={handleInput}
            onSaveToMemory={handleSaveToMemory}
            onMemoryRead={handleMemoryRead}
          />
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
            wordSize={WORD_SIZE}
          />
        </div>
        
        <InstructionSet binaryMode={true} />
      </div>
    </div>
  );
}

export default App;