export const INSTRUCTION_SET = {
  '0000': { name: 'NOP', description: 'No operation' }, // No operation
  '0001': { name: 'LOAD', description: 'Load from memory to ACC' }, //cargar de memoria a ACC
  '0010': { name: 'STORE', description: 'Store ACC to memory' }, // almacenar ACC en memoria
  '0011': { name: 'ADD', description: 'Add memory to ACC' }, // sumar memoria a ACC
  '0100': { name: 'SUB', description: 'Subtract memory from ACC' },
  '0101': { name: 'JMP', description: 'Jump to address' },
  '0110': { name: 'JZ', description: 'Jump if zero' },
  '0111': { name: 'JC', description: 'Jump if carry' },
  '1000': { name: 'OUT', description: 'Output ACC' },
  '1001': { name: 'IN', description: 'Input to ACC' },
  '1010': { name: 'AND', description: 'Logical AND with ACC' },
  '1011': { name: 'OR', description: 'Logical OR with ACC' },
  '1100': { name: 'XOR', description: 'Logical XOR with ACC' },
  // ... (todas las demás instrucciones)
};

const InstructionSet = () => {
  return (
    <div className="instruction-set">
      <h3>Conjunto de Instrucciones</h3>
      <table>
        <thead>
          <tr>
            <th>Opcode</th>
            <th>Instrucción</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(INSTRUCTION_SET).map(([opcode, { name, description }]) => (
            <tr key={opcode}>
              <td>{opcode}</td>
              <td>{name}</td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructionSet;