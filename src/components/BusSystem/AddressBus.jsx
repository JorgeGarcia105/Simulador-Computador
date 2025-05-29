import PropTypes from 'prop-types'

const AddressBus = ({ value, active }) => {
  // Muestra el valor en binario, con padding según el tamaño del bus
  const binValue = value
    ? value.padStart(12, '0') // Ajusta 12 si tu bus es de otro tamaño
    : '---';

  return (
    <div className={`bus address-bus ${active ? 'active' : ''}`}>
      <h4>Bus de Direcciones</h4>
      <div className="bus-value">
        {binValue}
      </div>
      <div className="bus-animation"></div>
    </div>
  )
}

AddressBus.propTypes = {
  value: PropTypes.string, // String binario
  active: PropTypes.bool
}

export default AddressBus