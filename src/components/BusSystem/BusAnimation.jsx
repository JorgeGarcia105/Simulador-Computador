import PropTypes from 'prop-types';

const BusAnimation = ({ 
  type, 
  value, 
  active, 
  direction = 'none',
  width = 8 
}) => {
  const busConfig = {
    address: { 
      color: '#4DD0E1', 
      label: 'Address Bus',
      width: 16
    },
    data: { 
      color: '#7986CB', 
      label: 'Data Bus',
      width: width
    },
    control: { 
      color: '#FFB74D', 
      label: 'Control Bus',
      width: 1
    }
  };

  const formatValue = (val) => {
    if (val === null || val === undefined) return '---';
    const hexLength = Math.ceil(busConfig[type].width / 4);
    return `0x${val.toString(16).padStart(hexLength, '0').toUpperCase()}`;
  };

  return (
    <div 
      className={`bus-animation ${type} ${active ? 'active' : ''} direction-${direction}`}
      style={{ 
        '--bus-color': busConfig[type].color,
        '--bus-width': `${busConfig[type].width * 10}px`
      }}
    >
      <div className="bus-label">
        {busConfig[type].label} ({busConfig[type].width} bits)
      </div>
      <div className="bus-value-container">
        <div className="bus-value">{formatValue(value)}</div>
        {direction !== 'none' && (
          <div className={`direction-indicator ${direction}`}>
            {direction === 'in' ? '⬅' : direction === 'out' ? '➡' : '⬌'}
          </div>
        )}
      </div>
      <div className="bus-activity-light" />
      <div className="bus-wire">
        {Array.from({ length: busConfig[type].width }).map((_, i) => (
          <div key={i} className="wire-bit" />
        ))}
      </div>
    </div>
  );
};

BusAnimation.propTypes = {
  type: PropTypes.oneOf(['address', 'data', 'control']).isRequired,
  value: PropTypes.number,
  active: PropTypes.bool,
  direction: PropTypes.oneOf(['in', 'out', 'none', 'bidirectional']),
  width: PropTypes.number
};

BusAnimation.defaultProps = {
  active: false,
  direction: 'none',
  width: 8
};

export default BusAnimation;