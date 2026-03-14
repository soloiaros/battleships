import { Ship, Gameboard } from "../src/game.js";

describe('Test the Ship functionality', () => {

  let ship;
  beforeEach(() => {
    ship = new Ship();
  });

  it('Has length property', () => {
    expect(ship.length).toBeDefined();
    expect(typeof ship.length).toBe('number');
  });

  it('Has initial hits property', () => {
    expect(ship.hits).toBeDefined();
    expect(typeof ship.hits).toBe('number');
  });

  it('Has isSunk property', () => {
    expect(ship.isSunk).toBeDefined();
    expect(typeof ship.isSunk).toBe('boolean');
  });

  it('Can register hits', () => {
    ship.length = 4;
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  it('Sinks when hit enough times - length 1', () => {
    ship.length = 1;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.hits).toBe(1);
    expect(ship.isSunk).toBeTruthy();
  });

  it('Sinks when hit enough times - length 2', () => {
    ship.length = 2;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.hits).toBe(2);
    expect(ship.isSunk).toBeTruthy();
  });

  it('Sinks when hit enough times - length 3', () => {
    ship.length = 3;
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBeFalsy();
    ship.hit();
    expect(ship.hits).toBe(3);
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
    expect(ship.hits).toBe(4);
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
    expect(board.canShoot([7, 7])).toBeTruthy();
    expect(board.canShoot([-1, -1])).toBeFalsy();
    expect(board.canShoot([10, 10])).toBeFalsy();
  });
  
})