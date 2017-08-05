'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('HomeCtrl', ['$rootScope', '$timeout', '$location', '$mdSidenav', 'UserService', function($rootScope, $timeout, $location, $mdSidenav, UserService){
  var vm = this;

  vm.menuPages = [
    {
      id : 'atleta',
      label : 'Área dos Atletas',
      location : 'atleta',
      order : 2
    },
    {
      id : 'dirigente',
      label : 'Área dos Dirigentes',
      location : 'dirigente',
      order : 3
    },
    {
      id : 'tecnico',
      label : 'Área da Comissão Técnica',
      location : 'tecnico',
      order : 1
    },
    {
      id : 'sysadmin',
      label : 'Área do SysAdmin',
      location : 'sysadmin',
      order : 4
    },
    {
      id : 'acesso',
      label : 'Acessar',
      location : 'entrar',
      order : 0
    },
    {
      id : 'acesso-cadastrar-socio',
      label : 'Acessar',
      location : 'entrar-cadastrar-socio',
      order : 0
    }
  ];


  vm.homePage = {
    id : 'home',
    label : 'Home',
    location : 'home'
  };

  vm.currentPage = vm.homePage;

  // Declaração de funções.
  vm.setAreaLocation = setAreaLocation;
  vm.toggleLeft = buildToggler('left-sidenav');

  $rootScope.$on('$locationChangeSuccess', function () {
      setAreaLocation($location.path().replace('/',''));
  });

  $rootScope.$on('$loginSuccess', function () {
    if($rootScope.usuarioLogado){
      UserService.getRoleByUserEmail($rootScope.usuarioLogado.email).then(function(httpResponse){
        $rootScope.usuarioLogado.localId = httpResponse.data.id;
        $rootScope.usuarioLogado.roles = httpResponse.data.roles;
        console.log($rootScope.usuarioLogado);

      });
    }
  });

  //$rootScope.checkLoginState();


  // Implementação de funções
  function setAreaLocation(location){
    var paginaLocalizada = false;
    vm.menuPages.forEach(function(page){
      if(page.location === location){
        vm.currentPage = page;
        paginaLocalizada = true;
      }
    });

    if($rootScope.usuarioLogado){
      if(location === 'entrar' || location.indexOf('entrar') === 0){
        $location.url('/');
      } else {
        $location.url('/' + location);
      }
    } else {
      if(location !== 'entrar' && location.indexOf('entrar') !== 0){
        $location.url('/');
      }
    }

    if(location !== 'entrar' && !paginaLocalizada){
      vm.currentPage = vm.homePage;
    }

    if($mdSidenav('left-sidenav').isOpen()){
      vm.toggleLeft();
    }
  }

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }

}]);
