export class Ship {
  constructor (length = 1) {
    this.length = length;
    this.hits = 0;
  }

  get isSunk() {
    return this.hits === this.length;
  }

  hit() {
    this.hits += 1;
  }
}