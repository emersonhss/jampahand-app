'use strict';

var statusChangeCallback = undefined;

/**
 * @ngdoc overview
 * @name jampahandApp
 * @description
 * # jampahandApp
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


  }]).run(['$rootScope', function($rootScope){

    console.log($rootScope.usuarioLogado);

    statusChangeCallback = function(response){
      console.log('statusChangeCallback');
      console.log(response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        getUserData(response.authResponse.userID);
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('Please log ' +
        'into this app.');
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Please log ' +
        'into Facebook.');
      }
    };

    $rootScope.checkLoginState = function() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };

    $rootScope.doLogin = function(){
      FB.login(function(response) {
        statusChangeCallback(response);
      });
    };

    $rootScope.doLogout = function(){
      FB.logout(function(response) {
        // user is now logged out
        $rootScope.$apply(function() {
          $rootScope.usuarioLogado = undefined;
        });
      });
    }


    function getUserData(id) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/' + id + '?fields=id,name,email,picture', function(response) {
        console.log(response);
        $rootScope.$apply(function() {
          $rootScope.usuarioLogado = response;
        });
      });
    }

  }]);
