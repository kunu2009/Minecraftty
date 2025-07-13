import React from 'react';

const Inventory = ({ onBlockSelect, onClose }) => {
  const blocks = [
    { type: 'grass', name: 'Grass', color: '#7CB342' },
    { type: 'stone', name: 'Stone', color: '#666666' },
    { type: 'dirt', name: 'Dirt', color: '#8D6E63' },
    { type: 'wood', name: 'Wood', color: '#8D6E63' },
    { type: 'sand', name: 'Sand', color: '#FDD835' },
    { type: 'water', name: 'Water', color: '#2196F3' },
    { type: 'leaves', name: 'Leaves', color: '#4CAF50' },
    { type: 'coal', name: 'Coal', color: '#212121' },
    { type: 'iron', name: 'Iron', color: '#9E9E9E' },
    { type: 'gold', name: 'Gold', color: '#FFC107' },
    { type: 'diamond', name: 'Diamond', color: '#00BCD4' },
    { type: 'redstone', name: 'Redstone', color: '#F44336' }
  ];

  return (
    <div className="inventory-overlay">
      <div className="inventory-panel">
        <div className="inventory-title">Block Inventory</div>
        
        <div className="inventory-grid">
          {blocks.map((block) => (
            <div
              key={block.type}
              className="inventory-item"
              style={{ backgroundColor: block.color }}
              onClick={() => onBlockSelect(block.type)}
            >
              {block.name}
            </div>
          ))}
        </div>
        
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Inventory;