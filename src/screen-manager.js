import { HumanPlayer, ComputerPlayer } from "./base-classes";

export default class ScreenManager {
  constructor() {
    this.humanPlayer = new HumanPlayer();
    this.compPlayer = new ComputerPlayer();
    this.currDefender = this.compPlayer;

    const opponentBoard = document.querySelector('.board-container:nth-child(2) table');
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        const tableCell = opponentBoard.querySelector(`table tr:nth-child(${i}) td:nth-child(${j}) div`);
        tableCell.addEventListener('click', () => {
          this.processAttack([i - 1, j - 1]);
        })
      }
    }

    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => { this.startGame(); });
  }

  processAttack(YXPair) {
    if (!this.currDefender.board.canShoot(YXPair)) return;

    this.currDefender.board.shoot(YXPair);
    this.updateBoard();

    if (!this.currDefender.board.shipsAlive) this.stopGame();
    else {
      this.currDefender = this.currDefender === this.compPlayer ? this.humanPlayer : this.compPlayer;
      this.takeTurn();
    }
    
  }

  startGame() {
    this.humanPlayer = new HumanPlayer();
    this.compPlayer = new ComputerPlayer();
    this.currDefender = this.compPlayer;

    this.cleanUp();
    this.setUpBoards();
    this.updateBoard(this.humanPlayer);
    this.updateBoard(this.compPlayer);
    this.takeTurn();
  }

  setUpBoards() {
    // For temporary testing only
    this.humanPlayer.board.placeShip([1, 1], [1, 2], [1, 3], [1, 4])
    this.humanPlayer.board.placeShip([5, 5], [6, 5])
    this.compPlayer.board.placeShip([7, 7], [7, 8])
  }

  stopGame() {
    const startBtn = document.getElementById('start-btn');
    const turnDisplay = document.getElementById('turn-display');
    
    startBtn.style.display = 'block';
    turnDisplay.style.display = 'none';

    document.querySelector(`.board-container:nth-child(1) table`).classList = 'inactive';
    document.querySelector(`.board-container:nth-child(2) table`).classList = 'inactive';
  }

  cleanUp() {
    const tableHuman = document.querySelector(`.board-container:nth-child(1) table`);
    const tableComp = document.querySelector(`.board-container:nth-child(2) table`);

    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        tableHuman.querySelector(`tr:nth-of-type(${i}) td:nth-child(${j}) div`).classList = 'board-cell';
      }
    }

    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        tableComp.querySelector(`tr:nth-of-type(${i}) td:nth-child(${j}) div`).classList = 'board-cell';
      }
    }
  }

  takeTurn() {
    const turnDisplay = document.getElementById('turn-display');
    turnDisplay.textContent = `It's ${this.currDefender === this.compPlayer ? 'your' : "opponent's"} turn.`;
    const [activeBoardIndex, inactiveBoardIndex] = this.currDefender === this.compPlayer ? [2, 1] : [1, 2];
    const activeBoard = document.querySelector(`.board-container:nth-child(${activeBoardIndex}) table`);
    const inactiveBoard = document.querySelector(`.board-container:nth-child(${inactiveBoardIndex}) table`);

    activeBoard.classList = 'active';
    inactiveBoard.classList = 'inactive';

    if (this.currDefender === this.humanPlayer) {
      this.initiateCompMove();
    }
  }

  initiateCompMove() {
    const availableCells = this.humanPlayer.board.emptyCells;
    const targetCellIndex = availableCells.at(Math.floor(Math.random() * availableCells.length));
    this.processAttack(targetCellIndex);
  }

  updateBoard(player = this.currDefender) {
    const shotMap = player.board.shotMap;
    const shipMap = player.board.shipMap;
    const board = document.querySelector(`.board-container:nth-child(${player === this.compPlayer ? 2 : 1}) table`);

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const tableCell = board.querySelector(`table tr:nth-child(${i + 1}) td:nth-child(${j + 1}) div`);
        if (shotMap[i][j]) {
          if (!tableCell.classList.contains('hit')) tableCell.classList.add('hit');
        }
        if (shipMap[i][j]) {
          if (!tableCell.classList.contains('ship')) tableCell.classList.add('ship');
        }
      }
    }
  }


  }