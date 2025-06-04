import { toBinary, ADDRESS_SIZE, WORD_SIZE } from './binaryUtils';
import InstructionSet from '../components/InstructionSet';

const RAM_SIZE = 4096; // 12 bits de dirección

// Tus datos iniciales (primeras posiciones)
const initialData = [
  '000000000011', // RAM[0] = 3
  '000000000101', // RAM[1] = 5
  '000000000010', // RAM[2] = 2
  '000000000111', // RAM[3] = 7
  '000000000001', // RAM[4] = 1
  // ...más datos si quieres
];

// Rellena la RAM con ceros y pon los datos y el código en su lugar
const ram = Array(RAM_SIZE).fill('000000000000');
initialData.forEach((val, i) => ram[i] = val);
initialData.forEach((val, i) => ram[0x800 + i] = val);

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
    ram,
    rom: [
        '0001000000000010', // LOAD 2
        '0001000000000001', // LOAD 1
        '0011000000000011', // ADD 3
        '0010000000000100', // STORE 4

        '0100000000000101', // SUB 5
        '0010000000001110', // STORE 14
        '0011000000000110', // ADD 6
        '0011000000000111', // ADD 7

        '0001000000001000', // LOAD 8
        '0101000000001001', // JMP 9
        '0110000000001010', // JZ 10
        '1010000000001011', // AND 11
        '1011000000001100', // OR 12
        '1100000000001101', // XOR 13

        '0000000000000000', // NOP
        '1000000000001110'  // OUT 14
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
