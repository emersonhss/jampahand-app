'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:CadastrarSocioCtrl
 * @description
 * # CadastrarSocioCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp').controller('CadastrarSocioCtrl', CadastrarSocioCtrl);
  
CadastrarSocioCtrl.$inject = ['$scope', 'mercadopago', '$location', 'SocioService'];
  
function CadastrarSocioCtrl ($scope, mercadopago, $location, SocioService) {
  var vm = this;

  vm.socio = {};
  vm.socio.usuario = {};
  vm.socio.pessoa_fisica = {};
  
  vm.linkPesquisaCep = 'http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCep.cfm';
  vm.ufs = ['AC','AL','AP','AM','BA','MT','MS','MG','RS','PR','SC','SP','RJ','ES','GO','DF','PA','PB','PE','SE','RN','CE','PI','MA','RR','RO','TO'].sort();
  vm.cadastroRealizado = false;
  vm.mensagemStatusPagamento = '';
  vm.solicitarNumeroCartao = false;
  vm.pagamento = {};

  vm.cadastrar = function(){
    console.log(vm.socio);

    var formInvalido = false;

    angular.forEach($scope.formCadastroSocio.$error, function (field) {
        angular.forEach(field, function(errorField){
            errorField.$setDirty();
            formInvalido = true;
        })
    });

    if(!formInvalido){
      vm.socio.pessoa_fisica.estado_civil = 'C';
      vm.socio.pessoa_fisica.data_nascimento = vm.dataNascimento.substr(4) + '-' + vm.dataNascimento.substr(2,2) + '-' + vm.dataNascimento.substr(0,2);
      console.log(vm.socio.pessoa_fisica.data_nascimento);
      vm.socio.usuario.password = sha256(vm.socio.usuario.password);
      SocioService.insert(vm.socio).then(function(data){ // Success
        vm.cadastroRealizado = true;
        vm.socio.usuario.password = null;
        // loads the Mercadopago render script to styliz
        vm.socio = data;
        mercadopago.loadRender();
      }, function(data){ // Fail

      });
    }
  };

  // Open the modal to make the payment.
  vm.pagar = function () {
    vm.mensagemStatusPagamento = '';
    vm.solicitarNumeroCartao = false;

      // my payment button code
      var preferenceId = '89639633-a6cae744-ed61-44cd-9183-2ba8097a1e34';

      mercadopago.openCheckout({
          url: 'https://www.mercadopago.com/mlb/checkout/start?pref_id=' + preferenceId
      }).then(function (data) {
          // handles the success operation.
          console.log(data);
          vm.pagamento.id = data.collection_id;
          vm.pagamento.status = data.collection_status;
          if(vm.pagamento.status === 'approved'){
            vm.mensagemStatusPagamento = 'Pagamento aprovado! Informar o número do cartão do Sócio-Torcedor para habilitação.';
            vm.solicitarNumeroCartao = true;
          } else if(vm.pagamento.status === 'pending'){
            vm.mensagemStatusPagamento = 'Pagamento pendente! O usuário não completou o pagamento.';
          } else if(vm.pagamento.status === 'in_process'){
            vm.mensagemStatusPagamento = 'Pagamento em processamento! O pagamento está em processo de revisão.';
            vm.solicitarNumeroCartao = true;
          } else if(vm.pagamento.status === 'rejected'){
            vm.mensagemStatusPagamento = 'Pagamento rejeitado! O pagamento foi rejeitado, então o usuário poderá tentar refazê-lo mais tarde.';
            vm.solicitarNumeroCartao = true;
          } else {
            vm.mensagemStatusPagamento = 'Nenhum pagamento foi gerado! O usuário não completou o processo de pagamento.';
            vm.solicitarNumeroCartao = true;
          }

      }, function (err) {
          // handles the failed operation.
          console.log(err);

          // TODO ajustar código de exemplo
          vm.mensagemStatusPagamento = 'Nenhum pagamento foi gerado! O usuário não completou o processo de pagamento.';
          vm.solicitarNumeroCartao = true;
      });
  };

  vm.finalizar = function(){
    alert('Cadastro de Sócio-Torcedor finalizado!');
    $location.url('/');
  };
}
