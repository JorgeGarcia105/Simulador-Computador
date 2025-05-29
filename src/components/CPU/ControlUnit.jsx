import React from 'react';
import './cpu.css';

const ControlUnit = ({ currentStep }) => {
  const steps = {
    fetch: 'Fetch (Búsqueda)',
    decode: 'Decode (Decodificación)',
    execute: 'Execute (Ejecución)',
    interrupt: 'Interrupción',
    halt: 'Detenido'
  };

  return (
    <div className="control-unit">
      <h3>Unidad de Control</h3>
      <div className="control-signals">
        {Object.keys(steps).map((step) => (
          <div key={step} className={`signal ${currentStep === step ? 'active' : ''}`}>
            {steps[step]}
          </div>
        ))}
      </div>

      <div className="micro-operations">
        <h4>Micro-operaciones:</h4>
        <ul>
          {currentStep === 'fetch' && (
            <>
              <li>MAR ← PC (Cargar dirección del PC a MAR)</li>
              <li>MBR ← Memoria[MAR] (Cargar la memoria en MBR desde la dirección MAR)</li>
              <li>IR ← MBR (Cargar el valor de MBR en el registro IR)</li>
              <li>PC ← PC + 1 (Incrementar el valor de PC en 1)</li>
            </>
          )}
          {currentStep === 'decode' && (
            <>
              <li>Decodificar instrucción en IR (Interpretar la instrucción en IR)</li>
              <li>Obtener operandos (Si es necesario, cargar operandos desde memoria)</li>
            </>
          )}
          {currentStep === 'execute' && (
            <>
              <li>Ejecutar operación según IR (Ejecutar la operación definida por IR)</li>
              <li>Actualizar registros según el resultado de la operación</li>
              <li>Si hay acceso a memoria, realizar las operaciones necesarias (lectura/escritura)</li>
            </>
          )}
          {currentStep === 'interrupt' && (
            <>
              <li>Manejar interrupción (Si hay interrupción, procesar la interrupción)</li>
              <li>Guardar estado actual (Si es necesario, guardar el estado de los registros)</li>
              <li>Actualizar PC y registros de control</li>
            </>
          )}
          {currentStep === 'halt' && (
            <>
              <li>Detener CPU (Poner la CPU en un estado de paro)</li>
              <li>Deshabilitar operaciones (Desactivar las señales de control)</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ControlUnit;
