import React from 'react';
import PropTypes from 'prop-types';

const BusAnimation = ({ type, value, active }) => {
  const busConfig = {
    address: { color: '#A5D6A7', label: 'Bus de Direcciones' },  // Azul más claro
    data: { color: '#1976D2', label: 'Bus de Datos' },          // Azul más oscuro
    control: { color: '#F57C00', label: 'Bus de Control' }     // Naranja más fuerte
  };

  // Verificar si 'value' es un número válido
  const formattedValue = value !== null && value !== undefined && !isNaN(value)
    ? `0x${value.toString(16).toUpperCase()}`
    : '---';

  return (
    <div className={`bus ${type}`} style={{ 
      backgroundColor: busConfig[type].color,
      opacity: active ? 1 : 0.3,
      transform: active ? 'scale(1.02)' : 'scale(1)'
    }}>
      <div className="bus-label">{busConfig[type].label}</div>
      <div className="bus-value">
        {formattedValue}
      </div>
      <div className="bus-activity" style={{ 
        visibility: active ? 'visible' : 'hidden' 
      }}></div>
    </div>
  );
};

BusAnimation.propTypes = {
  type: PropTypes.oneOf(['address', 'data', 'control']).isRequired,
  value: PropTypes.number,
  active: PropTypes.bool
};

export default BusAnimation;
