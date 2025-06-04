import React from 'react';
import PropTypes from 'prop-types';
import './BusSystem.css';

const ControlBus = ({ value, active, connection, clockCycles }) => {
  const formatValue = (val) => {
    if (!val || typeof val !== 'string') return '0 0 0 0';
    return val.toString().padStart(4, '0').split('').join(' ');
  };

  return (
    
    <div className={`bus control-bus ${active ? 'active' : ''}`}>
      <h3>Bus de Control {connection && `(${connection})`}</h3>
      <div className="bus-value">
        {formatValue(value)}
      </div>
      <div className="bus-details">
        <div className="bus-clock">Ciclo: {clockCycles}</div>
        <div className="bus-size">4 bits</div>
      </div>
      <div className="bus-activity">
        <div className={`activity-indicator ${active ? 'active' : ''}`} />
      </div>
      {active && (
        <div className="bus-direction">
          <span className="direction-arrow">➔</span>
          <span className="direction-label">Señal de control</span>
        </div>
      )}
    </div>
  );
};

ControlBus.propTypes = {
  value: PropTypes.string,
  active: PropTypes.bool,
  connection: PropTypes.string,
  clockCycles: PropTypes.number
};

ControlBus.defaultProps = {
  value: '0000',
  active: false,
  connection: null,
  clockCycles: 0
};

export default ControlBus;
