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
    'ngMaterial',
    'ui.mask',
    'lexacode.mercadopago',
    'base64'
  ])
  .config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })

      .when('/entrar', {
        templateUrl: 'views/entrar.html',
        controller: 'EntrarCtrl',
        controllerAs: 'entrar'
      })

      .when('/entrar-cadastrar-socio', {
        templateUrl: 'views/entrar-cadastrar-socio.html',
        controller: 'CadastrarSocioCtrl',
        controllerAs: 'cadastrarSocio'
      })


      .when('/tecnico', {
        templateUrl: 'views/comissaoTecnica.html',
      })


      .when('/atleta', {
        templateUrl: 'views/atletas.html'
      })
      .when('/atleta/cadastro', {
        templateUrl: 'views/atletas-cadastro.html'
      })


      .when('/dirigente', {
        templateUrl: 'views/dirigentes.html'
      })

      .when('/socio-torcedor', {
        templateUrl: 'views/socio-torcedor.html',
        controller: 'SocioTorcedorCtrl',
        controllerAs: 'socioTorcedor'
      })

      .otherwise({
        //redirectTo: '/'
        templateUrl: '404.html',
      });


      // For example: raised button text will be black instead of white.
      //var lightYellowMap = $mdThemingProvider.extendPalette('yellow', {
      //  '500': '#ff0000',
      //  'contrastDefaultColor': 'dark'
      //});

      // Register the new color palette map with the name <code>neonRed</code>
      //$mdThemingProvider.definePalette('lightYellowMap', lightYellowMap);

      // Use that theme for the primary intentions
      //$mdThemingProvider.theme('default')
       // .primaryPalette('yellow');
        
    

  $mdThemingProvider.theme('default')
    .primaryPalette('amber').accentPalette('yellow');



  }]).run(['$rootScope', '$location', 'UserService', function($rootScope, $location, UserService){

    // console.log($rootScope.usuarioLogado);
    // var login = function(){
    //   FB.login(function(response) {
    //     statusChangeCallback(response);
    //   });
    // };

    // statusChangeCallback = function(response){
    //   console.log('statusChangeCallback');
    //   console.log(response);
    //   // The response object is returned with a status field that lets the
    //   // app know the current login status of the person.
    //   // Full docs on the response object can be found in the documentation
    //   // for FB.getLoginStatus().
    //   if (response.status === 'connected') {
    //     // Logged into your app and Facebook.
    //     getUserData(response.authResponse.userID);
    //   } else if (response.status === 'not_authorized') {
    //     // The person is logged into Facebook, but not your app.
    //     login();
    //   } else {
    //     // The person is not logged into Facebook, so we're not sure if
    //     // they are logged into this app or not.
    //     console.log('Please log into Facebook.');
    //   }
    // };

    $rootScope.checkLoginState = function() {
      // FB.getLoginStatus(function(response) {
      //   statusChangeCallback(response);
      // });
      
      // Veriricar se o usuário do maximus e o token está válido.
      var maximusUserLogged = UserService.getUserLogged();
      if(maximusUserLogged) {
        // Verificar se o usuário está mais de uma hora de autenticação
        var loginDate = new Date(maximusUserLogged.lastLoginDate);
        var oneHourInMinutes = 60 * 60000;
        var expireLoginDate = loginDate.setTime(loginDate.getTime() + oneHourInMinutes);
        var now = new Date();
        // Se tiver, realiza logout informando que a sessão expirou e redireciona para a tela de login.
        if(now > expireLoginDate){
          UserService.removeUserLogged();
          maximusUserLogged = undefined;
          $location.url('/entrar');
        } 
        $rootScope.usuarioLogado = maximusUserLogged;
        // Se não tiver então o usuário está logado e em uso, pode deixar prosseguir.


      } else {
        // Se não tem usuário logado, redireciona a tela de login
        $location.url('/entrar');
      }

    };

    $rootScope.doSingin = function(){
      //$rootScope.checkLoginState();
      $location.url('/entrar');
    };

    $rootScope.doSingupSocio = function(){
      $location.url('/entrar-cadastrar-socio');
    };

    $rootScope.doLogin = function(user){
      //login();
      var userSend = angular.copy(user);
      userSend.password = sha256(user.password);
      UserService.executeLogin(userSend).then(function(respSuccess){
        console.log('Login realizado com sucesso!');
        $rootScope.usuarioLogado = respSuccess.data;
        $rootScope.usuarioLogado.lastLoginDate = new Date();
        UserService.setUserLogged($rootScope.usuarioLogado);
        $rootScope.$broadcast('$loginSuccess', $rootScope.usuarioLogado);
        $location.url('/');
      }, function(respFail){
        console.log('Falhou login!');
        $rootScope.$broadcast('$loginFailed', respFail.data);
      });
    };

    $rootScope.doLogout = function(){
      // FB.logout(function(response) {
      //   // user is now logged out
      //   $rootScope.$apply(function() {
          $rootScope.usuarioLogado = undefined;
          UserService.removeUserLogged();
          $location.url('/');
      //   });
      // });
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
