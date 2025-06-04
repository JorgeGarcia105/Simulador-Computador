export const INSTRUCTION_SET = {
  '0000': {
    name: 'NOP',
    description: 'No realiza ninguna operación. Es útil para introducir retardos o alineación de instrucciones.'
  },
  '0001': {
    name: 'LOAD',
    description: 'Carga en el acumulador (ACC) el valor contenido en la dirección de memoria especificada.'
  },
  '0010': {
    name: 'STORE',
    description: 'Almacena el contenido del acumulador (ACC) en la dirección de memoria especificada.'
  },
  '0011': {
    name: 'ADD',
    description: 'Suma al contenido del acumulador (ACC) el valor de la dirección de memoria especificada.'
  },
  '0100': {
    name: 'SUB',
    description: 'Resta al acumulador (ACC) el valor que se encuentra en la dirección de memoria especificada.'
  },
  '0101': {
    name: 'JMP',
    description: 'Salta a la instrucción ubicada en la dirección especificada, sin condición. Modifica directamente el contador de programa (PC).'
  },
  '0110': {
    name: 'JZ',
    description: 'Salta a la dirección especificada si el resultado anterior fue cero (Z=1 en el registro de banderas).'
  },
  '0111': {
    name: 'JC',
    description: 'Salta a la dirección especificada si la operación anterior generó un acarreo (C=1 en el registro de banderas).'
  },
  '1000': {
    name: 'OUT',
    description: 'Envía el contenido actual del acumulador (ACC) hacia el dispositivo de salida (por ejemplo, consola o pantalla).'
  },
  '1001': {
    name: 'IN',
    description: 'Lee un valor desde el dispositivo de entrada y lo almacena en el acumulador (ACC).'
  },
  '1010': {
    name: 'AND',
    description: 'Realiza una operación lógica AND entre el contenido del acumulador (ACC) y un valor de memoria.'
  },
  '1011': {
    name: 'OR',
    description: 'Realiza una operación lógica OR entre el contenido del acumulador (ACC) y un valor de memoria.'
  },
  '1100': {
    name: 'XOR',
    description: 'Realiza una operación lógica XOR entre el acumulador (ACC) y un valor de memoria.'
  },
  '1101': {
    name: 'NOT',
    description: 'Invierte (niega) todos los bits del acumulador (ACC). Operación unaria.'
  },
  '1110': {
    name: 'SHL',
    description: 'Desplaza a la izquierda los bits del acumulador (ACC) una posición. Equivale a una multiplicación por 2.'
  },
  '1111': {
    name: 'SHR',
    description: 'Desplaza a la derecha los bits del acumulador (ACC) una posición. Equivale a una división por 2 sin signo.'
  }
};


const InstructionSet = () => {
	return (
		<div className="instruction-set">
			<h5 className="instru">Conjunto de Instrucciones</h5>
			<table>
				<thead>
					<tr>
						<th>Opcode</th>
						<th>Instrucción</th>
						<th>Descripción</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(INSTRUCTION_SET)
    .sort(([a], [b]) => parseInt(a, 2) - parseInt(b, 2)) // Ordena por valor binario ascendente
    .map(([opcode, { name, description }]) => (
      <tr key={opcode}>
        <td>{opcode}</td>
        <td>{name}</td>
        <td>{description}</td>
      </tr>
    ))}
				</tbody>
			</table>
		</div>
	);
};

export default InstructionSet;
