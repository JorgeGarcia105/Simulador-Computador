export const decodeInstruction = (instruction) => {
  const opcode = instruction.substring(0, 4);
  const operand = instruction.substring(4);
  return { opcode, operand };
};
