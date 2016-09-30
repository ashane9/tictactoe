angular.module("TicTacToe")
  .directive('grid', function() {
    return {
        restrict: 'E',
        templateUrl: '../app/views/grid.html',
        replace: true
    };
});
