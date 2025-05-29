import { toBinary, ADDRESS_SIZE, WORD_SIZE } from './binaryUtils';
import InstructionSet from '../components/InstructionSet';

export const initialState = {
  cpu: {
    registers: {
      PC: toBinary(0, ADDRESS_SIZE),  // Contador de Programa (12 bits)
      IR: toBinary(0, 16),            // Registro de Instrucción (16 bits)
      ACC: toBinary(0, WORD_SIZE),    // Acumulador (16 bits)
      MAR: toBinary(0, ADDRESS_SIZE), // Registro de Dirección de Memoria (12 bits)
      MBR: toBinary(0, WORD_SIZE),    // Registro Buffer de Memoria (16 bits)
      FLAGS: toBinary(0, 4)           // Registro de Flags [Z, N, C, V] (4 bits)
    },
    alu: {
      operation: null,                  // Operación actual de la ALU
      operandA: toBinary(0, WORD_SIZE), // Operando A
      operandB: toBinary(0, WORD_SIZE), // Operando B
    },
  },
  memory: {
    ram: JSON.parse(localStorage.getItem('simulator_ram_data')) || Array(256).fill('00000000'),
    rom: [
        '0001000000000010', // LOAD 2
        '0001000000000001', // LOAD 1
        '0011000000000011', // ADD 3
        '0010000000000100', // STORE 4 almacenamiento
        '1111000000000000', // HLT  // Detener la ejecución
        // Instrucciones adicionales
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
    ]
  },
  instructionSet: InstructionSet,

  buses: {
    data: {
      value: toBinary(0, WORD_SIZE),    // Valor actual en el bus
      active: false,                    // Estado de actividad
      source: null,                     // Componente origen (cpu, memory, io)
      target: null                      // Componente destino
    },
    address: {
      value: toBinary(0, ADDRESS_SIZE), // Dirección actual
      active: false,                    // Estado de actividad
      source: 'cpu'                     // Solo la CPU genera direcciones
    },
    control: {
      value: '0000',                    // Señal de control actual (4 bits)
      active: false,                    // Estado de actividad
      currentOperation: 'Ninguna operación', // Descripción
      source: 'cpu'                     // Solo la CPU genera señales
    },
    history: []                         // Historial de transacciones
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
