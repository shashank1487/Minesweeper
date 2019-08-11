import Cell from "./Cell.js";
import { flattenArray } from "../utils/Helper.js";

const Layout = function(element) {
  this.element = element;
  this.dimension = 0;
  this.mineCount = 0;
  this.cells = [];
  this.unrevealedCells = [];

  this.init = function(dimension, mineCount) {
    this.dimension = dimension;
    this.mineCount = mineCount;

    this.drawLayout();
    this.plantMines();
    this.setAdjacentCellsMineCount();
  };

  this.drawLayout = function() {
    var cell;

    this.element.innerHTML = "";

    for (var x = 0; x < this.dimension; x++) {
      this.cells[x] = new Array(this.dimension);
      for (var y = 0; y < this.dimension; y++) {
        cell = document.createElement("span");
        cell.className = "cell";
        cell.setAttribute("row", x);
        cell.setAttribute("column", y);
        this.element.appendChild(cell);
        this.cells[x][y] = new Cell(cell, x, y);
      }
      this.appendSeparator();
    }
  };

  this.appendSeparator = function() {
    var element = document.createElement("div");
    element.classList.add("clear_fix");
    this.element.appendChild(element);
  };

  this.plantMines = function() {
    let plantedMinesCount = 0;
    let x, y, cell;

    while (plantedMinesCount < this.mineCount) {
      x = this.getRandomMineLocation(this.dimension);
      y = this.getRandomMineLocation(this.dimension);
      cell = this.cells[x][y];

      if (!cell.isMine) {
        cell.setMine();
        plantedMinesCount++;
      }
    }
  };

  this.getRandomMineLocation = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  this.setAdjacentCellsMineCount = function() {
    let row, column, cell, mineCount;

    for (row = 0; row < this.dimension; row++) {
      for (column = 0; column < this.dimension; column++) {
        cell = this.cells[row][column];
        mineCount = 0;

        if (!cell.isMine) {
          let adjacentCells = this.getAdjacentCells(cell);
          for (let adjacentCell of adjacentCells) {
            if (adjacentCell.isMine) {
              mineCount++;
            }
          }
        }

        mineCount === 0 ? cell.setEmpty() : cell.setMineCount(mineCount);
      }
    }
  };

  this.getAdjacentCells = function(cell) {
    let adjacentCells = [];

    // up
    if (cell.row !== 0) {
      adjacentCells.push(this.cells[cell.row - 1][cell.column]);
    }

    // down
    if (cell.row !== this.dimension - 1) {
      adjacentCells.push(this.cells[cell.row + 1][cell.column]);
    }

    // left
    if (cell.column !== 0) {
      adjacentCells.push(this.cells[cell.row][cell.column - 1]);
    }

    // right
    if (cell.column !== this.dimension - 1) {
      adjacentCells.push(this.cells[cell.row][cell.column + 1]);
    }

    // upper left
    if (cell.row !== 0 && cell.column !== 0) {
      adjacentCells.push(this.cells[cell.row - 1][cell.column - 1]);
    }

    // upper right
    if (cell.row !== 0 && cell.column !== this.dimension - 1) {
      adjacentCells.push(this.cells[cell.row - 1][cell.column + 1]);
    }

    // lower left
    if (cell.row !== this.dimension - 1 && cell.column !== 0) {
      adjacentCells.push(this.cells[cell.row + 1][cell.column - 1]);
    }

    // lower right
    if (cell.row !== this.dimension - 1 && cell.column !== this.dimension - 1) {
      adjacentCells.push(this.cells[cell.row + 1][cell.column + 1]);
    }

    return adjacentCells;
  };

  this.reveal = function() {
    for (let row = 0; row < this.dimension; row++) {
      for (let column = 0; column < this.dimension; column++) {
        this.cells[row][column].reveal();
      }
    }
  };

  this.revealAdjacentCells = function(cell) {
    var x,
      adjacentCell,
      adjacentCells = this.getAdjacentCells(cell);

    for (let i = 0; i < adjacentCells.length; i++) {
      adjacentCell = adjacentCells[i];

      if (
        adjacentCell.isRevealed ||
        adjacentCell.isMarked ||
        adjacentCell.isMine
      ) {
        continue;
      }

      adjacentCell.reveal();
    }
  };

  this.setUnrevealedCells = function() {
    let clonedCells = this.cells.slice();
    let flattenedCells = flattenArray(clonedCells);
    this.unrevealedCells =
      flattenedCells && flattenedCells.filter(fc => !fc.isRevealed);
  };

  this.checkUserMarkedCellsForMines = function() {
    return (
      this.unrevealedCells &&
      this.unrevealedCells.filter(uc => uc.isMarked && uc.isMine)
    );
  };
};

export default Layout;
