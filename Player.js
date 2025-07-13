class Player {
  constructor() {
    this.position = { x: 0, y: 40, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0 };
    this.movement = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };
    this.onGround = false;
    this.speed = 4;
    this.height = 1.8;
    this.width = 0.6;
  }

  getForwardVector() {
    return {
      x: Math.sin(this.rotation.y),
      z: Math.cos(this.rotation.y)
    };
  }

  getRightVector() {
    return {
      x: Math.cos(this.rotation.y),
      z: -Math.sin(this.rotation.y)
    };
  }

  getBoundingBox() {
    const halfWidth = this.width / 2;
    return {
      minX: this.position.x - halfWidth,
      maxX: this.position.x + halfWidth,
      minY: this.position.y,
      maxY: this.position.y + this.height,
      minZ: this.position.z - halfWidth,
      maxZ: this.position.z + halfWidth
    };
  }
}

export default Player;