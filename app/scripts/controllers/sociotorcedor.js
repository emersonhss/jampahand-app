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

SocioTorcedorCtrl.$inject = ['$scope', '$rootScope', 'SocioService', '$location', '$mdDialog', 'mercadopago', '$mdToast'];

function SocioTorcedorCtrl ($scope, $rootScope, SocioService, $location, $mdDialog, mercadopago, $mdToast) {


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
  vm.vincularPagamentoCartao = vincularPagamentoCartao;
  vm.pagar = pagar;
  vm.verCartao = verCartao;

  // Verificar se o usuário é sócio, se tem pagamento concluído e aprovado sem cartão vinculado.
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
            // Load MercadoPago scripts 
            mercadopago.loadRender();
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

  function vincularPagamentoCartao(ev){
    $mdDialog.show({
      controller: DialogVincularCartaoController,
      templateUrl: 'views/dialog.vincularCartaoSocio.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false // Only for -xs, -sm breakpoints.
    })
    .then(function(numeroCartao) {
      console.log('Resposva vínculo do cartão: ' + answer);
      if(numeroCartao){
          // Submeter de fato a vinculação do cartão.

          SocioService.inserirCartao($rootScope.usuarioLogado.pessoa_fisica_id, numeroCartao, vm.pagamentoAprovadoSemCartaoAssociado.id)
            .then(function(respSuccess){
              vm.habilitarEfetuarPagamento = false;
              vm.habilitarVincularCartaoSocio = false;
              vm.habilitarVerCartaoSocio = true;
              vm.cartaoSocioTorcedorVinculado = respSuccess.data;

            },function(resp){

              console.log(resp);
              var mensagem = '';
              if(resp.status === 422){
                mensagem = resp.data.error;
              } else {
                mensagem = 'Falha inesperada ao vincular cartão ao Sócio.';
              }
              var toast = $mdToast.simple()
              .textContent(mensagem)
              .action('FECHAR')
              .highlightAction(true)
              .highlightClass('md-warn')
              .hideDelay(10000)
              .position('top right');

              $mdToast.show(toast).then(function(responseToast) {  });

            });

      }
    }, function() {
     console.log('You cancelled the dialog.');
    });
  }


  function pagar(ev){
    // Versão de teste
      var preferenceId = '268296318-e5fb75db-c6bb-449e-972d-36ff3b96c86d';

      mercadopago.openCheckout({
          url: 'https://www.mercadopago.com/mlb/checkout/start?pref_id=' + preferenceId
      }).then(function (response) {
        console.log('Processo de pagamento concluído com status de sucesso!');
        console.log(response);
          // handles the success operation.
          vm.pagamentoAprovadoSemCartaoAssociado = {
            idMercadoPago : response.collection_id,
            statusMercadoPago : response.collection_status
          };
          SocioService.inserirPagamento($rootScope.usuarioLogado.pessoa_fisica_id, vm.pagamentoAprovadoSemCartaoAssociado).then(function(resp){
            console.log('Pagamento cadastrado no sitema do Maximus.');
            vm.habilitarEfetuarPagamento = false;
            vm.habilitarVincularCartaoSocio = true;
            console.log(resp);
            vm.pagamentoAprovadoSemCartaoAssociado = resp.data;
            var toast = $mdToast.simple()
              .textContent('Pagamento '+  vm.pagamentoAprovadoSemCartaoAssociado.idMercadoPago + ' cadastrado registrado na situação "' +  vm.pagamentoAprovadoSemCartaoAssociado.statusMercadoPago + '".')
              .action('OK')
              .highlightAction(true)
              .highlightClass('md-success')
              .hideDelay(10000)
              .position('top right');

            $mdToast.show(toast).then(function(responseToast) { });
          }, function(resp){
            console.log(resp);
            var mensagem = 'Não foi possível salvar o pagamento '+ vm.pagamentoAprovadoSemCartaoAssociado.idMercadoPagoem 
              +' nossa base agora, então guarde esse número pois podemos precisar confirmá-lo posteriormente.';
            var toast = $mdToast.simple()
              .textContent(mensagem)
              .action('FECHAR')
              .highlightAction(true)
              .highlightClass('md-warn')
              .hideDelay(10000)
              .position('top right');

            $mdToast.show(toast).then(function(responseToast) {  });
          });

      }, function (err) {
          console.log('Processo de pagamento concluído com status inválido!');
          // handles the failed operation.
          console.log(err);

          var mensagem = 'Nenhum pagamento foi gerado! O usuário não completou o processo de pagamento.';
            var toast = $mdToast.simple()
              .textContent(mensagem)
              .action('FECHAR')
              .highlightAction(true)
              .highlightClass('md-warn')
              .hideDelay(10000)
              .position('top right');

            $mdToast.show(toast).then(function(responseToast) {
            });   
      });
  }

  function verCartao(ev){
    $mdDialog.show({
      controller: DialogVerCartaoVinculadoController,
      templateUrl: 'views/dialog.verCartaoSocio.html',
      locals : {
        cartaoVinculado : vm.cartaoSocioTorcedorVinculado,
        nome : $rootScope.usuarioLogado.nome
      },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false // Only for -xs, -sm breakpoints.
    })
    .then(function() {
     
    }, function() {
     console.log('You cancelled the dialog.');
    });
  }
  

  // Não sendo sócio, redirecionar para tela inicial.

  // Se não tem pagamento aprovado, nem cartão já vinculado e em validade, habilita pagamento.

  // Se tem pagamento aprovado sem cartão vinculado, habilita a vinculação do cartão.

  // Se tem cartão vinculado e em validade, habilita ver informações de pagamento.

  
}

DialogVincularCartaoController.$inject = ['$scope', '$mdDialog'];

function DialogVincularCartaoController($scope, $mdDialog) {
  $scope.numeroCartao = '';

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.vincular = function() {
    // Submter associação do cartão ao pagamento.
    $mdDialog.hide('ok');
  };
}


DialogVerCartaoVinculadoController.$inject = ['$scope', '$mdDialog','cartaoVinculado', 'nome'];

function DialogVerCartaoVinculadoController($scope, $mdDialog, cartaoVinculado, nome) {
  $scope.cartao = cartaoVinculado;
  $scope.nome = nome;

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}