const ControlUnit = ({ currentStep }) => {
  const steps = {
    fetch: 'Fetch (Búsqueda)',
    decode: 'Decode (Decodificación)',
    execute: 'Execute (Ejecución)',
    interrupt: 'Interrupción',
    halt: 'Detenido'
  }

  return (
    <div className="control-unit">
      <h3>Unidad de Control</h3>
      <div className="control-signals">
        <div className={`signal ${currentStep === 'fetch' ? 'active' : ''}`}>
          {steps.fetch}
        </div>
        <div className={`signal ${currentStep === 'decode' ? 'active' : ''}`}>
          {steps.decode}
        </div>
        <div className={`signal ${currentStep === 'execute' ? 'active' : ''}`}>
          {steps.execute}
        </div>
      </div>
      <div className="micro-operations">
        <h4>Micro-operaciones:</h4>
        <ul>
          {currentStep === 'fetch' && (
            <>
              <li>MAR ← PC</li>
              <li>MBR ← Memoria[MAR]</li>
              <li>IR ← MBR</li>
              <li>PC ← PC + 1</li>
            </>
          )}
          {currentStep === 'decode' && (
            <li>Decodificar instrucción en IR</li>
          )}
          {currentStep === 'execute' && (
            <li>Ejecutar operación según IR</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ControlUnit