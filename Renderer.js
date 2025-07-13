class Renderer {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.fov = Math.PI / 3; // 60 degrees
    this.renderDistance = 100;
    this.blockColors = {
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
  }

  render(world, player) {
    this.clearScreen();
    this.renderSky();
    this.renderWorld(world, player);
  }

  clearScreen() {
    this.ctx.fillStyle = '#87CEEB'; // Sky blue
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderSky() {
    // Simple gradient sky
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderWorld(world, player) {
    const visibleChunks = world.getVisibleChunks(player.position.x, player.position.z, 2);
    const blocksToRender = [];
    
    // Collect all visible blocks
    visibleChunks.forEach(chunkInfo => {
      Object.keys(chunkInfo.chunk).forEach(blockKey => {
        const [localX, y, localZ] = blockKey.split(',').map(Number);
        const worldX = chunkInfo.worldX + localX;
        const worldZ = chunkInfo.worldZ + localZ;
        const blockType = chunkInfo.chunk[blockKey];
        
        const distance = this.getDistance(player.position, { x: worldX, y, z: worldZ });
        if (distance < this.renderDistance) {
          blocksToRender.push({
            x: worldX,
            y: y,
            z: worldZ,
            type: blockType,
            distance: distance
          });
        }
      });
    });
    
    // Sort blocks by distance (far to near)
    blocksToRender.sort((a, b) => b.distance - a.distance);
    
    // Render each block
    blocksToRender.forEach(block => {
      this.renderBlock(block, player);
    });
  }

  renderBlock(block, player) {
    const screenPos = this.worldToScreen(block, player);
    if (!screenPos.visible) return;
    
    const color = this.blockColors[block.type] || '#999999';
    const size = Math.max(1, screenPos.size);
    
    // Add some shading based on distance
    const shade = Math.max(0.3, 1 - (block.distance / this.renderDistance));
    const shadedColor = this.shadeColor(color, shade);
    
    this.ctx.fillStyle = shadedColor;
    this.ctx.fillRect(
      screenPos.x - size/2, 
      screenPos.y - size/2, 
      size, 
      size
    );
    
    // Add simple block outline for better visibility
    if (size > 4) {
      this.ctx.strokeStyle = this.shadeColor(color, shade * 0.7);
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(
        screenPos.x - size/2, 
        screenPos.y - size/2, 
        size, 
        size
      );
    }
  }

  worldToScreen(block, player) {
    // Transform world coordinates to camera space
    const dx = block.x + 0.5 - player.position.x;
    const dy = block.y + 0.5 - player.position.y - 0.9; // Eye level
    const dz = block.z + 0.5 - player.position.z;
    
    // Rotate around Y axis (yaw)
    const cosY = Math.cos(-player.rotation.y);
    const sinY = Math.sin(-player.rotation.y);
    const x1 = dx * cosY - dz * sinY;
    const z1 = dx * sinY + dz * cosY;
    
    // Rotate around X axis (pitch)
    const cosX = Math.cos(-player.rotation.x);
    const sinX = Math.sin(-player.rotation.x);
    const y1 = dy * cosX - z1 * sinX;
    const z2 = dy * sinX + z1 * cosX;
    
    // Check if block is behind camera
    if (z2 <= 0.1) {
      return { visible: false };
    }
    
    // Project to screen coordinates
    const fovScale = this.canvas.height / (2 * Math.tan(this.fov / 2));
    const screenX = this.canvas.width / 2 + (x1 / z2) * fovScale;
    const screenY = this.canvas.height / 2 - (y1 / z2) * fovScale;
    
    // Calculate block size based on distance
    const blockSize = (fovScale / z2) * 0.8;
    
    return {
      visible: true,
      x: screenX,
      y: screenY,
      size: blockSize,
      distance: z2
    };
  }

  getDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  }

  shadeColor(color, factor) {
    // Convert hex to RGB, apply shading, convert back
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const shadedR = Math.floor(r * factor);
    const shadedG = Math.floor(g * factor);
    const shadedB = Math.floor(b * factor);
    
    return `rgb(${shadedR}, ${shadedG}, ${shadedB})`;
  }
}

export default Renderer;