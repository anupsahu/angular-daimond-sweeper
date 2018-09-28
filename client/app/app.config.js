'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $qProvider) {
    'ngInject';

    $urlRouterProvider.otherwise('/');
    //$qProvider.errorOnUnhandledRejections(false);

    $locationProvider.html5Mode(true);
}