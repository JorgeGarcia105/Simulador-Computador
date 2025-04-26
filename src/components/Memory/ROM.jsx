import PropTypes from 'prop-types'

const ROM = ({ memory = [] }) => {
  if (!Array.isArray(memory)) {
    console.error('ROM: memory prop debe ser un array', memory)
    return <div>Error: Memoria no disponible</div>
  }

  return (
    <div className="rom-component">
      <h3>Memoria ROM</h3>
      <div className="memory-grid">
        {memory.map((value, address) => (
          <div key={address} className="memory-cell">
            <div className="address">0x{address.toString(16).padStart(2, '0').toUpperCase()}</div>
            <div className="memory-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

ROM.propTypes = {
  memory: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  ).isRequired
}

export default ROM