const ALU = ({ operation, result }) => {
  const operations = {
    ADD: (a, b) => a + b,
    SUB: (a, b) => a - b,
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    XOR: (a, b) => a ^ b,
    NOT: (a) => ~a,
    SHL: (a) => a << 1,
    SHR: (a) => a >> 1
  }

  return (
    <div className="alu">
      <h3>Unidad Aritmético-Lógica (ALU)</h3>
      <div className="alu-operation">
        Operación: {operation || 'Ninguna'}
      </div>
      <div className="alu-result">
        Resultado: {result.toString(16).toUpperCase()}
      </div>
      <div className="alu-operations">
        {Object.keys(operations).map(op => (
          <button key={op} className="alu-btn">
            {op}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ALU