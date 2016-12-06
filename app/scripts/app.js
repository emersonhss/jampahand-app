'use strict';

/**
 * @ngdoc overview
 * @name jampahandAppApp
 * @description
 * # jampahandAppApp
 *
 * Main module of the application.
 */
angular
  .module('jampahandApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial'
  ])
  .config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/comissaoTecnica', {
        templateUrl: 'views/comissaoTecnica.html'
      })
      .when('/atletas', {
        templateUrl: 'views/atletas.html'
      })
      .when('/dirigentes', {
        templateUrl: 'views/dirigentes.html'
      })
      .otherwise({
        //redirectTo: '/'
        templateUrl: '404.html',
      });


  }]);
