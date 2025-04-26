import PropTypes from 'prop-types'

const AddressBus = ({ value, active }) => {
  return (
    <div className={`bus address-bus ${active ? 'active' : ''}`}>
      <h4>Bus de Direcciones</h4>
      <div className="bus-value">
        {value !== null ? `0x${value.toString(16).padStart(2, '0').toUpperCase()}` : '---'}
      </div>
      <div className="bus-animation"></div>
    </div>
  )
}

AddressBus.propTypes = {
  value: PropTypes.number,
  active: PropTypes.bool
}

export default AddressBus