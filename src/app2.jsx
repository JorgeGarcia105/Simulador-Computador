import { useState, useEffect } from 'react';
import ALU from './components/CPU/ALU';
import Registers from './components/CPU/Registers';
import RAM from './components/Memory/RAM';
import ROM from './components/Memory/ROM';
import BusSystem from './components/BusSystem/BusSystem.jsx';
import DataBus from './components/BusSystem/DataBus';
import AddressBus from './components/BusSystem/AddressBus';
import ControlBus from './components/BusSystem/ControlBus';
import KeyboardInput from './components/IO/KeyboardInput';
import ScreenOutput from './components/IO/ScreenOutput';
import InstructionSet from './components/InstructionSet';
import { initialState } from './utils/initialState.js';
import { useCommandHandler } from './hooks/useCommandHandler';
import { toBinary} from './utils/binaryUtils';
import useInstructionCycle from './utils/useInstructionCycle.js';
import { updateMemory } from './utils/MemoryHandler';
import InternalBus from './components/CPU/InternalBus';
import BusAnimation from './components/BusSystem/BusAnimation.jsx';
//, handleSaveToMemory, handleMemoryRead
const WORD_SIZE = 12;
const ADDRESS_SIZE = 12;

function App() {
  const [systemState, setSystemState] = useState(initialState);
  const { handleInput, handleOutput } = useCommandHandler(systemState, setSystemState);
  const { executeNextInstruction } = useInstructionCycle(systemState, setSystemState, handleOutput);

  // Manejadores de estado
  const updateMemoryState = (address, value) => {
    const updatedState = updateMemory(systemState, address, value);
    setSystemState(updatedState);
  };
/*
  // Manejadores de E/S
  const handleSaveMemory = (addressStr, valueStr) => {
    const result = handleSaveToMemory(systemState, setSystemState, addressStr, valueStr);
    handleOutput('text', result);
  };

  const handleMemoryReadInput = (addressStr) => {
    const result = handleMemoryRead(systemState, addressStr);
    handleOutput('text', result);
  };*/

  const handleProgramLoad = (programLines) => {
    const ROM_SIZE = systemState.memory.rom.length;
    const padded = [
      ...programLines.map(line => line.padStart(16, '0')),
      ...Array(ROM_SIZE - programLines.length).fill('0000000000000000')
    ];
    setSystemState(prev => ({
      ...prev,
      memory: {
        ...prev.memory,
        rom: padded
      },
      cpu: {
        ...prev.cpu,
        registers: {
          ...prev.cpu.registers,
          PC: toBinary(0, ADDRESS_SIZE)
        }
      }
    }));
  };

  // Efectos secundarios
  

  useEffect(() => {
    let intervalId;

    if (systemState.running) {
      intervalId = setInterval(() => {
        executeNextInstruction();
      }, 1000 / systemState.speed);
    }

    return () => clearInterval(intervalId);
  }, [systemState.running, systemState.speed]);
/*
  // Depuración
  console.log("==== DEPURACIÓN SYSTEM STATE ====");
  console.log("DataBus:", systemState.buses.data);
  console.log("AddressBus:", systemState.buses.address);
  console.log("ControlBus:", systemState.buses.control);
  console.log("CPU Registers:", systemState.cpu.registers);
  console.log("ROM[0]:", systemState.memory.rom[0]);
  console.log("RAM[0]:", systemState.memory.ram[0]);
  console.log("==================================");
*/
  // Ejemplo: simula una transferencia interna (ajusta según tu lógica real)
  const internalBusInfo = {
    source: 'ACC',
    destination: 'ALU',
    value: systemState.cpu.registers.ACC
  };

  return (
    <div className="simulator-drawer">
      <div className="computer-simulator">
        <h1 className="simulator-title">Simulador de Arquitectura de Computadora</h1>

        <div className="control-panel">
          <div className="control-buttons">
            <button onClick={executeNextInstruction}>Paso a Paso</button>
            <button 
              onClick={() => setSystemState(prev => ({ ...prev, running: true }))} 
              disabled={systemState.running}
            >
              {systemState.running ? 'Ejecutando...' : 'Ejecutar Auto'}
            </button>
          </div>
        </div>

        {/* CPU en cuadrado bien distribuido */}
        <div className="cpu-square-layout">
          <div className="cpu-square-cell cpu-registers-control">
            {/* Junta registros y control aquí */}
            <Registers registers={systemState.cpu.registers} />
            <div style={{marginTop: 16, fontWeight: 'bold', fontSize: '1.1em', textAlign: 'center'}}>
              Unidad de Control
            </div>
          </div>
          <div className="cpu-square-cell cpu-alu">
            <ALU
              operation={systemState.cpu.alu.operation}
              operandA={systemState.cpu.alu.operandA}
              operandB={systemState.cpu.alu.operandB}
              flags={systemState.cpu.registers.FLAGS}
            />
          </div>
          <div className="cpu-square-cell cpu-bus">
            {/* Bus interno de la CPU */}
            <InternalBus
              source={internalBusInfo.source}
              destination={internalBusInfo.destination}
              value={internalBusInfo.value}
            />
          </div>
          <div className="cpu-square-cell cpu-ram">
            <RAM 
              memory={systemState.memory.ram} 
              onMemoryChange={updateMemoryState} 
              wordSize={WORD_SIZE}
            />
          </div>
          <div className="cpu-square-cell cpu-rom">
            <ROM
              memory={systemState.memory.rom}
              onProgramLoad={handleProgramLoad}
              wordSize={WORD_SIZE}
            />
          </div>
        </div>
        

        {/* Bus externo entre CPU y RAM/ROM */}
        <div className="bus-system" style={{ maxWidth: 900, margin: '24px auto 0 auto' }}>
          <DataBus 
            value={systemState.buses.data.value}
            active={systemState.buses.data.active}
            connection={systemState.buses.data.source ? `${systemState.buses.data.source} → ${systemState.buses.data.target}` : ''}
            clockCycles={systemState.buses.data.clockCycles}
          />
          <AddressBus 
            value={systemState.buses.address.value}
            active={systemState.buses.address.active}
            connection={systemState.buses.address.source}
            clockCycles={systemState.buses.address.clockCycles}
          />
          <ControlBus 
            value={systemState.buses.control.value}
            active={systemState.buses.control.active}
            connection={systemState.buses.control.source}
            clockCycles={systemState.buses.control.clockCycles}
          />
        </div>

        {/* IO + INSTRUCCIONES */}
        <div className="bottom-block">
          <div className="io-container">
            <div className="io-device keyboard-component">
              <KeyboardInput onInput={handleInput} onProgramLoad={handleProgramLoad} />
            </div>
            <div className="io-device screen-output">
              <ScreenOutput text={systemState.io.output.text} />
            </div>
          </div>
          <div className="instruction-section component">
            <InstructionSet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
