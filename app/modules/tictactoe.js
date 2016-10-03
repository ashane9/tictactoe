var angular = require('angular');
require('jquery');
require('jquery-svg');
require('bootstrap-css');
require('ui-boostrap');

angular.module("TicTacToe", ['ui.bootstrap']);

require('../../build/templateCacheViews.js');
require('../css/tictactoe.css');
require('../services/TicTacToeGame');
require('../controllers/TicTacToeController.js');
require('../directives/GridDirective.js');
require('../services/DrawingService.js');
require('../services/TicTacToeService.js');
require('../services/TicTacToeGame.js');
