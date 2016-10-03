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
     if (winner === 1) {
       this.player1Score++;
     } else if (winner === 2) {
       this.player2Score++;
     }
   };


}]);
