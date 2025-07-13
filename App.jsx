import React, { useEffect, useRef, useState } from 'react';
import MinecraftGame from './components/MinecraftGame';
import MobileControls from './components/MobileControls';
import Inventory from './components/Inventory';
import './App.css';

function App() {
  const gameRef = useRef();
  const [selectedBlock, setSelectedBlock] = useState('grass');
  const [showInventory, setShowInventory] = useState(false);

  const handleMovement = (direction, isPressed) => {
    if (gameRef.current) {
      gameRef.current.handleMovement(direction, isPressed);
    }
  };

  const handleAction = (action) => {
    if (gameRef.current) {
      if (action === 'inventory') {
        setShowInventory(!showInventory);
      } else {
        gameRef.current.handleAction(action);
      }
    }
  };

  const handleBlockSelect = (blockType) => {
    setSelectedBlock(blockType);
    if (gameRef.current) {
      gameRef.current.setSelectedBlock(blockType);
    }
    setShowInventory(false);
  };

  return (
    <div className="app">
      <MinecraftGame 
        ref={gameRef} 
        selectedBlock={selectedBlock}
      />
      
      <MobileControls 
        onMovement={handleMovement}
        onAction={handleAction}
        selectedBlock={selectedBlock}
      />
      
      {showInventory && (
        <Inventory 
          onBlockSelect={handleBlockSelect}
          onClose={() => setShowInventory(false)}
        />
      )}
    </div>
  );
}

export default App;