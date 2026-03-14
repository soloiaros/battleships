import { Ship } from "../src/game.js";

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

})