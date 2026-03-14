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

export class Gameboard {
  constructor() {
    this.shotMap = new Array();
    for (let i = 0; i < 10; i++) {
      this.shotMap.push(new Array());
      for (let j = 0; j < 10; j++)  {
        this.shotMap.at(i).push(0);
      }
    }

    this.shipMap = new Array();
    for (let i = 0; i < 10; i++) {
      this.shipMap.push(new Array());
      for (let j = 0; j < 10; j++)  {
        this.shipMap.at(i).push(null);
      }
    }
  }

  placeShip(...coords) {
    const ship = new Ship(coords.length);
    for (let YXPair of coords) {
      this.shipMap[YXPair.at(0)][YXPair.at(1)] = ship;
    }
  }

  shoot(YXPair) {
    this.shotMap[YXPair.at(0)][YXPair.at(1)] = 1;
    if (this.shipMap[YXPair.at(0)][YXPair.at(1)]) this.shipMap[YXPair.at(0)][YXPair.at(1)].hit();
  }

  canShoot(YXPair) {
    return YXPair.every((coord) => coord >= 0 && coord < 10) && !this.shotMap[YXPair.at(0)][YXPair.at(1)];
  }

  get shipsAlive() {
    const ships = new Array();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.shipMap[i][j] && !ships.includes(this.shipMap[i][j]) && !this.shipMap[i][j].isSunk) ships.push(this.shipMap[i][j]);
      }
    }
    return ships.length;
  }

}