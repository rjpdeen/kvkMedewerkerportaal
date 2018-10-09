(function() {
"use strict";

/**
 * Medewerkerportaal module, includes ui.router, common module
 */
angular.module('medewerkerportaal', ['ui.router', 'common'])
.config(config);

config.$inject = ['$urlRouterProvider'];
function config($urlRouterProvider) {

  // If user goes to a path that doesn't exist, redirect to public root
  $urlRouterProvider.otherwise('/');
}

})();