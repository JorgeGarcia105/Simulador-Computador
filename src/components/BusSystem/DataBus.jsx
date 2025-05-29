import React from 'react';
import PropTypes from 'prop-types';
import './BusSystem.css';

const DataBus = ({ value, active, connection, clockCycles }) => {
  const formatValue = (val) => {
    if (!val || typeof val !== 'string') return '0000000000000000';
    return val.toString().padStart(16, '0').match(/.{1,4}/g).join(' ');
  };

  return (
    <div className={`bus data-bus ${active ? 'active' : ''}`}>
      <h3>Bus de Datos {connection && `(${connection})`}</h3>
      <div className="bus-value">
        {formatValue(value)}
      </div>
      <div className="bus-details">
        <div className="bus-clock">Ciclo: {clockCycles}</div>
        <div className="bus-size">16 bits</div>
      </div>
      <div className="bus-activity">
        <div className={`activity-indicator ${active ? 'active' : ''}`} />
      </div>
      {active && (
        <div className="bus-direction">
          <span className="direction-arrow">➔</span>
          <span className="direction-label">Flujo de datos</span>
        </div>
      )}
    </div>
  );
};

DataBus.propTypes = {
  value: PropTypes.string,
  active: PropTypes.bool,
  connection: PropTypes.string,
  clockCycles: PropTypes.number
};

DataBus.defaultProps = {
  value: '0000000000000000',
  active: false,
  connection: null,
  clockCycles: 0
};

export default DataBus;