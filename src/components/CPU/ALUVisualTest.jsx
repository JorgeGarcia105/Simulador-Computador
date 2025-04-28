import React, { useState } from 'react';
import ALU from './ALU';

const ALUVisualTest = () => {
  const [operation, setOperation] = useState(null);
  const [operandA, setOperandA] = useState('00000000');
  const [operandB, setOperandB] = useState('00000000');
  const [flags, setFlags] = useState({ Z: '0', C: '0', S: '0', O: '0' });

  const handleResult = (result) => {
    console.log('Resultado ALU:', result);
    setFlags(result.flags);
  };

  const testCases = [
    { name: '5 + 3', a: '00000101', b: '00000011' },
    { name: '255 + 1', a: '11111111', b: '00000001' },
    { name: '127 + 1', a: '01111111', b: '00000001' },
    { name: '0 + 0', a: '00000000', b: '00000000' }
  ];

  return (
    <div style={{ 
      fontFamily: 'Arial', 
      maxWidth: '800px', 
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1>Prueba Visual de la ALU</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '30px'
      }}>
        {/* Componente ALU original */}
        <div style={{
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <ALU 
            operation={operation}
            operandA={operandA}
            operandB={operandB}
            flags={flags}
            onResult={handleResult}
          />
        </div>
        
        {/* Panel de control */}
        <div style={{
          border: '2px solid #2196F3',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f0f8ff'
        }}>
          <h3 style={{ marginTop: 0 }}>Controles de Prueba</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Operando A (binario):
              <input
                type="text"
                value={operandA}
                onChange={(e) => setOperandA(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px'
                }}
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Operando B (binario):
              <input
                type="text"
                value={operandB}
                onChange={(e) => setOperandB(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px'
                }}
              />
            </label>
          </div>
          
          <button
            onClick={() => setOperation('ADD')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Ejecutar ADD
          </button>  
          <button
            onClick={() => setOperation('SUB')}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            >
            Ejecutar SUB
            </button>
          <button
            onClick={() => {
              setOperation(null);
              setOperandA('00000000');
              setOperandB('00000000');
              setFlags({ Z: '0', C: '0', S: '0', O: '0' });
            }}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reiniciar
          </button>
          
          <h4 style={{ marginTop: '20px' }}>Casos de Prueba:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {testCases.map((test, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setOperation('ADD');
                    setOperandA(test.a);
                    setOperandB(test.b);
                  }}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    flex: 1
                  }}
                >
                  {test.name} (ADD)
                </button>
                <button
                  onClick={() => {
                    setOperation('SUB');
                    setOperandA(test.a);
                    setOperandB(test.b);
                  }}
                  style={{
                    backgroundColor: '#FF9800',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    flex: 1
                  }}
                >
                  {test.name} (SUB)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{
        marginTop: '30px',
        border: '2px solid #FF9800',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff8e1'
      }}>
        <h3>Debug Info</h3>
        <pre style={{
          backgroundColor: '#333',
          color: '#fff',
          padding: '15px',
          borderRadius: '4px',
          overflowX: 'auto'
        }}>
          {JSON.stringify({
            operation,
            operandA,
            operandB,
            flags,
            decimalA: parseInt(operandA, 2),
            decimalB: parseInt(operandB, 2)
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ALUVisualTest;