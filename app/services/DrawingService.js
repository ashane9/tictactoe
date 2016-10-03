angular.module("TicTacToe")
  .service("DrawingService", function () {
  var CELL_PADDING = 15;

  this.initialize = function (ticTacToeBoard) {
    console.log("Initializing DrawingService...");

    this.ticTacToeBoard = ticTacToeBoard;
    this.grid = [];

    $('.cell').height(this.ticTacToeBoard.boardWidth);

    for (var row = 0; row < 3; row++) {
      this.grid.push([]);

      for (var column = 0; column < 3; column++) {
        var cellUIComponent = $(".cell[data-row='" + row + "'][data-column='" + column + "']");
        cellUIComponent.svg({settings: {width: this.ticTacToeBoard.boardWidth, height: this.ticTacToeBoard.boardWidth}});
        this.grid[row][column] = cellUIComponent;
      }
    }

    console.log("finished DrawingService initialization...");
  };

  this.getCellAt = function (row, column) {
    this.grid[row][column].hide();
  };

  this.drawBoard = function () {
    console.log("Drawing board...");
    for (var row = 0; row < 3; row++)   {
      for (var column = 0; column < 3; column++) {

        var cellUIComponent = this.grid[row][column];
        var cellInGame = this.ticTacToeBoard.getCell(row,column);
        var cellSVG = cellUIComponent.svg('get');

        if (cellSVG !== undefined){
          cellSVG.clear();
        }
        if (cellInGame === "X") {
          this.drawCross(cellSVG, cellUIComponent);
        } else if (cellInGame === "O") {
          this.drawCircle(cellSVG, cellUIComponent);
        }
      }
    }
  };

  this.drawCross = function (cellSVG, cellUIComponent) {
    cellSVG.line(null, CELL_PADDING, CELL_PADDING, cellUIComponent.width() - CELL_PADDING, cellUIComponent.height() - CELL_PADDING, {stroke: 'red', strokeWidth: 5});
    cellSVG.line(null, cellUIComponent.width() - CELL_PADDING, CELL_PADDING, CELL_PADDING, cellUIComponent.height() - CELL_PADDING, {stroke: 'red', strokeWidth: 5});
  };

  this.drawCircle = function (cellSVG, cellUIComponent) {
    cellSVG.circle(cellUIComponent.width() / 2, cellUIComponent.height() / 2, cellUIComponent.width() / 2 - CELL_PADDING, {fill: 'white', stroke: 'blue', strokeWidth: 5});
  };

  return this;
});
