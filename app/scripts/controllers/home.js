'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('HomeCtrl', HomeCtrl);
  
HomeCtrl.$inject = ['$rootScope', '$timeout', '$location', '$mdSidenav', 'UserService','$filter', '$window', '$scope', '$mdToast'];

function HomeCtrl($rootScope, $timeout, $location, $mdSidenav, UserService, $filter, $window, $scope, $mdToast) {
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

  vm.trocarSenhaShow = false;
  
  // Declaração de funções.
  vm.setAreaLocation = setAreaLocation;
  vm.getMenuPagesUser = getMenuPagesUser;
  vm.toggleLeft = buildToggler('left-sidenav');
  vm.exibirTrocarSenha = exibirTrocarSenha;
  vm.cancelarTrocarSenha = cancelarTrocarSenha;
  vm.confirmarTrocarSenha = confirmarTrocarSenha;

  loadUserLoggedConfig();

  // Observadores de mensagens

  $rootScope.$on('$locationChangeSuccess', function () {
    setAreaLocation($location.path().replace('/',''));
  });

  $rootScope.$on('$loginSuccess', function () {
    loadUserLoggedConfig();
  });


  // Funções

  // Implementação de funções
  function setAreaLocation(location){
    var paginaLocalizada = false;
    vm.menuPages.forEach(function(page){
      if(page.location === location){
        vm.currentPage = page;
        paginaLocalizada = true;
      }
    });

    if(paginaLocalizada){
      if($rootScope.usuarioLogado){
        if(location !== 'entrar' && location.indexOf('entrar') !== 0){
          // Se não, segue com a location.
          $location.url('/' + location);
        } else {
          // então redireciona para tela inicial.
          $location.url('/');
          vm.currentPage = vm.homePage;
        }
      } else {
         if(location !== 'entrar' && location.indexOf('entrar') !== 0){
           $window.localStorage.setItem('requested_location', location);
           $location.url('/entrar');
         } else {
           $location.url('/' + location);
         }
      }
    } else {
      $location.url('/');      
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

  function loadUserLoggedConfig(){
    if($rootScope.usuarioLogado){
      console.log('Carregando configurações de usuário logado.');
      vm.menuPagesUser = getMenuPagesUser($rootScope.usuarioLogado.roles);
      var requestedLocation = $window.localStorage.getItem('requested_location');
      if(requestedLocation){
        console.log(requestedLocation);
        $window.localStorage.removeItem('requested_location');
        $location.url('/' + requestedLocation);
      } else  {
        if($rootScope.usuarioLogado && $rootScope.usuarioLogado.roles && $rootScope.usuarioLogado.roles.length === 1){
          setAreaLocation($rootScope.usuarioLogado.roles[0].name);
        } else {
          vm.currentPage = vm.homePage;
        }
      }
    }
  }

  function exibirTrocarSenha(){
    if(!vm.trocarSenhaShow){
      vm.trocarSenhaShow = true;
    }
  }

  function cancelarTrocarSenha(){
    if(vm.trocarSenhaShow){
      vm.trocarSenhaShow = false;
      limparCamposSenha();
    }
  }

  function confirmarTrocarSenha(){
    if(vm.trocarSenhaShow){
      var formValido = true;

      angular.forEach($scope.formTrocaSenha.$error, function (error) {
        angular.forEach(error, function(errorField){
            errorField.$setDirty();
            formValido = false;
        });
      });
      
      if(formValido){
        console.log('Submeter a troca de senha e aguardar a resposta para confirmar.');  
        UserService.executeChangePassword($rootScope.usuarioLogado.id, vm.senhaAtual, vm.novaSenha).then(function(response){
          vm.trocarSenhaShow = false;
          var toast = $mdToast.simple()
            .textContent('Senha atualizada com sucesso!')
            .action('OK!')
            .highlightAction(true)
            .highlightClass('md-success')
            .hideDelay(5000)
            .position('top right');

          $mdToast.show(toast).then(function(responseToast) {
            
          });
          limparCamposSenha();
        }, function(response){
          console.log(response);

          var mensagem = 'Falha ineperada!';
          if(response.status === 400){
            mensagem = response.data[0].mensagem;
          } else {
            mensagem += ' ' + response.data;
          }

          var toast = $mdToast.simple()
            .textContent(mensagem)
            .action('ENTENDI')
            .highlightAction(true)
            .highlightClass('md-warn')
            .hideDelay(5000)
            .position('top right');

          $mdToast.show(toast).then(function(responseToast) {
            
          });
          limparCamposSenha();
        });
        
      }
    }
  }

  function limparCamposSenha(){
    vm.senhaAtual = undefined;
    vm.novaSenha = undefined;
    vm.confirmaSenha = undefined;
    $scope.formTrocaSenha.$setPristine();
  }

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }

}
