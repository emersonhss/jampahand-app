'use strict';

var statusChangeCallback = undefined;

/**
 * @ngdoc overview
 * @name maximushcApp
 * @description
 * # maximushcApp
 *
 * Main module of the application.
 */
angular
  .module('maximushcApp', [
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
      .when('/tecnico', {
        templateUrl: 'views/comissaoTecnica.html'
      })
      .when('/atleta', {
        templateUrl: 'views/atletas.html'
      })
      .when('/dirigente', {
        templateUrl: 'views/dirigentes.html'
      })
      .otherwise({
        //redirectTo: '/'
        templateUrl: '404.html',
      });


  }]).run(['$rootScope', '$location', function($rootScope, $location){

    console.log($rootScope.usuarioLogado);
    var login = function(){
      FB.login(function(response) {
        statusChangeCallback(response);
      });
    };

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
        login();
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
      login();
    };

    $rootScope.doLogout = function(){
      FB.logout(function(response) {
        // user is now logged out
        $rootScope.$apply(function() {
          $rootScope.usuarioLogado = undefined;
        });
      });
    }

    $rootScope.hasRole = function(roleName){
      var hasRole = false;
      if($rootScope.usuarioLogado){
        angular.forEach($rootScope.usuarioLogado.roles, function(value, key){
          if(value.name === roleName){
            hasRole = true;
          }
        });
      }
      return hasRole;
    };


    function getUserData(id) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/' + id + '?fields=id,name,email,picture', function(response) {
        console.log(response);
        $rootScope.$apply(function() {
          $rootScope.usuarioLogado = response;
          $rootScope.$broadcast('$loginSuccess', response);
        });
      });
    }

    $rootScope.checkLoginState();

  }]);
