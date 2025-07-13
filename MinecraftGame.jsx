import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import GameEngine from '../engine/GameEngine';

const MinecraftGame = forwardRef(({ selectedBlock }, ref) => {
  const canvasRef = useRef();
  const gameEngineRef = useRef();
  const movementStateRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  useImperativeHandle(ref, () => ({
    handleMovement: (direction, isPressed) => {
      movementStateRef.current[direction] = isPressed;
      if (gameEngineRef.current) {
        gameEngineRef.current.updateMovement(movementStateRef.current);
      }
    },
    handleAction: (action) => {
      if (gameEngineRef.current) {
        if (action === 'place') {
          gameEngineRef.current.placeBlock();
        } else if (action === 'break') {
          gameEngineRef.current.breakBlock();
        } else if (action === 'jump') {
          gameEngineRef.current.jump();
        }
      }
    },
    setSelectedBlock: (blockType) => {
      if (gameEngineRef.current) {
        gameEngineRef.current.setSelectedBlock(blockType);
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameEngineRef.current = new GameEngine(canvas);
    gameEngineRef.current.init();
    gameEngineRef.current.setSelectedBlock(selectedBlock);

    const handleTouch = (e) => {
      e.preventDefault();
      if (gameEngineRef.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        gameEngineRef.current.handleTouch(x, y, e.type);
      }
    };

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', handleTouch, { passive: false });

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchend', handleTouch);
    };
  }, []);

  useEffect(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setSelectedBlock(selectedBlock);
    }
  }, [selectedBlock]);

  return (
    <>
      <canvas 
        ref={canvasRef}
        id="game-canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="crosshair" />
    </>
  );
});

MinecraftGame.displayName = 'MinecraftGame';

export default MinecraftGame;