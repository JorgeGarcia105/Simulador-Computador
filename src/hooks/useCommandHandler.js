import { fromBinary, toBinary, ADDRESS_SIZE } from '../utils/binaryUtils';

export const useCommandHandler = (systemState, setSystemState) => {
  const handleOutput = (type, content) => {
    setSystemState(prev => {
      const newOutput = { ...prev.io.output };
      if (type === 'clear') {
        return {
          ...prev,
          io: { ...prev.io, output: { text: 'Consola limpiada', program: null, memoryDump: null } }
        };
      }
      if (type in newOutput) newOutput[type] = content;
      return { ...prev, io: { ...prev.io, output: newOutput } };
    });
  };

  const handleInput = (input) => {
    const trimmedInput = input.trim().toLowerCase();

    // Comando "help"
    if (trimmedInput === 'help') {
      handleOutput('text', `📘 Comandos disponibles:
- mem [dir]: muestra contenido de memoria
- reg: muestra registros del CPU
- run: ejecuta el programa
- step: ejecuta un paso
- reset: reinicia CPU
- reset-all: reinicia CPU y memoria
- save [dir] [valor]: guarda valor en memoria
- clear: limpia la consola`);
      return;
    }

    // Comando "clear"
    if (trimmedInput === 'clear') {
      handleOutput('clear');
      return;
    }

    // Comando "reg"
    if (trimmedInput === 'reg') {
      const { registers } = systemState.cpu;
      let output = '📟 Registros del CPU:\n';
      for (const [key, value] of Object.entries(registers)) {
        output += `- ${key}: ${value} (${fromBinary(value)})\n`;
      }
      handleOutput('text', output);
      return;
    }

    // Comando "mem [dir]"
    const memMatch = trimmedInput.match(/^mem\s+(\d{1,3})$/);
    if (memMatch) {
      const dir = parseInt(memMatch[1]);
      if (dir >= 0 && dir < 2 ** ADDRESS_SIZE) {
        const binDir = toBinary(dir, ADDRESS_SIZE);
        const value = systemState.memory.ram[dir];
        handleOutput('text', `📦 Memoria[${dir}] (${binDir}): ${value} (${fromBinary(value)})`);
      } else {
        handleOutput('text', '❌ Dirección fuera de rango (0-255)');
      }
      return;
    }

    // Comando "save [dir] [valor]"
    const saveMatch = trimmedInput.match(/^save\s+(\d{1,3})\s+(\d{1,3})$/);
    if (saveMatch) {
      const dir = parseInt(saveMatch[1]);
      const val = parseInt(saveMatch[2]);
      if (dir >= 0 && dir < 256 && val >= 0 && val < 256) {
        const binaryVal = toBinary(val);
        setSystemState(prev => {
          const newRAM = [...prev.memory.ram];
          newRAM[dir] = binaryVal;
          localStorage.setItem('simulator_ram_data', JSON.stringify(newRAM));
          return {
            ...prev,
            memory: { ...prev.memory, ram: newRAM }
          };
        });
        handleOutput('text', `✅ Guardado ${val} (${binaryVal}) en memoria[${dir}]`);
      } else {
        handleOutput('text', '❌ Dirección o valor fuera de rango (0-255)');
      }
      return;
    }

    // Comando no reconocido
    handleOutput('text', `❓ Comando no reconocido: "${input}"\nEscribe "help" para ver la lista de comandos.`);
  };

  return { handleInput, handleOutput };
};
