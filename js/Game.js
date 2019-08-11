import Layout from "./Layout.js";
import * as Constants from "../utils/Constants.js";

const Game = function(level, elements = {}) {
  //Setting the corresponding html elements references
  this.els = {};

  this.setElements(this.els, elements);

  //Setting the dimension and mine count
  this.setConfiguration(level);

  //Setting the required properties
  this.initialize = false;

  //Setting the layout
  this.layout = new Layout(this.els.layout);

  this.init();
};

Game.prototype.setElements = function(els, elements) {
  let levelElement = elements.level || ".game-level";
  let mineElement = elements.mine || ".game-mines-count";
  let timeElement = elements.timer || ".game-time";
  let layoutElement = elements.board || ".game-layout";
  let restartElement = elements.restart || ".game-restart";
  let errorElement = elements.error || ".game-error";

  els.level = document.querySelector(levelElement);
  els.mine = document.querySelector(mineElement);
  els.time = document.querySelector(timeElement);
  els.layout = document.querySelector(layoutElement);
  els.restart = document.querySelector(restartElement);
  els.error = document.querySelector(errorElement);
};

Game.prototype.setConfiguration = function(level) {
  let option;
  let self = this;
  let setConfigurationHelper = function(input) {
    if (input) {
      self.dimension = parseInt(input);
      self.mineCount = Math.floor(0.2 * input ** 2);
    } else {
      self.dimension = Constants.LEVELS[level].dimension;
      self.mineCount = Constants.LEVELS[level].mineCount;
    }
    option = self.els.level.querySelector(`option[value="${level}"]`);
    option.selected = true;
  };

  if (level === 4) {
    let dimension = prompt("Please provide the dimension?", "10");
    if (dimension) {
      setConfigurationHelper(dimension);
    } else {
      level = 1;
      setConfigurationHelper();
    }
  } else {
    setConfigurationHelper();
  }
};

Game.prototype.init = function() {
  //Setting the required properties
  this.gameOver = false;
  this.userMineCount = this.mineCount;
  this.timer = null;

  //Setting the corresponding mine count and time html element values.
  this.time = 0;
  this.els.time.textContent = `Your score: ${this.time}`;
  this.els.mine.textContent = `${this.userMineCount} of ${
    this.mineCount
  } mine left`;

  //Create the cells based on the dimension
  this.layout.init(this.dimension, this.mineCount);

  //Adding the level and reset event handlers
  if (!this.initialize) {
    this.addEventListeners();
  }
  this.initialize = true;
};

Game.prototype.addEventListeners = function() {
  this.els.level.addEventListener(
    "change",
    this.levelChangedHandler.bind(this)
  );
  this.els.restart.addEventListener("click", this.restartHandler.bind(this));
  this.layout.element.addEventListener(
    "click",
    this.leftClickHandler.bind(this)
  );
  this.layout.element.addEventListener(
    "contextmenu",
    this.rightClickHandler.bind(this)
  );
};

Game.prototype.levelChangedHandler = function(event) {
  this.setConfiguration(parseInt(event.target.value));
  this.init();
};

Game.prototype.restartHandler = function(event) {
  this.init();
};

Game.prototype.leftClickHandler = function(event) {
  if (this.gameOver || !event.target.classList.contains("cell")) {
    return;
  }

  let cell = this.findCell(event);

  if (this.time === 0) {
    this.startTimer();
  }

  if (cell.isMarked) {
    return;
  }

  if (cell.isMine) {
    return this.game_over();
  }

  //Show the count of the bombs adjacent to the cell if no bomb in the cell
  cell.reveal();

  //Reveal the adjacent cells if the cell is empty
  if (cell.isEmpty) {
    this.layout.revealAdjacentCells(cell);
  }

  this.layout.setUnrevealedCells();

  if (this.checkForWin()) {
    return this.game_over(true);
  } else {
    this.updateUserMineCount();
  }
};

Game.prototype.rightClickHandler = function(event) {
  event.preventDefault();
  if (this.gameOver || !event.target.classList.contains("cell")) {
    return;
  }

  let cell = this.findCell(event);

  if (cell.isMarked) {
    cell.setUnmarked();
  } else {
    cell.setMarked();
  }
};

Game.prototype.findCell = function(event) {
  let row = event.target.getAttribute("row");
  let column = event.target.getAttribute("column");
  return this.layout.cells[row][column];
};

Game.prototype.startTimer = function() {
  let self = this;
  self.timer = setInterval(function() {
    ++self.time;
    self.els.time.textContent = `Your score: ${self.time}`;
  }, 1000);
};

Game.prototype.stopTimer = function() {
  clearInterval(this.timer);
};

Game.prototype.game_over = function(isWin) {
  let win = isWin || false;

  this.stopTimer();
  this.gameOver = true;
  this.layout.reveal();

  if (win) {
    this.updateUserMineCount();
    alert("You win!");
  } else {
    alert("Game over!!!");
  }
};

Game.prototype.updateUserMineCount = function() {
  let userMarkedMineCells = this.layout.checkUserMarkedCellsForMines();
  this.userMineCount =
    userMarkedMineCells && userMarkedMineCells.length > 0
      ? this.mineCount - userMarkedMineCells.length
      : this.mineCount;
  this.els.mine.textContent = `${this.userMineCount} of ${
    this.mineCount
  } mine left`;
};

Game.prototype.checkForWin = function() {
  return (
    this.layout.unrevealedCells.length <= this.mineCount ||
    this.layout.checkUserMarkedCellsForMines().length === this.mineCount
  );
};

export default Game;
