const Cell = function(element, row, column) {
  this.element = element;
  this.row = row;
  this.column = column;
  this.isMine = false;
  this.isMarked = false;
  this.isEmpty = false;
  this.isRevealed = false;
  this.mineCount = 0;

  this.setMine = function() {
    this.isMine = true;
  };

  this.reveal = function() {
    this.setRevealed();

    if (this.isMine) {
      return this.element.classList.add("is-mine");
    }

    if (this.isEmpty) {
      return this.element.classList.add("is-empty");
    }

    this.element.textContent = this.mineCount;
  };

  this.setRevealed = function() {
    this.isRevealed = true;
    this.element.classList.add("is-revealed");
  };

  this.setMarked = function() {
    this.isMarked = true;
    this.element.classList.add("is-marked");
  };

  this.setUnmarked = function() {
    this.isMarked = false;
    this.element.classList.remove("is-marked");
  };

  this.setEmpty = function() {
    this.isEmpty = true;
  };

  this.setMineCount = function(count) {
    this.mineCount = count;
  };
};

export default Cell;
