import { useState } from 'react'
import PropTypes from 'prop-types'

const DiskDrive = ({ disk, onDiskRead, onDiskWrite }) => {
  const [sector, setSector] = useState(0)

  return (
    <div className="disk-component">
      <h3>Unidad de Disco</h3>
      <div className="disk-controls">
        <input
          type="number"
          min="0"
          max={disk.length - 1}
          value={sector}
          onChange={(e) => setSector(parseInt(e.target.value, 10))}
        />
        <button onClick={() => onDiskRead(sector)}>Leer Sector</button>
        <button onClick={() => onDiskWrite(sector)}>Escribir Sector</button>
      </div>
      <div className="disk-content">
        <h4>Sector {sector}:</h4>
        <div className="sector-data">
          {disk[sector] !== undefined ? disk[sector] : '---'}
        </div>
      </div>
    </div>
  )
}

DiskDrive.propTypes = {
  disk: PropTypes.array.isRequired,
  onDiskRead: PropTypes.func.isRequired,
  onDiskWrite: PropTypes.func.isRequired
}

export default DiskDrive