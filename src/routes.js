(function() {
'use strict';

angular.module('medewerkerportaal')
.config(routeConfig);

/**
 * Configures the routes and views
 */
routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
  // Routes
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'src/home/home.html',
      controller: 'HomeController',
      controllerAs: 'homeCtrl'
    })
    .state('home.work-create', {
      url: '/work-create',
      templateUrl: 'src/home/work-create/work-create.html',
      controller: 'WorkCreateController',
      controllerAs: 'workCreateCtrl'
    })
    .state('home.work-list', {
      url: '/work-list',
      templateUrl: 'src/home/work-list/work-list.html',
      controller: 'WorkListController',
      controllerAs: 'workListCtrl'
    })
    .state('home.work-item', {
      url: '/work-item/{taskDefKey}',
      templateUrl: function(urlattr){
                return 'src/home/work-item/' + urlattr.taskDefKey + '.html';
            },
      controller: 'WorkItemController',
      controllerAs: 'workItemCtrl',
      params: {
        taskName: null,
        processInstanceId: null,
        taskId: null,
        taskDefKey: null
      },
      resolve: {
        taskName: ['$stateParams', 
            function($stateParams) {
              return $stateParams.taskName;
            }
        ],
        processInstanceId: ['$stateParams', 
            function($stateParams) {
              return $stateParams.processInstanceId;
            }
        ],
        taskId: ['$stateParams', 
            function($stateParams) {
              return $stateParams.taskId;
            }
        ]
      }
    });
}
})();