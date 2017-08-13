'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:EntrarCtrl
 * @description
 * # EntrarCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('EntrarCtrl', EntrarCtrl);

EntrarCtrl.$inject = ['$scope', '$rootScope', 'UserService', '$mdToast'];

function EntrarCtrl($scope, $rootScope, UserService, $mdToast){

  var vm = this;
  vm.user = {};

  $rootScope.$on('$loginFailed', function (event, response) {
    console.log('Recebendo broadcast de falha no login.');
    vm.user.password = '';
    if(!response){
      response = { error : 'Falha inesperada ao tentar realizar a autenticação.' };
    }
    var toast = $mdToast.simple()
      .textContent(response.error)
      .action('FECHAR')
      .highlightAction(true)
      .highlightClass('md-warn')
      .hideDelay(10000)
      .position('top right');

    $mdToast.show(toast).then(function(responseToast) {
      
    });
  });

  vm.doLogin = function(){

    var formValido = true;

    angular.forEach($scope.formLogin.$error, function (error) {
        angular.forEach(error, function(errorField){
            errorField.$setDirty();
            formValido = false;
        });
    });
    
    if(formValido){
      $rootScope.doLogin(vm.user);
      $scope.formLogin.$setPristine();
    }
  };

}
