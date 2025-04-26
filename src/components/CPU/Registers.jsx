const Registers = ({ registers }) => {
  return (
    <div className="registers">
      <h3>Registros del CPU</h3>
      <table>
        <tbody>
          {Object.entries(registers).map(([name, value]) => (
            <tr key={name}>
              <td>{name}:</td>
              <td>
                <span className="hex-value">
                  0x{value.toString(16).padStart(4, '0').toUpperCase()}
                </span>
                <span className="dec-value">
                  ({value})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Registers