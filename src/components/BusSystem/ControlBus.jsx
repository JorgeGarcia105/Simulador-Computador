import PropTypes from 'prop-types'

const ControlBus = ({ signal }) => {
  return (
    <div className="bus control-bus">
      <h4>Bus de Control</h4>
      <div className="bus-signals">
        {signal && (
          <div className="signal">
            {signal}
          </div>
        )}
      </div>
    </div>
  )
}

ControlBus.propTypes = {
  signal: PropTypes.string
}

export default ControlBus