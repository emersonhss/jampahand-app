'use strict';

/**
 * @ngdoc function
 * @name jampahandApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the jampahandApp
 */
angular.module('jampahandApp')
  .controller('HomeCtrl', ['$rootScope', '$timeout', '$location', '$mdSidenav', function($rootScope, $timeout, $location, $mdSidenav){
  var vm = this;

  vm.menuPages = [
    {
      id : 'atletas',
      label : 'Área dos Atletas',
      location : 'atletas',
      order : 2
    },
    {
      id : 'dirigentes',
      label : 'Área dos Dirigentes',
      location : 'dirigentes',
      order : 3
    },
    {
      id : 'comissaoTecnica',
      label : 'Área da Comissão Técnica',
      location : 'comissaoTecnica',
      order : 1
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


  // Implementação de funções
  function setAreaLocation(location){
    var paginaLocalizada = false;
    vm.menuPages.forEach(function(page){
      if(page.location === location){
        vm.currentPage = page;
        paginaLocalizada = true;
      }
    });
    $location.url('/' + location);

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
