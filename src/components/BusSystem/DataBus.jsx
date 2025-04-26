import PropTypes from 'prop-types'

const DataBus = ({ value, active }) => {
  return (
    <div className={`bus data-bus ${active ? 'active' : ''}`}>
      <h4>Bus de Datos</h4>
      <div className="bus-value">
        {value !== null ? `0x${value.toString(16).padStart(2, '0').toUpperCase()}` : '---'}
      </div>
      <div className="bus-animation"></div>
    </div>
  )
}

DataBus.propTypes = {
  value: PropTypes.number,
  active: PropTypes.bool
}

export default DataBus