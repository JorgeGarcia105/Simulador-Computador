import { useState } from 'react'
import PropTypes from 'prop-types'

const RAM = ({ memory = [], onMemoryChange }) => {
  const [activeAddress, setActiveAddress] = useState(null)

  if (!Array.isArray(memory)) {
    console.error('RAM: memory prop debe ser un array', memory)
    return <div>Error: Memoria no disponible</div>
  }

  const handleCellClick = (address) => {
    setActiveAddress(address)
  }

  const handleValueChange = (e) => {
    if (activeAddress !== null) {
      const newValue = parseInt(e.target.value, 10) || 0
      onMemoryChange(activeAddress, newValue)
    }
  }

  return (
    <div className="ram-component">
      <h3>Memoria RAM</h3>
      <div className="memory-grid">
        {memory.map((value, address) => (
          <div 
            key={address} 
            className={`memory-cell ${activeAddress === address ? 'active' : ''}`}
            onClick={() => handleCellClick(address)}
          >
            <div className="address">0x{address.toString(16).padStart(2, '0').toUpperCase()}</div>
            <input
              type="text"
              value={value}
              onChange={handleValueChange}
              className="memory-value"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

RAM.propTypes = {
  memory: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  ).isRequired,
  onMemoryChange: PropTypes.func.isRequired
}

export default RAM