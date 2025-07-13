import React from 'react';

const MobileControls = ({ onMovement, onAction, selectedBlock }) => {
  const handleMovementStart = (direction) => {
    onMovement(direction, true);
  };

  const handleMovementEnd = (direction) => {
    onMovement(direction, false);
  };

  const getBlockColor = (blockType) => {
    const colors = {
      grass: '#7CB342',
      stone: '#666666',
      dirt: '#8D6E63',
      wood: '#8D6E63',
      sand: '#FDD835',
      water: '#2196F3',
      leaves: '#4CAF50',
      coal: '#212121',
      iron: '#9E9E9E',
      gold: '#FFC107',
      diamond: '#00BCD4',
      redstone: '#F44336'
    };
    return colors[blockType] || '#999999';
  };

  return (
    <div className="mobile-controls">
      <div className="movement-pad">
        <button 
          className="movement-btn up"
          onTouchStart={() => handleMovementStart('forward')}
          onTouchEnd={() => handleMovementEnd('forward')}
          onMouseDown={() => handleMovementStart('forward')}
          onMouseUp={() => handleMovementEnd('forward')}
        >
          ↑
        </button>
        <button 
          className="movement-btn down"
          onTouchStart={() => handleMovementStart('backward')}
          onTouchEnd={() => handleMovementEnd('backward')}
          onMouseDown={() => handleMovementStart('backward')}
          onMouseUp={() => handleMovementEnd('backward')}
        >
          ↓
        </button>
        <button 
          className="movement-btn left"
          onTouchStart={() => handleMovementStart('left')}
          onTouchEnd={() => handleMovementEnd('left')}
          onMouseDown={() => handleMovementStart('left')}
          onMouseUp={() => handleMovementEnd('left')}
        >
          ←
        </button>
        <button 
          className="movement-btn right"
          onTouchStart={() => handleMovementStart('right')}
          onTouchEnd={() => handleMovementEnd('right')}
          onMouseDown={() => handleMovementStart('right')}
          onMouseUp={() => handleMovementEnd('right')}
        >
          →
        </button>
      </div>

      <div className="action-buttons">
        <div 
          className="selected-block"
          style={{ backgroundColor: getBlockColor(selectedBlock) }}
          onClick={() => onAction('inventory')}
        >
          {selectedBlock.toUpperCase().slice(0, 4)}
        </div>
        
        <button 
          className="action-btn"
          onClick={() => onAction('break')}
        >
          ⛏️
        </button>
        
        <button 
          className="action-btn"
          onClick={() => onAction('place')}
        >
          🧱
        </button>
        
        <button 
          className="action-btn"
          onClick={() => onAction('jump')}
        >
          ⬆️
        </button>
      </div>
    </div>
  );
};

export default MobileControls;