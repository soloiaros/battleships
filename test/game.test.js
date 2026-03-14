import { Ship, Gameboard } from "../src/game.js";

describe('Test the Ship functionality', () => {

  let ship;
  beforeEach(() => {
    ship = new Ship();
  });

  it('Sinks when hit enough times - length 1', () => {
    ship.length = 1;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.isSunk).toBeTruthy();
  });

  it('Sinks when hit enough times - length 2', () => {
    ship.length = 2;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.isSunk).toBeTruthy();
  });

  it('Sinks when hit enough times - length 3', () => {
    ship.length = 3;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.isSunk).toBeTruthy();
  });

  it('Sinks when hit enough times - length 4', () => {
    ship.length = 4;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.isSunk).toBeTruthy();
  });

});


describe('Test the Gameboard functionality', () => {

  let board;
  beforeEach(() => {
    board = new Gameboard();
  });
  
  it('Can register a missed shot', () => {
    board.placeShip([0, 0], [0, 1], [0, 2]);
    expect(() => { board.shoot([1, 1]) }).not.toThrow();
  });
  
  it('Can register a hit shot', () => {
    board.placeShip([0, 0], [0, 1], [0, 2]);
    expect(() => { board.shoot([0, 1]) }).not.toThrow();
  });
  
  it('Can determine if cell is suitable for shot', () => {
    board.placeShip([0, 0], [0, 1], [0, 2]);

    board.shoot([1, 1]);
    expect(board.canShoot([1, 1])).toBeFalsy();

    expect(board.canShoot([0, 1])).toBeTruthy();
    board.shoot([0, 1]);
    expect(board.canShoot([0, 1])).toBeFalsy();

    expect(board.canShoot([7, 7])).toBeTruthy();
    expect(board.canShoot([-1, -1])).toBeFalsy();
    expect(board.canShoot([10, 10])).toBeFalsy();
  });

  it('Can register a ship being placed', () => {
    board.placeShip([0, 0], [0, 1], [0, 2]);
    board.placeShip([2, 2]);
    board.placeShip([9, 8], [9, 9]);
    expect(board.shipsAlive).toBe(3);
  });

  it('Can register a ship being sunk', () => {
    board.placeShip([0, 0], [0, 1], [0, 2]);
    board.placeShip([2, 2]);
    board.placeShip([9, 8], [9, 9]);

    board.shoot([2, 2])
    expect(board.shipsAlive).toBe(2);
    
    board.shoot([9, 8]);
    board.shoot([9, 9]);
    expect(board.shipsAlive).toBe(1);
    
    board.shoot([0, 0]);
    board.shoot([0, 1]);
    expect(board.shipsAlive).toBe(1);
  });

  it('Outputs the amount of empty cells left', () => {
    expect(board.emptyCellsLeft).toBe(100);
    board.shoot([0, 0]);
    expect(board.emptyCellsLeft).toBe(99);
    board.shoot([9, 9]);
    expect(board.emptyCellsLeft).toBe(98);
  });

  it('Marks verified empty cells - single-cell ship', () => {
    board.placeShip([0, 0]);
    board.shoot([0, 0]);
    expect(board.emptyCellsLeft).toBe(96);
  });

  it('Marks verified empty cells - tripple-cell ship', () => {
    board.placeShip([5, 5], [5, 4], [5, 3]);
    board.shoot([5, 5]);
    board.shoot([5, 4]);
    board.shoot([5, 3]);
    expect(board.emptyCellsLeft).toBe(85);
  });
  
})