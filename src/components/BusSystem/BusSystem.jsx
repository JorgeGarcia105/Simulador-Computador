import React from 'react';
import PropTypes from 'prop-types';
import DataBus from './DataBus';
import AddressBus from './AddressBus';
import ControlBus from './ControlBus';
import './BusSystem.css';
import registers from '../CPU/Registers';

const BusSystem = ({
	dataBus = {},
	addressBus = {},
	controlBus = {},
	components = [], // Valor por defecto añadido aquí
	clockCycles = 0,
}) => {
  // Determinar conexiones activas
  const activeConnections = {
    data: dataBus.active ? `${dataBus.source || 'unknown'} → ${dataBus.target || 'unknown'}` : null,
    address: addressBus.active ? `${addressBus.source || 'cpu'} → memory` : null,
    control: controlBus.active ? `CPU → ${controlBus.currentOperation || 'operation'}` : null
  };

	return (
		<div className="bus-system">
			<h2 className="bus-system-title">Sistema de Buses</h2>
			<div className="bus-connections">
				{/* Conexión de datos */}
				<div className={`connection data-bus ${dataBus.active ? 'active' : ''}`}>
					<div className="connection-label">Bus de Datos (16 bits)</div>
					<div className="connection-path">
						{dataBus.active && (
							<div
								className="data-flow"
								style={{ '--data-value': `'${dataBus.value || '0000000000000000'}'` }}
							/>
						)}
					</div>
					<div className="connection-endpoints">
						<span className="endpoint cpu">CPU</span>
						<span className="endpoint memory">Memoria</span>
						<span className="endpoint io">E/S</span>
					</div>
				</div>

				{/* Conexión de direcciones */}
				<div className={`connection address-bus ${addressBus.active ? 'active' : ''}`}>
					<div className="tituloBus">Bus de Dirección (12 bits)</div>
					<div className="connection-path">
						{addressBus.active && (
							<div
								className="address-flow"
								style={{ '--address-value': `'${addressBus.value || '000000000000'}'` }}
							/>
						)}
					</div>
					<div className="connection-endpoints">
						<span className="endpoint cpu">CPU</span>
						<span className="endpoint memory">Memoria</span>
					</div>
				</div>

				{/* Conexión de control */}
				<div className={`connection control-bus ${controlBus.active ? 'active' : ''}`}>
					<div className="connection-label">Bus de Control (4 bits)</div>
					<div className="connection-path">
						{controlBus.active && (
							<div
								className="control-flow"
								style={{ '--control-value': `'${controlBus.value || '0000'}'` }}
							/>
						)}
					</div>
					<div className="connection-endpoints">
						<span className="endpoint cpu">CPU</span>
						<span className="endpoint memory">Memoria</span>
						<span className="endpoint io">E/S</span>
					</div>
				</div>
			</div>

      {/* Visualización de buses individuales */}
      <div className="bus-components">
        <DataBus 
          value={dataBus.value || '0000000000000000'} 
          active={dataBus.active || false}
          connection={activeConnections.data}
          clockCycles={clockCycles}
        />
        <AddressBus 
          value={addressBus.value || '000000000000'}
          active={addressBus.active || false}
          connection={activeConnections.address}
          clockCycles={clockCycles}
        />
        <ControlBus 
          value={controlBus.value || '0000'}
          active={controlBus.active || false}
          operation={controlBus.currentOperation}
          connection={activeConnections.control}
          clockCycles={clockCycles}
        />
      </div>

			{/* Visualización de componentes conectados */}
			<div className="connected-components">
				<h3>Componentes Conectados</h3>
				<div className="components-grid">
					{components.map((comp, index) => (
						<div key={index} className={`component ${comp.active ? 'active' : ''}`}>
							<div className="component-icon">{comp.icon || '💻'}</div>
							<div className="component-name">{comp.name}</div>
							<div className="component-status">
								{comp.active ? '🟢 Activo' : '⚪ Inactivo'}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

BusSystem.propTypes = {
	dataBus: PropTypes.shape({
		value: PropTypes.string,
		active: PropTypes.bool,
		source: PropTypes.string,
		target: PropTypes.string,
	}),
	addressBus: PropTypes.shape({
		value: PropTypes.string,
		active: PropTypes.bool,
		source: PropTypes.string,
	}),
	controlBus: PropTypes.shape({
		value: PropTypes.string,
		active: PropTypes.bool,
		source: PropTypes.string,
		currentOperation: PropTypes.string,
	}),
	components: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			active: PropTypes.bool,
			icon: PropTypes.string,
		})
	),
	clockCycles: PropTypes.number,
};

BusSystem.defaultProps = {
	dataBus: {
		value: '0000000000000000',
		active: false,
		source: null,
		target: null,
	},
	addressBus: {
		value: '000000000000',
		active: false,
		source: 'cpu',
	},
	controlBus: {
		value: '0000',
		active: false,
		source: 'cpu',
		currentOperation: null,
	},
	components: [],
	clockCycles: 0,
};

export default BusSystem;
