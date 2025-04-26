const InstructionSet = () => {
    const instructions = [
      { name: 'LOAD', description: 'Cargar dato de memoria a ACC' },
      { name: 'STORE', description: 'Almacenar ACC en memoria' },
      { name: 'ADD', description: 'Sumar memoria a ACC' },
      { name: 'SUB', description: 'Restar memoria a ACC' },
      { name: 'JMP', description: 'Saltar a dirección' },
      { name: 'JZ', description: 'Saltar si ACC es cero' },
      { name: 'HLT', description: 'Detener ejecución' }
    ]
  
    return (
      <div className="instruction-set">
        <h3>Conjunto de Instrucciones</h3>
        <table>
          <thead>
            <tr>
              <th>Instrucción</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((inst, index) => (
              <tr key={index}>
                <td>{inst.name}</td>
                <td>{inst.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default InstructionSet