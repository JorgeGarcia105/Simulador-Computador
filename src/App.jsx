import { useState, useEffect } from 'react';
import ALU from './components/CPU/ALU';
import Registers from './components/CPU/Registers';
import RAM from './components/Memory/RAM';
import ROM from './components/Memory/ROM';
import DataBus from './components/BusSystem/DataBus';
import AddressBus from './components/BusSystem/AddressBus';
import ControlBus from './components/BusSystem/ControlBus';
import InstructionSet from './components/InstructionSet';
import { initialState } from './utils/initialState.js';
import { useCommandHandler } from './hooks/useCommandHandler';
import { toBinary } from './utils/binaryUtils';
import useInstructionCycle from './utils/useInstructionCycle.js';
import { updateMemory } from './utils/MemoryHandler';
import InternalBus from './components/CPU/InternalBus';
const WORD_SIZE = 12;
const ADDRESS_SIZE = 12;

function App() {
	const [systemState, setSystemState] = useState(initialState);
	const [viewMode] = useState('instruction');
	const { handleOutput } = useCommandHandler(systemState, setSystemState);
	const { executeNextInstruction } = useInstructionCycle(
		systemState,
		setSystemState,
		handleOutput
	);

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
		setSystemState((prev) => ({
			...prev,
			memory: {
				...prev.memory,
				rom: programLines, // Asegúrate de que programLines es un array de instrucciones binarias
			},
			cpu: {
				...prev.cpu,
				registers: {
					...prev.cpu.registers,
					PC: toBinary(0, ADDRESS_SIZE),
				},
			},
			running: false, // Detén la ejecución automática al cargar un nuevo programa
		}));
	};

	// Efectos secundarios

	useEffect(() => {
		let timeoutId;

		function runAuto() {
			if (systemState.running && !isProgramFinished()) {
				executeNextInstruction();
				timeoutId = setTimeout(runAuto, 1000 / systemState.speed);
			} else {
				// Detén la ejecución automática si el programa terminó
				alert('¡El programa ha terminado de ejecutarse!');
				setSystemState((prev) => ({ ...prev, running: false }));
			}
		}

		if (systemState.running) {
			runAuto();
		}

		return () => clearTimeout(timeoutId);
	}, [systemState.running, systemState.speed, executeNextInstruction]);
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
		value: systemState.cpu.registers.ACC,
	};

	// Coloca aquí el log, antes del return
	console.log('ROM:', systemState.memory.rom);

	return (
		<div className="simulator-drawer">
			<div className="computer-simulator">
				<div className="simulator-title">
					<h1 className="simulator-titulo">Simulador de Arquitectura de Computadora</h1>

					<div className="control-buttons">
						<button onClick={executeNextInstruction}>Paso a Paso</button>
						<button
							onClick={() => {
								setSystemState((prev) => ({
									...prev,
									running: true, // Solo inicia la ejecución automática, NO reinicia el PC aquí
								}));
							}}
							disabled={
								systemState.running ||
								!systemState.memory.rom[0] ||
								systemState.memory.rom[0] === '0000000000000000'
							}
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
						<div
							style={{
								marginTop: 16,
								fontWeight: 'bold',
								fontSize: '1.1em',
								textAlign: 'center',
								padding: '30px',
							}}
						>
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
							viewMode={viewMode}
						/>
					</div>
					<div className="cpu-square-cell cpu-rom">
						<ROM
							memory={systemState.memory.rom}
							onMemoryChange={updateMemoryState}
							wordSize={WORD_SIZE}
							onProgramLoad={handleProgramLoad}
							viewMode={viewMode}
						/>
					</div>
				</div>

				{/* Bus externo entre CPU y RAM/ROM */}
				<div className="bus-system" style={{ maxWidth: 900, margin: '24px auto 0 auto' }}>
					<DataBus
						value={systemState.buses.data.value}
						active={systemState.buses.data.active}
						connection={
							systemState.buses.data.source
								? `${systemState.buses.data.source} → ${systemState.buses.data.target}`
								: ''
						}
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
					<div className="instruction-section component">
						<InstructionSet />
					</div>
				</div>
			</div>
		</div>
	);

	function isProgramFinished() {
		const pc = parseInt(systemState.cpu.registers.PC, 2);
		const rom = systemState.memory.rom;
		const instr = rom[pc];
		return (
			!instr || instr.substring(0, 4) === '0101' // '0101' es HLT
		);
	}
}

export default App;
