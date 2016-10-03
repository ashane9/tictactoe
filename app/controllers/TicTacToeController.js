angular.module("TicTacToe")
  .controller("TicTacToeController", [
    '$scope', '$uibModal', '$timeout', 'TicTacToeService', 'DrawingService',
    function ($scope, $uibModal, $timeout, TicTacToeService, DrawingService) {

        var gameCurrentlyPlayed = false;
        this.displayBoard = false;

        $scope.initialize = function() {
          this.boardWidth = ($('.grid').width()/3)-4;
          };

        $scope.buttonDisplay = function() {
          if (TicTacToeService.player1Score === 0 && TicTacToeService.player2Score === 0) {
            return 'Start Game';
          } else {
            return 'Play Again';
          }
        };

        $scope.startGame = function() {
            console.log("Initializing a new game...");
            this.displayBoard = true;
            gameCurrentlyPlayed = TicTacToeService.makeNewGame();
            gameCurrentlyPlayed.boardWidth = this.boardWidth;
            console.log("board at start game: " + gameCurrentlyPlayed.boardWidth);

            DrawingService.initialize(gameCurrentlyPlayed);
            DrawingService.drawBoard();

            console.log("finished starting new game...");
        };

        $scope.cellClick = function(clickEvent) {
            if (gameCurrentlyPlayed && gameCurrentlyPlayed.isGameInProgress()) {
                var cellClicked = clickEvent.target.parentElement;
                var cellClickedRow = cellClicked.dataset.row;
                var cellClickedColumn = cellClicked.dataset.column;

                gameCurrentlyPlayed.playerMove(cellClickedRow, cellClickedColumn);
                DrawingService.drawBoard();
                console.log("drew board");
                if (gameCurrentlyPlayed.hasSomeoneWon() === true) {
                  this.winnerPopup();
                } else if (gameCurrentlyPlayed.isBoardFull() === true) {
                  this.noWinnerPopup();
                }
            }
        };

        $scope.isGameInProgress = function() {
            if (gameCurrentlyPlayed) {
              console.log("game is in progress: " + gameCurrentlyPlayed.isGameInProgress());
                return gameCurrentlyPlayed.isGameInProgress();
            }

            return false;
        };

        $scope.winner = function() {
          console.log("current winner" + gameCurrentlyPlayed.winner);
          return gameCurrentlyPlayed.winner;
        };

        $scope.player1Score = function() {
          return TicTacToeService.player1Score;
        };

        $scope.player2Score = function() {
          return TicTacToeService.player2Score;
        };

        $scope.winnerPopup = function() {
            console.log('there is a winner');
            this.openedPopup = $uibModal.open({
              templateUrl: '/views/winner_popup.html',
              size: 'sm',
              scope: $scope
            });
            TicTacToeService.increaseScore(this.winner());
        };

        $scope.noWinnerPopup = function(){
          this.openedPopup = $uibModal.open({
            templateUrl: '/views/no_winner.html',
            size: 'sm',
            scope: $scope
          });
        };

        $scope.playAgain = function() {
          this.openedPopup.close();
          this.startGame();
          console.log("new game started? " + gameCurrentlyPlayed.isGameInProgress());
        };

        $scope.close = function() {
          this.openedPopup.dismiss();
        };

        // $timeout($scope.initialize, 0);

    }
]);
