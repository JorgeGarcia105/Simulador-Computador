import { useState } from 'react';

// Utility function to convert binary to decimal
const fromBinary = (binaryString) => parseInt(binaryString, 2);

const MemoryPanel = ({ ram, rom, currentAddress, onMemoryChange, systemState }) => {
  const [activeTab, setActiveTab] = useState('ram');
  const [editAddress, setEditAddress] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (address, currentValue) => {
    setEditAddress(address);
    setEditValue(currentValue);
  };

  const handleSave = (address) => {
    onMemoryChange(address, editValue);
    setEditAddress(null);
  };

  return (
    <div className="memory-panel">
      <div className="memory-tabs">
        <button 
          className={activeTab === 'ram' ? 'active' : ''}
          onClick={() => setActiveTab('ram')}
        >
          RAM
        </button>
        <button 
          className={activeTab === 'rom' ? 'active' : ''}
          onClick={() => setActiveTab('rom')}
        >
          ROM
        </button>
      </div>

      <div className="memory-view">
        {activeTab === 'ram' ? (
          <div className="ram-grid">
            {ram.map((value, address) => (
              <div 
                key={address} 
                className={`memory-cell ${address === fromBinary(currentAddress) ? 'active' : ''}`}
              >
                <div className="address-label">0x{address.toString(16).padStart(2, '0')}</div>
                {editAddress === address ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="memory-value"
                    />
                    <button onClick={() => handleSave(address)}>Guardar</button>
                  </>
                ) : (
                  <>
                    <div className="memory-value">{value}</div>
                    <button onClick={() => handleEdit(address, value)}>Editar</button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rom-grid">
            {rom.map((instruction, address) => (
              <div 
                key={address} 
                className={`memory-cell ${address === fromBinary(systemState.cpu.registers.PC) ? 'active' : ''}`}
              >
                <div className="address-label">0x{address.toString(16).padStart(2, '0')}</div>
                <div className="memory-value">{instruction}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPanel;