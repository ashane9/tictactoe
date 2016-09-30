angular.module("TicTacToe")
  .service("TicTacToeService", ['TicTacToeGame', function (TicTacToeGame) {
   var game;
   this.player1Score = 0;
   this.player2Score = 0;

   this.makeNewGame = function() {
     console.log("Initializing game in service...");
     this.game = new TicTacToeGame();
     return this.game;
   };

   this.increaseScore = function(winner) {
     console.log("winner is " + winner);
     if (winner === 1) {
       console.log("player 1 score " + this.player1Score);
       this.player1Score++;
       console.log("player 1 score now" + this.player1Score);
     } else if (winner === 2) {
       this.player2Score++;
     }
   };


}]);
