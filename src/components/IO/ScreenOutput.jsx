import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ScreenOutput = ({ text, program, memoryDump, onClear }) => {
  const outputEndRef = useRef(null);

  // Auto-scroll al final
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [text, program, memoryDump]);

  const formatValue = (value) => {
    if (value === undefined || value === null) return 'null';
    return `Dec:${value} Hex:0x${value.toString(16).padStart(2, '0').toUpperCase()}`;
  };

  return (
    <div className="screen-output">
      <div className="screen-header">
        <h3>Salida del Sistema</h3>
        <button onClick={onClear} className="clear-btn">
          Limpiar
        </button>
      </div>
      
      <div className="output-container">
        {/* Salida de texto */}
        {text && (
          <div className="text-output">
            <div className="output-line">{text}</div>
          </div>
        )}

        {/* Salida de programa */}
        {program && (
          <div className="program-output">
            <h4>Programa Cargado:</h4>
            {program.map((line, index) => (
              <div key={index} className="program-line">
                <span className="line-number">{index}.</span>
                <span className="instruction">{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* Volcado de memoria */}
        {memoryDump && (
          <div className="memory-output">
            <h4>Memoria:</h4>
            <div className="memory-grid">
              {memoryDump.map((value, addr) => (
                <div key={addr} className="memory-cell">
                  <span className="address">0x{addr.toString(16).padStart(2, '0')}:</span>
                  <span className="value">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={outputEndRef} />
      </div>
    </div>
  );
};

ScreenOutput.propTypes = {
  text: PropTypes.string,
  program: PropTypes.array,
  memoryDump: PropTypes.array,
  onClear: PropTypes.func.isRequired
};

export default ScreenOutput;