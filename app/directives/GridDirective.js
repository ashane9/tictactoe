angular.module("TicTacToe")
  .directive('grid', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/grid.html',
        replace: true
    };
});
