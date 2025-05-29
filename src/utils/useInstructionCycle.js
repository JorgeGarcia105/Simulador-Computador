import { useState, useCallback } from 'react';
import {
	toBinary,
	fromBinary,
	binaryAdd,
	binarySubtract,
	binaryAnd,
	binaryOr,
	binaryXor,
	binaryNot,
	binaryShiftLeft,
	binaryShiftRight,
} from '../utils/binaryUtils';
import { INSTRUCTION_SET } from '../components/InstructionSet';

// Constantes de configuración
const ADDRESS_SIZE = 12; // Tamaño de direcciones en bits
const WORD_SIZE = 12; // Tamaño de palabra en bits
const INSTRUCTION_SIZE = 16; // Tamaño de instrucción en bits (4 opcode + 12 operand)

// Estados del ciclo de instrucciones
const CPU_STEPS = {
	FETCH: 'fetch',
	DECODE: 'decode',
	EXECUTE: 'execute',
};

// Señales de control
const CONTROL_SIGNALS = {
	FETCH: toBinary(0b0001, 4),
	DECODE: toBinary(0b0010, 4),
	EXECUTE: toBinary(0b0100, 4),
};

const useInstructionCycle = (systemState, setSystemState, handleOutput) => {
	const [currentStep, setCurrentStep] = useState(CPU_STEPS.FETCH);
	const [aluOperation, setAluOperation] = useState(null);

	// Normaliza un valor binario al tamaño especificado
	const normalizeBinary = (value, size, signed = false) => {
		if (value.length > size) {
			console.warn(`Truncando valor ${value} a ${size} bits`);
			return value.slice(-size);
		}
		if (value.length < size) {
			const padChar = signed && value[0] === '1' ? '1' : '0';
			return value.padStart(size, padChar);
		}
		return value;
	};

	// Decodificador de instrucciones
	const decodeInstruction = useCallback((instruction) => {
		const binaryStr = normalizeBinary(instruction, INSTRUCTION_SIZE);
		return {
			opcode: binaryStr.substring(0, 4),
			operand: binaryStr.substring(4),
		};
	}, []);

	// Ejecutor de operaciones de la ALU
	const executeALUOperation = useCallback(
		(operation, operandA, operandB = '0'.repeat(WORD_SIZE)) => {
			try {
				// Normalizar operandos
				const opA = normalizeBinary(operandA, WORD_SIZE, true);
				const opB =
					operation !== 'NOT' && operation !== 'SHL' && operation !== 'SHR'
						? normalizeBinary(operandB, WORD_SIZE, true)
						: '0'.repeat(WORD_SIZE);

				console.log(`ALU Operation: ${operation} ${opA} ${opB}`);
				setAluOperation({ operation, operandA: opA, operandB: opB });

				// Mapeo de operaciones
				const aluOperations = {
					ADD: binaryAdd,
					SUB: binarySubtract,
					AND: binaryAnd,
					OR: binaryOr,
					XOR: binaryXor,
					NOT: binaryNot,
					SHL: binaryShiftLeft,
					SHR: binaryShiftRight,
				};

				if (!aluOperations[operation]) {
					throw new Error(`Operación no soportada: ${operation}`);
				}

				let result;
				if (operation === 'NOT' || operation === 'SHL' || operation === 'SHR') {
					const aluResult = aluOperations[operation](opA, WORD_SIZE);
					result = {
						result: aluResult.result || aluResult,
						flags: aluResult.flags || {
							Z: (aluResult.result || aluResult) === '0'.repeat(WORD_SIZE) ? '1' : '0',
							C: aluResult.carry || '0',
							S:
								operation === 'SHR'
									? '0'
									: (aluResult.result || aluResult)[0] === '1'
									? '1'
									: '0',
							O: '0',
						},
					};
				} else {
					const aluResult = aluOperations[operation](opA, opB, WORD_SIZE);
					result = {
						result: aluResult.result || aluResult,
						flags: aluResult.flags || {
							Z: (aluResult.result || aluResult) === '0'.repeat(WORD_SIZE) ? '1' : '0',
							C: aluResult.carry || '0',
							S: (aluResult.result || aluResult)[0] === '1' ? '1' : '0',
							O: '0',
						},
					};
				}

				console.log(`ALU Result:`, result);
				return result;
			} catch (error) {
				console.error(`Error en ALU: ${error.message}`);
				throw error;
			}
		},
		[]
	);

	// Ejecuta la siguiente instrucción
	const executeNextInstruction = useCallback(() => {
		try {
			const pc = normalizeBinary(systemState.cpu.registers.PC, ADDRESS_SIZE);
			const pcNum = fromBinary(pc);

			// Verificar fin del programa
			if (pcNum >= systemState.memory.rom.length) {
				handleOutput('text', 'Fin del programa (PC fuera de ROM)');
				setSystemState((prev) => ({ ...prev, running: false }));
				return;
			}

			const instruction = normalizeBinary(
				systemState.memory.rom[pcNum],
				INSTRUCTION_SIZE
			);
			const { opcode, operand } = decodeInstruction(instruction);
			const address = normalizeBinary(operand, ADDRESS_SIZE);

			handleOutput(
				'text',
				`[PC: ${pc}] Ejecutando: ${
					INSTRUCTION_SET[opcode]?.name || 'DESCONOCIDA'
				} ${address}`
			);

			const newState = JSON.parse(JSON.stringify(systemState));

			switch (newState.currentStep) {
				case CPU_STEPS.FETCH:
					// Fase FETCH
					newState.cpu.registers.MAR = pc;
					newState.buses.address = {
						...newState.buses.address,
						value: pc,
						active: true,
						source: 'cpu',
					};
					newState.cpu.registers.MBR = instruction;
					newState.cpu.registers.IR = instruction;
					newState.buses.data = {
						...newState.buses.data,
						value: instruction,
						active: true,
						source: 'memory',
					};
					newState.buses.control = {
						...newState.buses.control,
						value: CONTROL_SIGNALS.FETCH,
						active: true,
						source: 'cpu',
					};
					newState.currentStep = CPU_STEPS.DECODE;
					break;

				case CPU_STEPS.DECODE:
					// Fase DECODE
					newState.buses.control = {
						...newState.buses.control,
						value: CONTROL_SIGNALS.DECODE,
						active: true,
						source: 'cpu',
					};
					newState.currentStep = CPU_STEPS.EXECUTE;
					break;

				case CPU_STEPS.EXECUTE: {
					// Fase EXECUTE
					newState.buses.control = {
						...newState.buses.control,
						value: CONTROL_SIGNALS.EXECUTE,
						active: true,
						source: 'cpu',
					};
					newState.cpu.alu.operandA = normalizeBinary(
						newState.cpu.registers.ACC,
						WORD_SIZE,
						true
					);

					let incrementarPC = true;

					switch (opcode) {
						case '0001': {
							// LOAD
							const memAddress = fromBinary(address);
							const memValue = newState.memory.ram[memAddress]
								? normalizeBinary(newState.memory.ram[memAddress], WORD_SIZE, true)
								: toBinary(0, WORD_SIZE);

							newState.cpu.registers.MAR = address;
							newState.buses.address = {
								...newState.buses.address,
								value: address,
								active: true,
								source: 'cpu',
							};
							newState.cpu.registers.MBR = memValue;
							newState.cpu.registers.ACC = memValue;
							newState.buses.data = {
								...newState.buses.data,
								value: memValue,
								active: true,
								source: 'memory',
							};
							newState.cpu.registers.FLAGS = toBinary(0, 4);
							break;
						}

						case '0011': // ADD
						case '0100': // SUB
						case '1010': // AND
						case '1011': // OR
						case '1100': // XOR
						case '1101': // NOT
						case '1110': // SHL
						case '1111': // SHR
							{
								const memAddressALU = fromBinary(address);
								const memValueALU = newState.memory.ram[memAddressALU]
									? normalizeBinary(newState.memory.ram[memAddressALU], WORD_SIZE, true)
									: toBinary(0, WORD_SIZE);

								newState.cpu.registers.MAR = address;
								newState.buses.address = {
									...newState.buses.address,
									value: address,
									active: true,
									source: 'cpu',
								};
								newState.cpu.registers.MBR = memValueALU;
								newState.buses.data = {
									...newState.buses.data,
									value: memValueALU,
									active: true,
									source: 'memory',
								};

								// Mapeo extendido de operaciones ALU
								let aluOpMap = {
									'0011': 'ADD',
									'0100': 'SUB',
									1010: 'AND',
									1011: 'OR',
									1100: 'XOR',
									1101: 'NOT',
									1110: 'SHL',
									1111: 'SHR',
								};

								// Ejecuta la operación correspondiente
								let aluResult = executeALUOperation(
									aluOpMap[opcode],
									newState.cpu.registers.ACC,
									memValueALU
								);

								// Guarda la operación y operandos en el estado global para la visualización
								newState.cpu.alu.operation = aluOpMap[opcode];
								newState.cpu.alu.operandA = newState.cpu.registers.ACC;
								newState.cpu.alu.operandB = memValueALU;

								if (typeof aluResult === 'object') {
									newState.cpu.registers.ACC = aluResult.result;
									newState.cpu.registers.FLAGS = aluResult.flags;
								} else {
									newState.cpu.registers.ACC = aluResult;
									newState.cpu.registers.FLAGS = toBinary(0, 4);
								}
							}
							break;

						case '0010': {
							// STORE
							const memAddress = fromBinary(address);
							console.log(
								'STORE ejecutado: ACC =',
								newState.cpu.registers.ACC,
								'-> RAM[',
								memAddress,
								']'
							);
							newState.memory.ram[memAddress] = newState.cpu.registers.ACC.padStart(
								WORD_SIZE,
								'0'
							);
							// Actualiza MAR y MBR para visualización
							newState.cpu.registers.MAR = address;
							newState.cpu.registers.MBR = newState.cpu.registers.ACC.padStart(
								WORD_SIZE,
								'0'
							);
							// Actualiza el bus de direcciones y datos
							newState.buses.address = {
								...newState.buses.address,
								value: address,
								active: true,
								source: 'cpu',
							};
							newState.buses.data = {
								...newState.buses.data,
								value: newState.cpu.registers.ACC.padStart(WORD_SIZE, '0'),
								active: true,
								source: 'cpu',
							};
							break;
						}

						case '0101': // HLT
							handleOutput('text', 'Programa detenido (HLT)');
							setSystemState((prev) => ({ ...prev, running: false }));
							incrementarPC = false;
							return;

						default:
							handleOutput('text', `Opcode desconocido: ${opcode}`);
							setSystemState((prev) => ({ ...prev, running: false }));
							incrementarPC = false;
							return;
					}

					if (incrementarPC) {
						let nextPC = pcNum + 1;
						if (nextPC >= newState.memory.rom.length) {
							handleOutput('text', 'Fin del programa (PC fuera de ROM)');
							setSystemState((prev) => ({ ...prev, running: false }));
							return;
						}
						newState.cpu.registers.PC = normalizeBinary(
							toBinary(nextPC, ADDRESS_SIZE),
							ADDRESS_SIZE
						);
					}

					newState.currentStep = CPU_STEPS.FETCH;
					break;
				}

				default:
					throw new Error(`Paso de CPU desconocido: ${newState.currentStep}`);
			}

			setSystemState(newState);
			setCurrentStep(newState.currentStep);
		} catch (error) {
			handleOutput('error', error.message);
		}
	}, [systemState, setSystemState, decodeInstruction, executeALUOperation, handleOutput]);

	return {
		currentStep,
		executeNextInstruction,
		aluOperation,
	};
};

export default useInstructionCycle;
