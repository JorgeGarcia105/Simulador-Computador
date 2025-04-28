import React from 'react';

const Registers = ({ registers, setRegisters }) => {
  const registerSpecs = [
    { name: 'PC', bits: 8, desc: 'Contador de Programa (8 bits)' },
    { name: 'IR', bits: 16, desc: 'Instrucción (4-bit opcode + 12-bit operand)' },
    { name: 'ACC', bits: 8, desc: 'Acumulador (8 bits)' },
    { name: 'MAR', bits: 12, desc: 'Memory Address Register (12 bits → 4KB)' },
    { name: 'MBR', bits: 8, desc: 'Memory Data Register (8 bits)' }
  ];

  const handleRegisterChange = (regName, value, bits) => {
    if (!/^[01]*$/.test(value)) return;  // Validación de solo valores binarios
    if (value.length > bits) value = value.slice(0, bits); // Limita la longitud del valor según el tamaño de bits

    setRegisters(prevRegisters => ({
      ...prevRegisters,
      [regName]: value.padStart(bits, '0') // Rellena con ceros a la izquierda si es necesario
    }));
  };

  return (
    <div className="registers">
      <h3>📊 Registros (Binario)</h3>
      {registerSpecs.map(({ name, bits, desc }) => (
        <div key={name} className="register">
          <label>
            {name} ({bits}-bit):
            <input
              type="text"
              value={registers[name] || '0'.repeat(bits)}
              onChange={(e) => handleRegisterChange(name, e.target.value, bits)}
              pattern="[01]*"
              title={desc}
            />
          </label>
          <span className="hex-value">
            Hex: 0x{parseInt(registers[name] || '0', 2).toString(16).toUpperCase()}
          </span>
          <span className="dec-value">
            Dec: {parseInt(registers[name] || '0', 2)} {/* Muestra el valor en decimal */}
          </span>
        </div>
      ))}
    </div>
  );
};


export default Registers;
