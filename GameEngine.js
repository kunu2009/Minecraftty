import World from './World';
import Player from './Player';
import Renderer from './Renderer';
import Physics from './Physics';

class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.world = new World();
    this.player = new Player();
    this.renderer = new Renderer(this.ctx, this.canvas);
    this.physics = new Physics();
    
    this.isRunning = false;
    this.lastTime = 0;
    this.selectedBlock = 'grass';
    
    this.touchStart = { x: 0, y: 0 };
    this.lastTouch = { x: 0, y: 0 };
    this.isLooking = false;
    
    // Bind the gameLoop method to this instance
    this.gameLoop = this.gameLoop.bind(this);
  }

  init() {
    this.world.generate();
    this.isRunning = true;
    this.gameLoop();
  }

  gameLoop(currentTime = 0) {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime) {
    this.physics.update(this.player, this.world, deltaTime);
  }

  render() {
    this.renderer.render(this.world, this.player);
  }

  updateMovement(movement) {
    this.player.movement = movement;
  }

  handleTouch(x, y, type) {
    if (type === 'touchstart') {
      this.touchStart = { x, y };
      this.lastTouch = { x, y };
      this.isLooking = true;
    } else if (type === 'touchmove' && this.isLooking) {
      const deltaX = x - this.lastTouch.x;
      const deltaY = y - this.lastTouch.y;
      
      this.player.rotation.y -= deltaX * 0.005;
      this.player.rotation.x -= deltaY * 0.005;
      
      // Clamp vertical rotation
      this.player.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.player.rotation.x));
      
      this.lastTouch = { x, y };
    } else if (type === 'touchend') {
      this.isLooking = false;
      
      // Check if it was a tap (short touch with minimal movement)
      const touchDistance = Math.sqrt(
        Math.pow(x - this.touchStart.x, 2) + Math.pow(y - this.touchStart.y, 2)
      );
      
      if (touchDistance < 10) {
        // It was a tap, place or break block
        this.handleTap(x, y);
      }
    }
  }

  handleTap(x, y) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // If tap is near center, interact with block
    if (Math.abs(x - centerX) < 50 && Math.abs(y - centerY) < 50) {
      this.placeBlock();
    }
  }

  placeBlock() {
    const raycast = this.castRay();
    if (raycast.hit && raycast.distance < 5) {
      const placePos = {
        x: raycast.position.x + raycast.normal.x,
        y: raycast.position.y + raycast.normal.y,
        z: raycast.position.z + raycast.normal.z
      };
      
      // Don't place block inside player
      const playerPos = this.player.position;
      const dx = Math.abs(placePos.x - Math.floor(playerPos.x));
      const dy = Math.abs(placePos.y - Math.floor(playerPos.y));
      const dz = Math.abs(placePos.z - Math.floor(playerPos.z));
      
      if (dx > 0.1 || dy > 0.1 || dz > 0.1) {
        this.world.setBlock(placePos.x, placePos.y, placePos.z, this.selectedBlock);
      }
    }
  }

  breakBlock() {
    const raycast = this.castRay();
    if (raycast.hit && raycast.distance < 5) {
      this.world.setBlock(raycast.position.x, raycast.position.y, raycast.position.z, null);
    }
  }

  jump() {
    if (this.player.onGround) {
      this.player.velocity.y = 8;
      this.player.onGround = false;
    }
  }

  setSelectedBlock(blockType) {
    this.selectedBlock = blockType;
  }

  castRay() {
    const start = this.player.position;
    const direction = {
      x: Math.sin(this.player.rotation.y) * Math.cos(this.player.rotation.x),
      y: -Math.sin(this.player.rotation.x),
      z: Math.cos(this.player.rotation.y) * Math.cos(this.player.rotation.x)
    };

    const step = 0.1;
    const maxDistance = 8;
    
    for (let d = 0; d < maxDistance; d += step) {
      const pos = {
        x: Math.floor(start.x + direction.x * d),
        y: Math.floor(start.y + direction.y * d),
        z: Math.floor(start.z + direction.z * d)
      };

      const block = this.world.getBlock(pos.x, pos.y, pos.z);
      if (block) {
        return {
          hit: true,
          position: pos,
          distance: d,
          normal: this.calculateNormal(start, pos, direction)
        };
      }
    }

    return { hit: false, distance: maxDistance };
  }

  calculateNormal(start, blockPos, direction) {
    const relativePos = {
      x: (start.x + direction.x * 0.1) - blockPos.x,
      y: (start.y + direction.y * 0.1) - blockPos.y,
      z: (start.z + direction.z * 0.1) - blockPos.z
    };

    const absX = Math.abs(relativePos.x - 0.5);
    const absY = Math.abs(relativePos.y - 0.5);
    const absZ = Math.abs(relativePos.z - 0.5);

    if (absX > absY && absX > absZ) {
      return { x: relativePos.x > 0.5 ? 1 : -1, y: 0, z: 0 };
    } else if (absY > absZ) {
      return { x: 0, y: relativePos.y > 0.5 ? 1 : -1, z: 0 };
    } else {
      return { x: 0, y: 0, z: relativePos.z > 0.5 ? 1 : -1 };
    }
  }

  cleanup() {
    this.isRunning = false;
  }
}

export default GameEngine;