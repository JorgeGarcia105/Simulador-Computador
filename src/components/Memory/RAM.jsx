import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './RAMViewer.css';

// Límites de memoria (12-bit addressing)
const DATA_SEGMENT_START = 0x000;  // 0
const DATA_SEGMENT_END = 0x7FF;    // 2047
const CODE_SEGMENT_START = 0x800;  // 2048
const CODE_SEGMENT_END = 0xFFF;    // 4095

const RAM = ({ 
  memory = [],
  currentAddress = null,
  onMemoryChange,
  wordSize = 8,
  isExecuting = false
}) => {
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [viewMode, setViewMode] = useState('bin'); // 'bin' o 'dec'
  const [addressFormat, setAddressFormat] = useState('bin'); // 'bin' o 'dec'

  // Formatear dirección según el modo seleccionado
  const formatAddress = (address) => {
    if (addressFormat === 'bin') {
      return address.toString(2).padStart(12, '0'); // 12 bits para MAR
    }
    return address.toString(10); // Decimal
  };

  // Formatear valor según el modo de visualización
  const formatValue = (value) => {
    const num = parseInt(value, 2);
    switch(viewMode) {
      case 'dec': return num.toString();
      default: return value.padStart(wordSize, '0');
    }
  };

  // Manejar edición de celdas
  const handleCellClick = (address) => {
    if (isExecuting && address >= CODE_SEGMENT_START) return; // Bloquear edición de código durante ejecución
    setEditMode(address);
    setEditValue(memory[address]);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editMode !== null && /^[01]+$/.test(editValue)) {
      onMemoryChange(
        editMode, 
        editValue.padStart(wordSize, '0')
      );
    }
    setEditMode(null);
  };

  // Resaltar dirección actual
  const isActiveAddress = (address) => {
    return currentAddress !== null && 
           parseInt(currentAddress, 10) === address;
  };

  // Componente celda de memoria reutilizable
  const MemoryCell = ({ address, value, isCode = false }) => (
    <div 
      className={`ram-cell 
        ${isActiveAddress(address) ? 'active' : ''} 
        ${isCode ? 'code-cell' : ''}`}
      onClick={() => handleCellClick(address)}
      title={`Dirección (bin): ${address.toString(2).padStart(12, '0')}
Dirección (dec): ${address.toString(10)}
Valor (bin): ${value.padStart(wordSize, '0')}
Valor (dec): ${parseInt(value, 2)}`}
    >
      <div className="cell-address">
        {formatAddress(address)}
      </div>
      {editMode === address ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            pattern={`[01]{1,${wordSize}}`}
            title={`Ingrese valor binario de ${wordSize} bits`}
            autoFocus
            onBlur={() => setEditMode(null)}
          />
        </form>
      ) : (
        <div className="cell-value">
          {formatValue(value)}
        </div>
      )}
      {isCode && <div className="code-label">CODE</div>}
    </div>
  );

  // Dividir memoria en segmentos
  const dataMemory = memory.slice(DATA_SEGMENT_START, DATA_SEGMENT_END + 1);
  const codeMemory = memory.slice(CODE_SEGMENT_START, CODE_SEGMENT_END + 1);

  // Generar representación binaria continua del programa (VERSIÓN CORREGIDA)
  const binaryProgramView = codeMemory.join(''); // Unir todo el segmento de código

  return (
    <div className="ram-component">
      <div className="ram-header">
        <h3>Memoria RAM (0x000 - 0xFFF)</h3>
        <div className="view-controls">
          <div>
            <span>Valor: </span>
            <button className={viewMode === 'bin' ? 'active' : ''} onClick={() => setViewMode('bin')}>
              Bin
            </button>
            <button className={viewMode === 'dec' ? 'active' : ''} onClick={() => setViewMode('dec')}>
              Dec
            </button>
          </div>
          <div>
            <span>Dirección: </span>
            <button className={addressFormat === 'bin' ? 'active' : ''} onClick={() => setAddressFormat('bin')}>
              Bin
            </button>
            <button className={addressFormat === 'dec' ? 'active' : ''} onClick={() => setAddressFormat('dec')}>
              Dec
            </button>
          </div>
        </div>
      </div>

      {/* Segmento de DATOS */}
      <div className="memory-segment">
        <h4>Segmento de Datos (0x000 - 0x7FF)</h4>
        <div className="ram-grid">
          {dataMemory.slice(0, 16).map((value, index) => (
            <MemoryCell 
              key={index}
              address={DATA_SEGMENT_START + index}
              value={value}
            />
          ))}
        </div>
      </div>

      {/* Vista Binaria Continua del Programa - VERSIÓN CORREGIDA */}
      <div className="binary-program-view">
        <h4>Programa en Binario Continuo (0x800-0xFFF)</h4>
        <div className="binary-info">
          Longitud: {binaryProgramView.length} bits | {binaryProgramView.length/8} bytes
        </div>
        <div className="binary-sequence">
          {binaryProgramView.match(/.{1,16}/g)?.map((segment, i) => (
            <div key={i} className="binary-line">
              {segment}
            </div>
          )) || '00000000'.repeat(8)}
        </div>
      </div>
    </div>
  );
};

RAM.propTypes = {
  memory: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAddress: PropTypes.number,
  onMemoryChange: PropTypes.func.isRequired,
  wordSize: PropTypes.number,
  isExecuting: PropTypes.bool
};

export default RAM;