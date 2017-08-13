'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:SociotorcedorCtrl
 * @description
 * # SociotorcedorCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('SociotorcedorCtrl', SocioTorcedorCtrl);

SocioTorcedorCtrl.$inject = ['$scope', '$rootScope'];

function SocioTorcedorCtrl ($scope, $rootScope) {

  // Verificar se o usuário é sócio, se tem pagamento concluído e aprovado sem cartão vinculado.

  // Não sendo sócio, redirecionar para tela inicial.

  // Se não tem pagamento aprovado, nem cartão já vinculado e em validade, habilita pagamento.

  // Se tem pagamento aprovado sem cartão vinculado, habilita a vinculação do cartão.

  // Se tem cartão vinculado e em validade, habilita ver informações de pagamento.

  
}
