'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('HomeCtrl', ['$rootScope', '$timeout', '$location', '$mdSidenav', 'UserService','$filter', function($rootScope, $timeout, $location, $mdSidenav, UserService, $filter){
  var vm = this;

  vm.menuPages = [
    {
      id : 'atleta',
      label : 'Área dos Atletas',
      location : 'atleta',
      order : 2,
      viewInMenu : true
    },
    {
      id : 'dirigente',
      label : 'Área dos Dirigentes',
      location : 'dirigente',
      order : 3,
      viewInMenu : true
    },
    {
      id : 'tecnico',
      label : 'Área da Comissão Técnica',
      location : 'tecnico',
      order : 1,
      viewInMenu : true
    },
    {
      id : 'sysadmin',
      label : 'Área do SysAdmin',
      location : 'sysadmin',
      order : 4,
      viewInMenu : true
    },
    {
      id : 'socio-torcedor',
      label : 'Área do Sócio-Torcedor',
      location : 'socio-torcedor',
      order : 5,
      viewInMenu : true
    },
    {
      id : 'parceiro-socio-torcedor',
      label : 'Área do Parceiro',
      location : 'parceiro-socio-torcedor',
      order : 6,
      viewInMenu : true
    },
    {
      id : 'adm-socio-torcedor',
      label : 'Área de Gestão do Sócio-Torcedor',
      location : 'adm-socio-torcedor',
      order : 7,
      viewInMenu : true
    },
    {
      id : 'acesso',
      label : 'Acessar',
      location : 'entrar',
      order : 0,
      viewInMenu : false
    },
    {
      id : 'acesso-cadastrar-socio',
      label : 'Cadastrar',
      location : 'entrar-cadastrar-socio',
      order : 0,
      viewInMenu : false
    }
  ];

  vm.menuPagesUser = [];


  vm.homePage = {
    id : 'home',
    label : 'Home',
    location : 'home'
  };

  // Declaração de funções.
  vm.setAreaLocation = setAreaLocation;
  vm.getMenuPagesUser = getMenuPagesUser;
  vm.toggleLeft = buildToggler('left-sidenav');

  if($rootScope.usuarioLogado && $rootScope.usuarioLogado.roles && $rootScope.usuarioLogado.roles.length === 1){
    setAreaLocation($rootScope.usuarioLogado.roles[0].name);
    vm.menuPagesUser = getMenuPagesUser($rootScope.usuarioLogado.roles);
  } else {
    vm.currentPage = vm.homePage;
  }

  $rootScope.$on('$locationChangeSuccess', function () {
      setAreaLocation($location.path().replace('/',''));
  });

  $rootScope.$on('$loginSuccess', function () {
    if($rootScope.usuarioLogado){
      // UserService.getRoleByUserEmail($rootScope.usuarioLogado.email).then(function(httpResponse){
      //   $rootScope.usuarioLogado.localId = httpResponse.data.id;
      //   $rootScope.usuarioLogado.roles = httpResponse.data.roles;
      //   console.log($rootScope.usuarioLogado);

      // });
      console.log('Recebendo broadcast de login.');
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
      // Se o usuário estiver logado e tenar acessar uma das telas públicas de acesso
      if(location === 'entrar' || location.indexOf('entrar') === 0){
        // então redireciona para tela inicial.
        $location.url('/');
      } else {
        // Se não, segue com a location.
        $location.url('/' + location);
      }
    } else {
      // Se o usuário não estiver logado e tentar acessar uma área não pública
      if(location !== 'entrar' && location.indexOf('entrar') !== 0){
        // Emt]ap redireciona para a tela inicial.
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

  function getMenuPagesUser(roles){
    var menusUsuario = [];
    if(roles){
      angular.forEach(roles, function(role){
        var menuToRole = $filter('filter')(vm.menuPages, {id: role.name}, true);
        console.log(menuToRole);
        menusUsuario.push(menuToRole[0]);
      });
    }
    return menusUsuario;
  }

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }

}]);
