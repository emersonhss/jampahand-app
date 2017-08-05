'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:CadastrarSocioCtrl
 * @description
 * # CadastrarSocioCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('CadastrarSocioCtrl', ['mercadopago', '$location' ,function (mercadopago, $location) {
    var vm = this;

    vm.socio = {};
    vm.socio.endereco = {};
    vm.socio.contatos = {};
    vm.linkPesquisaCep = 'http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCep.cfm';
    vm.ufs = ['AC','AL','AP','AM','BA','MT','MS','MG','RS','PR','SC','SP','RJ','ES','GO','DF','PA','PB','PE','SE','RN','CE','PI','MA','RR','RO','TO'].sort();
    vm.cadastroRealizado = false;
    vm.mensagemStatusPagamento = '';
    vm.solicitarNumeroCartao = false;
    vm.pagamento = {};

    vm.cadastrar = function(){
      vm.cadastroRealizado = true;
      // loads the Mercadopago render script to styliz
      mercadopago.loadRender();

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
  }]);
