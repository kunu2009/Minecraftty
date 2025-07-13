class World {
  constructor() {
    this.chunks = new Map();
    this.chunkSize = 16;
    this.worldHeight = 64;
  }

  generate() {
    // Generate initial chunks around spawn
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        this.generateChunk(x, z);
      }
    }
  }

  generateChunk(chunkX, chunkZ) {
    const chunk = {};
    const key = `${chunkX},${chunkZ}`;
    
    for (let x = 0; x < this.chunkSize; x++) {
      for (let z = 0; z < this.chunkSize; z++) {
        const worldX = chunkX * this.chunkSize + x;
        const worldZ = chunkZ * this.chunkSize + z;
        
        // Simple terrain generation
        const height = this.getTerrainHeight(worldX, worldZ);
        
        for (let y = 0; y < this.worldHeight; y++) {
          const blockKey = `${x},${y},${z}`;
          
          if (y < height - 3) {
            chunk[blockKey] = 'stone';
          } else if (y < height - 1) {
            chunk[blockKey] = 'dirt';
          } else if (y < height) {
            chunk[blockKey] = 'grass';
          } else if (y < 32) {
            chunk[blockKey] = 'water';
          }
          
          // Add some ores randomly
          if (y < height - 5 && Math.random() < 0.02) {
            if (Math.random() < 0.1) {
              chunk[blockKey] = 'coal';
            } else if (Math.random() < 0.05) {
              chunk[blockKey] = 'iron';
            } else if (Math.random() < 0.01) {
              chunk[blockKey] = 'gold';
            } else if (Math.random() < 0.005) {
              chunk[blockKey] = 'diamond';
            }
          }
        }
        
        // Add trees occasionally
        if (height > 32 && Math.random() < 0.05) {
          this.generateTree(chunk, x, height, z, chunkX, chunkZ);
        }
      }
    }
    
    this.chunks.set(key, chunk);
  }

  generateTree(chunk, x, baseY, z, chunkX, chunkZ) {
    const treeHeight = 4 + Math.floor(Math.random() * 3);
    
    // Tree trunk
    for (let y = 0; y < treeHeight; y++) {
      const blockKey = `${x},${baseY + y},${z}`;
      chunk[blockKey] = 'wood';
    }
    
    // Tree leaves
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        for (let dy = 0; dy < 3; dy++) {
          if (Math.abs(dx) + Math.abs(dz) <= 2) {
            const leafX = x + dx;
            const leafZ = z + dz;
            const leafY = baseY + treeHeight + dy;
            
            if (leafX >= 0 && leafX < this.chunkSize && 
                leafZ >= 0 && leafZ < this.chunkSize) {
              const blockKey = `${leafX},${leafY},${leafZ}`;
              if (Math.random() < 0.8) {
                chunk[blockKey] = 'leaves';
              }
            }
          }
        }
      }
    }
  }

  getTerrainHeight(x, z) {
    // Simple noise-like function for terrain height
    const noise1 = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5;
    const noise2 = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 10;
    const noise3 = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 3;
    
    return Math.floor(35 + noise1 + noise2 + noise3);
  }

  getBlock(x, y, z) {
    if (y < 0 || y >= this.worldHeight) return null;
    
    const chunkX = Math.floor(x / this.chunkSize);
    const chunkZ = Math.floor(z / this.chunkSize);
    const key = `${chunkX},${chunkZ}`;
    
    const chunk = this.chunks.get(key);
    if (!chunk) {
      this.generateChunk(chunkX, chunkZ);
      return this.getBlock(x, y, z);
    }
    
    const localX = ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const localZ = ((z % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const blockKey = `${localX},${y},${localZ}`;
    
    return chunk[blockKey] || null;
  }

  setBlock(x, y, z, blockType) {
    if (y < 0 || y >= this.worldHeight) return;
    
    const chunkX = Math.floor(x / this.chunkSize);
    const chunkZ = Math.floor(z / this.chunkSize);
    const key = `${chunkX},${chunkZ}`;
    
    let chunk = this.chunks.get(key);
    if (!chunk) {
      this.generateChunk(chunkX, chunkZ);
      chunk = this.chunks.get(key);
    }
    
    const localX = ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const localZ = ((z % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const blockKey = `${localX},${y},${localZ}`;
    
    if (blockType) {
      chunk[blockKey] = blockType;
    } else {
      delete chunk[blockKey];
    }
  }

  getVisibleChunks(playerX, playerZ, renderDistance = 3) {
    const playerChunkX = Math.floor(playerX / this.chunkSize);
    const playerChunkZ = Math.floor(playerZ / this.chunkSize);
    
    const visibleChunks = [];
    
    for (let x = playerChunkX - renderDistance; x <= playerChunkX + renderDistance; x++) {
      for (let z = playerChunkZ - renderDistance; z <= playerChunkZ + renderDistance; z++) {
        const key = `${x},${z}`;
        let chunk = this.chunks.get(key);
        
        if (!chunk) {
          this.generateChunk(x, z);
          chunk = this.chunks.get(key);
        }
        
        visibleChunks.push({
          x, z, chunk,
          worldX: x * this.chunkSize,
          worldZ: z * this.chunkSize
        });
      }
    }
    
    return visibleChunks;
  }
}

export default World;