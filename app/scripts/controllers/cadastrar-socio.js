'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:CadastrarSocioCtrl
 * @description
 * # CadastrarSocioCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp').controller('CadastrarSocioCtrl', CadastrarSocioCtrl);
  
CadastrarSocioCtrl.$inject = ['$scope', 'mercadopago', '$location', 'SocioService', '$mdToast', 'urlMpCheckout'];
  
function CadastrarSocioCtrl ($scope, mercadopago, $location, SocioService, $mdToast, urlMpCheckout) {
  
  var vm = this;
  
  vm.socio = {};
  vm.socio.usuario = {};
  vm.socio.pessoa_fisica = {};
  vm.senhaUsuario = '';
  vm.senhaConfirmar = '';
  vm.possuoCartao = false;
  
  vm.linkPesquisaCep = 'http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCep.cfm';
  vm.ufs = ['AC','AL','AP','AM','BA','MT','MS','MG','RS','PR','SC','SP','RJ','ES','GO','DF','PA','PB','PE','SE','RN','CE','PI','MA','RR','RO','TO'].sort();
  vm.cadastroRealizado = false;
  vm.mensagemStatusPagamento = '';
  vm.solicitarNumeroCartao = false;
  vm.pagamento = {};

  // Load MercadoPago scripts 
  mercadopago.loadRender();

  vm.cadastrar = function(){
    
    var formValido = true;

    angular.forEach($scope.formCadastroSocio.$error, function (error) {
        angular.forEach(error, function(errorField){
            errorField.$setDirty();
            formValido = false;
        });
    });
    
    if(formValido){
      vm.socio.pessoa_fisica.estado_civil = 'N';
      vm.socio.pessoa_fisica.data_nascimento = vm.dataNascimento.substr(4) + '-' + vm.dataNascimento.substr(2,2) + '-' + vm.dataNascimento.substr(0,2);
      vm.socio.usuario.password = sha256(vm.senhaUsuario);
      vm.senhaUsuario = '';
      vm.senhaConfirmar = '';
      SocioService.inserir(vm.socio).then(function(response){ // Success
        vm.cadastroRealizado = true;
        vm.socio = response.data;
        // loads the Mercadopago render script to styliz
        $scope.formCadastroSocio.$setPristine();
      }, function(response){ // Fail
        console.log('Falha ao inserir sócio.');
        
        var mensagem = '';
        if(response.status === 422) {
          mensagem = response.data.mensagem;
        } else {
          mensagem = 'Falha inesperada ao cadastrar sócio!';
        }
        // TODO tratar erros de validação.
        var toast = $mdToast.simple()
          .textContent(mensagem)
          .action('FECHAR')
          .highlightAction(true)
          .highlightClass('md-warn')
          .hideDelay(10000)
          .position('top right');

        $mdToast.show(toast).then(function(responseToast) {
          
        });

        //
      });
    }
  };

  // Open the modal to make the payment.
  vm.pagar = function () {
    vm.mensagemStatusPagamento = '';
    vm.solicitarNumeroCartao = false;

      mercadopago.openCheckout({
          url: urlMpCheckout
      }).then(function (response) {
        console.log('Processo de pagamento concluído com status de sucesso!');
          // handles the success operation.
          vm.socio.pagamento = {
            idMercadoPago : response.collection_id,
            statusMercadoPago : response.collection_status
          };
          if(vm.socio.pagamento.statusMercadoPago === 'approved'){
            vm.mensagemStatusPagamento = 'Pagamento aprovado! Informar o número do cartão do Sócio-Torcedor para habilitação.';
            vm.solicitarNumeroCartao = true;
          } else if(vm.socio.pagamento.statusMercadoPago === 'pending'){
            vm.mensagemStatusPagamento = 'Pagamento pendente! O usuário não completou o pagamento.';
          } else if(vm.socio.pagamento.statusMercadoPago === 'in_process'){
            vm.mensagemStatusPagamento = 'Pagamento em processamento! O pagamento está em processo de revisão.';
          } else if(vm.socio.pagamento.statusMercadoPago === 'rejected'){
            vm.mensagemStatusPagamento = 'Pagamento rejeitado! O pagamento foi rejeitado, então o usuário poderá tentar refazê-lo mais tarde.';
          } else {
            vm.mensagemStatusPagamento = 'Nenhum pagamento foi gerado! O usuário não completou o processo de pagamento.';
          }
          SocioService.inserirPagamento(vm.socio.pessoa_fisica.id, vm.socio.pagamento).then(function(resp){
            console.log('Pagamento cadastrado no sitema do Maximus.');
            vm.socio.pagamento = resp;
          }, function(resp){
            vm.mensagemStatusPagamento += "<br>" + "Não foi possível salvar o número do pagamento em nossa base agora, então guarde esse número poise podemos precisar confirmá-lo posteriormente.";
          });

      }, function (err) {
          console.log('Processo de pagamento concluído com status inválido!');
          // handles the failed operation.
          // TODO ajustar código de exemplo
          vm.mensagemStatusPagamento = 'Nenhum pagamento foi gerado! O usuário não completou o processo de pagamento.';          
      });
  };

  vm.finalizar = function(){
    alert('Cadastro de Sócio-Torcedor finalizado!');
    $location.url('/');
  };
}
