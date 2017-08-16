'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:SocioTorcedorCtrl
 * @description
 * # SocioTorcedorCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('SocioTorcedorCtrl', SocioTorcedorCtrl);

SocioTorcedorCtrl.$inject = ['$scope', '$rootScope', 'SocioService', '$location'];

function SocioTorcedorCtrl ($scope, $rootScope, SocioService, $location) {


  if(!$rootScope.usuarioLogado || !$rootScope.usuarioLogado.pessoa_fisica_id || !$rootScope.hasRole('socio-torcedor')){
    $location.url('/');
    return;
  }

  var vm = this;
  vm.habilitarEfetuarPagamento = false;
  vm.habilitarVincularCartaoSocio = false;
  vm.habilitarVerCartaoSocio = false;
  vm.pagamentoAprovadoSemCartaoAssociado = undefined;
  vm.cartaoSocioTorcedorVinculado = undefined;

  buscarPagamentoAprovadoSemCartaoAssociado();

  function buscarPagamentoAprovadoSemCartaoAssociado(){
    SocioService.consultaPagamentoAprovadoSemCartaoAssociado($rootScope.usuarioLogado.pessoa_fisica_id)
    .then(function (responseSuccess){
      vm.habilitarEfetuarPagamento = false;
      vm.habilitarVincularCartaoSocio = true;
      vm.pagamentoAprovadoSemCartaoAssociado = responseSuccess.data;
      console.log(vm.pagamentoAprovadoSemCartaoAssociado);
    }, function(responseError){
        if(responseError.status === 404){
          console.log('Não há pagamento aprovado sem cartão.');  
          // Verificar se usuário já possui cartão.
          buscarCartaoSocioTorcedorVinculado();
          // Caso positivo, habilita para ver o cartão, caso negativo desabilita área.
        } else {
          console.log("Falha inesperada ao consultar pagamento aprovado sem cartão assoiado.");
        }
    });
  }

  function buscarCartaoSocioTorcedorVinculado(){
    SocioService.consultaConsultarCartaoVinculadoAtivoOuPendente($rootScope.usuarioLogado.pessoa_fisica_id)
    .then(function (responseSuccess){
      vm.habilitarEfetuarPagamento = false;
      vm.habilitarVincularCartaoSocio = false;
      vm.habilitarVerCartaoSocio = true;
      vm.cartaoSocioTorcedorVinculado = responseSuccess.data;
      console.log(vm.cartaoSocioTorcedorVinculado);
    }, function(responseError){
        if(responseError.status === 404){
          console.log('Não há cartão aprovado ou pendente vinculado.');  
          // Não possui cartão
          // Se possui pagamento
          if(vm.pagamentoAprovadoSemCartaoAssociado){
            vm.habilitarEfetuarPagamento = false;
          } else {
            vm.habilitarEfetuarPagamento = true;
          }

          // Caso positivo, habilita para ver o cartão, caso negativo desabilita área.
        } else {
          console.log("Falha inesperada ao consultar pagamento aprovado sem cartão assoiado.");
          vm.habilitarEfetuarPagamento = false;
          vm.habilitarVincularCartaoSocio = false;
          vm.habilitarVerCartaoSocio = true;
        }
    });
  }

  // Verificar se o usuário é sócio, se tem pagamento concluído e aprovado sem cartão vinculado.

  // Não sendo sócio, redirecionar para tela inicial.

  // Se não tem pagamento aprovado, nem cartão já vinculado e em validade, habilita pagamento.

  // Se tem pagamento aprovado sem cartão vinculado, habilita a vinculação do cartão.

  // Se tem cartão vinculado e em validade, habilita ver informações de pagamento.

  
}
