import INSTRUCTION_SET from '../components/InstructionSet';
import CPU from '../components/CPU/CPU';
import ram from '../components/Memory/RAM';

export const executeCycle = () => {
  const { registers, setRegisters, setFlags } = CPU();
  const { readMemory, writeMemory } = ram();

  // Convertir valores binarios a decimal
  const binToDec = (binStr) => parseInt(binStr, 2);
  const decToBin = (num, bits = 8) => (num >>> 0).toString(2).padStart(bits, '0');

  // Paso 1: FETCH - Obtener instrucción de memoria
  const fetchInstruction = () => {
    const pc = binToDec(registers.PC);
    registers.MAR = decToBin(pc, 12); // Usar 12 bits para direcciones
    const opcodeByte = readMemory(pc);
    
    // Leer operandos (dependiendo de la instrucción)
    let instructionWord = opcodeByte;
    let operand = '00000000';
    
    // Para instrucciones con operandos de 2 bytes
    if (opcodeByte.length === 16) {
      operand = readMemory(pc + 1);
      instructionWord += operand;
    }
    
    setRegisters({
      ...registers,
      IR: instructionWord,
      MBR: opcodeByte,
      PC: decToBin(pc + 1, 8) // Incrementar PC
    });
    
    return instructionWord;
  };

  // Paso 2: DECODE - Decodificar instrucción
  const decodeInstruction = (instructionWord) => {
    const opcode = instructionWord.slice(0, 4); // Primeros 4 bits son opcode
    const operand = instructionWord.slice(4);   // Resto son operandos
    
    const instruction = Object.values(INSTRUCTION_SET).find(
      inst => inst.opcode === opcode
    );
    
    if (!instruction) {
      console.error(`Instrucción no reconocida: ${opcode}`);
      return null;
    }
    
    return {
      ...instruction,
      operand: operand || '00000000'
    };
  };

  // Paso 3: EXECUTE - Ejecutar instrucción
  const executeInstruction = (decoded) => {
    if (!decoded) return;
    
    const pc = binToDec(registers.PC);
    const acc = binToDec(registers.ACC);
    const operandAddr = binToDec(decoded.operand);
    
    switch(decoded.opcode) {
      case '0001': // LOAD
        { registers.MAR = decoded.operand;
        const data = readMemory(operandAddr);
        setRegisters({
          ...registers,
          ACC: data,
          MBR: data,
          PC: decToBin(pc + 1, 8)
        });
        break; }
        
      case '0010': // STORE
        registers.MAR = decoded.operand;
        console.log('STORE ejecutado: ACC =', registers.ACC, '-> RAM[', operandAddr, ']');
        writeMemory(operandAddr, registers.ACC);
        setRegisters({
          ...registers,
          MBR: registers.ACC,
          PC: decToBin(pc + 1, 8)
        });
        break;
        
      case '0011': // ADD
        { registers.MAR = decoded.operand;
        const addValue = readMemory(operandAddr);
        const sum = acc + binToDec(addValue);
        
        setFlags({
          Z: sum === 0 ? '1' : '0',
          C: sum > 255 ? '1' : '0',
          S: sum & 0x80 ? '1' : '0',
          O: (acc & 0x80) === (binToDec(addValue) & 0x80) && 
             ((sum & 0x80) !== (acc & 0x80)) ? '1' : '0'
        });
        
        setRegisters({
          ...registers,
          ACC: decToBin(sum & 0xFF),
          MBR: addValue,
          PC: decToBin(pc + 1, 8)
        });
        break; }
        
      case '0100': // SUB
        { registers.MAR = decoded.operand;
        const subValue = readMemory(operandAddr);
        const diff = acc - binToDec(subValue);
        
        setFlags({
          Z: diff === 0 ? '1' : '0',
          C: diff < 0 ? '1' : '0',
          S: diff & 0x80 ? '1' : '0',
          O: (acc & 0x80) !== (binToDec(subValue) & 0x80) && 
             ((diff & 0x80) !== (acc & 0x80)) ? '1' : '0'
        });
        
        setRegisters({
          ...registers,
          ACC: decToBin(diff & 0xFF),
          MBR: subValue,
          PC: decToBin(pc + 1, 8)
        });
        break; }
        
      case '0101': // JMP
        setRegisters({
          ...registers,
          PC: decoded.operand.padStart(8, '0')
        });
        break;
        
      case '0110': // NOP
        setRegisters({
          ...registers,
          PC: decToBin(pc + 1, 8)
        });
        break;
        
      default:
        console.error(`Instrucción no implementada: ${decoded.opcode}`);
    }
  };

  // Ejecutar ciclo completo
  try {
    const instruction = fetchInstruction();
    const decoded = decodeInstruction(instruction);
    executeInstruction(decoded);
  } catch (error) {
    console.error('Error en el ciclo de instrucción:', error);
    // Manejar error (pausar ejecución, mostrar mensaje, etc.)
  }
};

// Hook personalizado para manejar la ejecución
export const useExecution = () => {
  return {
    executeCycle,
    step: executeCycle,
    reset: () => {
      const { resetCPU } = CPU();
      const { resetMemory } = ram();
      resetCPU();
      resetMemory();
    }
  };
};