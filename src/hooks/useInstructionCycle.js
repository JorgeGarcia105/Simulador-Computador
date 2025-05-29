import { toBinary } from '../utils/binaryUtils';
import { decodeInstruction } from '../utils/decodeUtils';

const useInstructionCycle = (systemState, setSystemState, handleOutput) => {
  const step = () => {
    const { registers, flags } = systemState.cpu;
    const { rom } = systemState.memory;

    const pc = parseInt(registers.PC, 2);
    const instruction = rom[pc];

    if (!instruction) {
      handleOutput('text', `🚫 Instrucción no encontrada en ROM en la dirección ${pc}`);
      return;
    }

    const decoded = decodeInstruction(instruction);

    handleOutput('text', `▶️ Ejecutando instrucción en PC=${pc}: ${instruction}
🧠 Decodificada como: ${JSON.stringify(decoded)}`);

    // Aquí va la lógica para ejecutar la instrucción real.
    // Por ahora simulamos un paso con PC++
    const nextPC = toBinary(pc + 1, registers.PC.length);

    setSystemState(prev => ({
      ...prev,
      cpu: {
        ...prev.cpu,
        registers: {
          ...prev.cpu.registers,
          PC: nextPC,
        },
        flags: { ...flags }, // si se modifican flags, hacerlo aquí
      }
    }));
  };

  return { step };
};

export default useInstructionCycle;
