import React, { useState} from 'react';
import PropTypes from 'prop-types';

const RAM = ({ 
  memory = [], 
  currentAddress = null,
  onMemoryChange,
  wordSize = 8
}) => {
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [viewMode, setViewMode] = useState('bin'); // 'bin', 'dec', 'hex'
  const [highlightRange, setHighlightRange] = useState(null);

  // Manejar edición de celdas
  const handleCellClick = (address) => {
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

  // Formatear valor según modo de visualización
  const formatValue = (value) => {
    const num = parseInt(value, 2);
    switch(viewMode) {
      case 'dec': return num.toString();
      case 'hex': return `0x${num.toString(16).padStart(wordSize / 4, '0').toUpperCase()}`;
      default: return value.padStart(wordSize, '0');
    }
  };

  // Resaltar dirección actual
  const isActiveAddress = (address) => {
    return currentAddress !== null && 
           parseInt(currentAddress, 2) === address;
  };

  // Resaltar rango
  const isInHighlightRange = (address) => {
    if (!highlightRange) return false;
    return address >= highlightRange.start && address <= highlightRange.end;
  };

  return (
    <div className="ram-component">
      <div className="ram-header">
        <h3>Memoria RAM ({memory.length} celdas)</h3>
        <div className="view-controls">
          <button 
            className={viewMode === 'bin' ? 'active' : ''} 
            onClick={() => setViewMode('bin')}
          >
            Bin
          </button>
          <button 
            className={viewMode === 'dec' ? 'active' : ''} 
            onClick={() => setViewMode('dec')}
          >
            Dec
          </button>
          <button 
            className={viewMode === 'hex' ? 'active' : ''} 
            onClick={() => setViewMode('hex')}
          >
            Hex
          </button>
        </div>
      </div>

      <div className="ram-grid">
        {memory.map((value, address) => (
          <div 
            key={address} 
            className={`ram-cell 
              ${isActiveAddress(address) ? 'active' : ''} 
              ${isInHighlightRange(address) ? 'highlight' : ''}`}
            onClick={() => handleCellClick(address)}
            title={`Dirección: ${address} (0x${address.toString(16)})\nValor: ${value}`}
          >
            <div className="cell-address">
              0x{address.toString(16).padStart(2, '0').toUpperCase()}
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
          </div>
        ))}
      </div>

      <div className="ram-controls">
        <button onClick={() => setHighlightRange({ start: 0, end: 15 })}>
          Resaltar primeras 16 posiciones
        </button>
        <button onClick={() => setHighlightRange(null)}>
          Limpiar resaltado
        </button>
      </div>
    </div>
  );
};

RAM.propTypes = {
  memory: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAddress: PropTypes.string,
  onMemoryChange: PropTypes.func.isRequired,
  wordSize: PropTypes.number
};

export default RAM;
