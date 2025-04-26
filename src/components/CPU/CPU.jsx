import ALU from './ALU'
import Registers from './Registers'
import ControlUnit from './ControlUnit'

const CPU = ({ state, currentStep }) => {
  return (
    <div className="cpu">
      <h2>Unidad Central de Procesamiento (CPU)</h2>
      <div className="cpu-components">
        <Registers registers={state.registers} />
        <ALU operation={state.alu.operation} result={state.alu.result} />
        <ControlUnit currentStep={currentStep} />
      </div>
    </div>
  )
}

export default CPU