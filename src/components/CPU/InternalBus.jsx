import React from 'react';
import './InternalBus.css'; // Crea este archivo para estilos visuales

const InternalBus = ({ source, destination, value }) => (
  <div className="internal-bus">
    <span className="bus-label">Bus Interno CPU:</span>
    <span className="bus-path">
      <span className="bus-source">{source}</span>
      <span className="bus-arrow"> ➔ </span>
      <span className="bus-destination">{destination}</span>
    </span>
    <span className="bus-value">{value}</span>
  </div>
);

export default InternalBus;