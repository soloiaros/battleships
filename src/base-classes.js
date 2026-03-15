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
  
  shoot(YXPair) { // method for handling all events that happen on incoming shot
    this.receiveAttack(YXPair);
    
    if (this.shipMap[YXPair.at(0)][YXPair.at(1)] && this.shipMap[YXPair.at(0)][YXPair.at(1)].isSunk) {
      this.markVerifiedEmpty(this.shipMap[YXPair.at(0)][YXPair.at(1)]);
    }
  }

  receiveAttack(YXPair) {
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

  get emptyCellsLeft() {
    let count = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!this.shotMap[i][j]) count += 1;
      }
    }
    return count;
  }

  get emptyCells() {
    let cells = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!this.shotMap[i][j]) cells.push([i, j]);
      }
    }
    return cells;
  }

  markVerifiedEmpty(shipObj) {
    const shipCoords = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.shipMap[i][j] === shipObj) shipCoords.push([i, j]);
      }
    }

    for (let [i, j] of shipCoords) {
      for (let iDiff of [-1, 0, 1]) {
        for (let jDiff of [-1, 0, 1]) {
          if ([i + iDiff, j + jDiff].every(coord => coord >= 0 && coord < 10) && !this.shotMap[i + iDiff][j + jDiff]) {
            this.shotMap[i + iDiff][j + jDiff] = 1;
          }
        }
      }
    }
  }

  getAdjacentShipCells(YXPair) {
    const queue = [YXPair];
    const visited = [];
    const cells = [];

    while (true) {
      if (!queue.length) {
        if (cells.length > 1 && cells[0][0] != cells[1][0]) {
          cells.sort((coord1, coord2) => coord1[0] - coord2[0]);
        }
        else cells.sort((coord1, coord2) => coord1[1] - coord2[1]);
        return cells;
      }

      const [y, x] = queue.shift();
      if (y < 0 || y >= 10 || x < 0 || x >= 10 || !this.shipMap[y][x] || visited.includes(`${y}${x}`)) continue;
      cells.push([y, x]);
      visited.push(`${y}${x}`);
      queue.push([y - 1, x]);
      queue.push([y, x - 1]);
      queue.push([y, x + 1]);
      queue.push([y + 1, x]);
    }
  }
}

class Player {
  constructor() {
    this.board = new Gameboard();
  }
}

export class HumanPlayer extends Player {
  constructor() {
    super();
  }
}

export class ComputerPlayer extends Player {
  constructor() {
    super();
  }
}