import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './cpu.css';

const Registers = ({ 
  registers = {
    PC: '00000000',
    IR: '0000000000000000',
    ACC: '00000000',
    MAR: '000000000000',
    MBR: '00000000',
    PSW: '0000' // Asegurar valor por defecto de 4 bits
  },
  setRegisters,
  onRegisterChange
}) => {
  const [setControlSignal] = useState('0000'); // Estado para la señal de control

  const registerSpecs = [
    { name: 'PC', bits: 8, desc: 'Contador de Programa (8 bits)', readonly: false },
    { name: 'IR', bits: 16, desc: 'Instrucción (4-bit opcode + 12-bit operand)', readonly: true },
    { name: 'ACC', bits: 8, desc: 'Acumulador (8 bits)', readonly: false },
    { name: 'MAR', bits: 12, desc: 'Memory Address Register (12 bits → 4KB)', readonly: true },
    { name: 'MBR', bits: 8, desc: 'Memory Data Register (8 bits)', readonly: true },
    { name: 'PSW', bits: 4, desc: 'Program Status Word [Z,C,O,N]', readonly: false }
  ];

  const handleRegisterChange = (regName, value, bits) => {
    if (!/^[01]*$/.test(value)) return;
    const newValue = value.slice(0, bits).padStart(bits, '0');

    setRegisters(prev => ({
      ...prev,
      [regName]: newValue
    }));

    if (onRegisterChange) {
      onRegisterChange(regName, newValue);
    }

    // Aquí es donde definimos las señales de control
    if (regName === 'PC' || regName === 'IR') {
      // Ejemplo de cómo generar señales de control
      const newControlSignal = '1001'; // Por ejemplo, si se activa el PC o IR
      setControlSignal(newControlSignal);
    }
  };

  const renderFlags = () => {
    const flags = ['Zero (Z)', 'Carry (C)', 'Overflow (O)', 'Negative (N)'];
    const flagsValue = registers.FLAGS || '0000';
    return (
      <div className="psw-flags">
        {flags.map((flag, index) => (
          <div key={flag} className={`flag ${flagsValue[index] === '1' ? 'active' : ''}`}>
            <span>{flag}</span>
            <span>{flagsValue[index] || '0'}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="registers-component">
      <h3>💾 Registros del CPU</h3>
      <div className="registers-grid">
        {registerSpecs.map(({ name, bits, desc, readonly }) => (
          <div key={name} className={`register ${name === 'PSW' ? 'psw-register' : ''}`}>
            <label>
              <span className="register-name">{name}</span>
              <span className="register-bits">({bits} bits)</span>
              <input
                type="text"
                value={registers[name] || '0'.repeat(bits)}
                onChange={(e) => !readonly && handleRegisterChange(name, e.target.value, bits)}
                readOnly={readonly}
                pattern="[01]*"
                title={desc}
                className={readonly ? 'readonly' : ''}
              />
            </label>
            <div className="register-values">
              <span className="hex">
                Hex: 0x{parseInt(registers[name] || '0', 2)
                  .toString(16)
                  .toUpperCase()
                  .padStart(Math.ceil(bits/4), '0')}
              </span>
              <span className="dec">
                Dec: {parseInt(registers[name] || '0', 2)}
              </span>
            </div>
            {name === 'PSW' && renderFlags()}
          </div>
        ))}
      </div>
    </div>
  );
};

Registers.propTypes = {
  registers: PropTypes.shape({
    PC: PropTypes.string,
    IR: PropTypes.string,
    ACC: PropTypes.string,
    MAR: PropTypes.string,
    MBR: PropTypes.string,
    PSW: PropTypes.string // Asegurar que PSW sea string
  }),
  setRegisters: PropTypes.func.isRequired,
  onRegisterChange: PropTypes.func
};

export default Registers;
