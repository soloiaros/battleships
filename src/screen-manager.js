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

    
    this.enterPlanningStage();
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
    this.currDefender = this.compPlayer;

    const startBtn = document.getElementById('start-btn');
    const turnDisplay = document.getElementById('turn-display');
    
    startBtn.style.display = 'none';
    turnDisplay.style.display = 'block';

    this.updateBoard(this.humanPlayer);
    this.updateBoard(this.compPlayer);
    this.takeTurn();
  }

  stopGame() {
    const startBtn = document.getElementById('start-btn');
    const turnDisplay = document.getElementById('turn-display');
    
    startBtn.style.display = 'block';
    turnDisplay.style.display = 'none';

    document.querySelector(`.board-container:nth-child(1) table`).classList = 'inactive';
    document.querySelector(`.board-container:nth-child(2) table`).classList = 'inactive';

    setTimeout(() => {
      this.enterPlanningStage();
    }, 2000);
  }

  enterPlanningStage() {
    this.humanPlayer = new HumanPlayer();
    this.compPlayer = new ComputerPlayer();
    this.cleanUp();
    this.placeShipsRandomly(this.humanPlayer.board);
    this.placeShipsRandomly(this.compPlayer.board);
    this.updateBoard(this.humanPlayer);
    this.updateBoard(this.compPlayer);
    document.querySelector(`.board-container:nth-child(1) table`).classList = 'active';
    document.querySelector(`.board-container:nth-child(2) table`).classList = 'inactive';
    this.addDraggingEvents(document.querySelector(`.board-container:nth-child(1) table`), this.humanPlayer);
  }

  addDraggingEvents(tableEl, player) {
    let isDragging = false;
    let dragOffsetX, dragOffsetY, shipCells, targetCellOrder, rect;
    const ghost = document.getElementById('ghost-container');
    ghost.style.pointerEvents = 'none';

    const updateGhostPosition = (mouseX, mouseY) => {
      ghost.style.left = `${mouseX - dragOffsetX}px`;
      ghost.style.top = `${mouseY - dragOffsetY}px`;
      
      const hoveredCells = [];
      let cell;
      for (let i = 0; i < shipCells.length; i++) {
        if (shipCells.length > 1 && shipCells[0][0] !== shipCells[1][0]) cell = document.elementFromPoint(mouseX, mouseY + (i - targetCellOrder) * rect.width);
        else cell = document.elementFromPoint(mouseX + (i - targetCellOrder) * rect.height, mouseY);
        hoveredCells.push(cell);
      }
      if (!hoveredCells) return;
      // add logic for doing stuff with hovered cells here
    }

    tableEl.addEventListener('mousedown', (event) => {
      const td = event.target.closest('td');
      if (!td || !td.querySelector('div').classList.contains('ship')) return;

      const targetX = td.cellIndex;
      const targetY = td.parentElement.rowIndex;
      shipCells = player.board.getAdjacentShipCells([targetY, targetX]);

      rect = td.getBoundingClientRect();
      targetCellOrder = shipCells.findIndex(currCell => {
        return currCell.every((coord, i) => coord === [targetY, targetX].at(i));
      });
      dragOffsetX = event.clientX - rect.left;
      dragOffsetY = event.clientY - rect.top;
      if (shipCells.length > 1) shipCells[0][0] !== shipCells[1][0] ? dragOffsetY += targetCellOrder * rect.height : dragOffsetX += targetCellOrder * rect.height; // needed so that 'ghosts' get calculated from the actual dragged cell

      ghost.innerHTML = '';
      ghost.style.display = 'flex';
      ghost.style.flexDirection = shipCells.length > 1 && shipCells[0][0] !== shipCells[1][0] ? 'column' : 'row';
      shipCells.forEach(([y, x]) => {
        const cell = tableEl.rows[y].cells[x].querySelector('div');
        cell.classList.add('dragged');

        const ghostCell = document.createElement('div');
        ghost.appendChild(ghostCell);
        isDragging = true;
        updateGhostPosition(event.clientX, event.clientY);
      });
    });

    tableEl.addEventListener('mousemove', (event) => {
      if (isDragging) updateGhostPosition(event.clientX, event.clientY);
    });

    tableEl.addEventListener('mouseup', () => {
      isDragging = false;
      ghost.style.display = 'none';
      shipCells.forEach(([y, x]) => {
        const cell = tableEl.rows[y].cells[x].querySelector('div');
        cell.classList.remove('dragged');
      })
    });
  }

  placeShipsRandomly(board) {
    const ships = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    
    let ship = ships.pop();
    shipsLoop: while (true) {
      if (!ships.length) break;

      let initCoord = board.emptyCells;
      initCoord = initCoord.at(Math.floor(Math.random() * initCoord.length));
      const xDirection = [-1, 1, 0].at(Math.floor(Math.random() * 3));
      const yDirection = xDirection === 0 ? [-1, 1].at(Math.floor(Math.random() * 2)) : 0;
      const shipCoords = [];
      for (let shipCellN = 0; shipCellN < ship; shipCellN++) {
        let i = initCoord[0] + yDirection * shipCellN;
        let j = initCoord[1] + xDirection * shipCellN;
        shipCoords.push([i, j]);
      }

      for (let YXPair of shipCoords) {
        if (YXPair[0] < 0 || YXPair[0] >= 10 || YXPair[1] < 0 || YXPair[1] >= 10 || board.shipMap[YXPair.at(0)][YXPair.at(1)]) continue shipsLoop;

        for (let iDiff of [-1, 0, 1]) { // check for the buffer zone
          for (let jDiff of [-1, 0, 1]) {
            if (YXPair[0] + iDiff >= 0 && YXPair[0] + iDiff < 10 && YXPair[1] + jDiff >= 0 && YXPair[1] + jDiff < 10) {
              if (board.shipMap[YXPair.at(0) + iDiff][YXPair.at(1) + jDiff]) continue shipsLoop;
            }
          }
        }
      }

      // if the zone os clear for placement
      board.placeShip(...shipCoords);
      ship = ships.pop();
    }

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
    setTimeout(() => {
      const availableCells = this.humanPlayer.board.emptyCells;
      const targetCellIndex = availableCells.at(Math.floor(Math.random() * availableCells.length));
      this.processAttack(targetCellIndex);
    }, Math.random() * 1200);
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