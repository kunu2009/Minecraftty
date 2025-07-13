class Physics {
  constructor() {
    this.gravity = -20;
    this.terminalVelocity = -50;
  }

  update(player, world, deltaTime) {
    const dt = Math.min(deltaTime / 1000, 1/30); // Cap deltaTime
    
    this.updateMovement(player, dt);
    this.applyGravity(player, dt);
    this.handleCollisions(player, world);
  }

  updateMovement(player, deltaTime) {
    const forward = player.getForwardVector();
    const right = player.getRightVector();
    
    let moveX = 0;
    let moveZ = 0;
    
    if (player.movement.forward) {
      moveX += forward.x;
      moveZ += forward.z;
    }
    if (player.movement.backward) {
      moveX -= forward.x;
      moveZ -= forward.z;
    }
    if (player.movement.left) {
      moveX -= right.x;
      moveZ -= right.z;
    }
    if (player.movement.right) {
      moveX += right.x;
      moveZ += right.z;
    }
    
    // Normalize movement vector
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX = (moveX / length) * player.speed * deltaTime;
      moveZ = (moveZ / length) * player.speed * deltaTime;
    }
    
    player.velocity.x = moveX;
    player.velocity.z = moveZ;
  }

  applyGravity(player, deltaTime) {
    if (!player.onGround) {
      player.velocity.y += this.gravity * deltaTime;
      player.velocity.y = Math.max(player.velocity.y, this.terminalVelocity);
    }
  }

  handleCollisions(player, world) {
    const oldPos = { ...player.position };
    
    // Move horizontally first
    player.position.x += player.velocity.x;
    player.position.z += player.velocity.z;
    
    // Check horizontal collisions
    if (this.checkCollision(player, world)) {
      player.position.x = oldPos.x;
      player.position.z = oldPos.z;
    }
    
    // Move vertically
    player.position.y += player.velocity.y / 60; // Assuming 60 FPS
    
    // Check vertical collisions
    const wasOnGround = player.onGround;
    player.onGround = false;
    
    if (this.checkCollision(player, world)) {
      if (player.velocity.y < 0) {
        // Hit ground
        player.onGround = true;
        player.velocity.y = 0;
        
        // Snap to ground level
        const bbox = player.getBoundingBox();
        const groundY = Math.floor(bbox.minY) + 1;
        player.position.y = groundY;
      } else {
        // Hit ceiling
        player.velocity.y = 0;
        player.position.y = oldPos.y;
      }
    }
  }

  checkCollision(player, world) {
    const bbox = player.getBoundingBox();
    
    // Check all blocks that could intersect with player
    for (let x = Math.floor(bbox.minX); x <= Math.floor(bbox.maxX); x++) {
      for (let y = Math.floor(bbox.minY); y <= Math.floor(bbox.maxY); y++) {
        for (let z = Math.floor(bbox.minZ); z <= Math.floor(bbox.maxZ); z++) {
          const block = world.getBlock(x, y, z);
          if (block && block !== 'water') {
            // Block exists and is solid
            if (this.boxIntersectsBlock(bbox, x, y, z)) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  boxIntersectsBlock(bbox, blockX, blockY, blockZ) {
    return bbox.maxX > blockX && bbox.minX < blockX + 1 &&
           bbox.maxY > blockY && bbox.minY < blockY + 1 &&
           bbox.maxZ > blockZ && bbox.minZ < blockZ + 1;
  }
}

export default Physics;