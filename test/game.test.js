import { Ship } from "../src/game.js";

describe('Test the Ship functionality', () => {

  let ship;
  beforeEach(() => {
    ship = new Ship();
  });

  it('Has length property', () => {
    expect(ship.length).toBeTruthy();
    expect(typeof ship.length).toBe('number');
  });

})