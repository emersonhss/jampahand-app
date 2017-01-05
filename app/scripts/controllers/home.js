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
      $location.url('/' + location);
    } else {
      $location.url('/');
    }

    if(!paginaLocalizada){
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
