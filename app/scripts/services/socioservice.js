'use strict';

/**
 * @ngdoc service
 * @name maximushcApp.socioservice
 * @description
 * # socioservice
 * Service in the maximushcApp.
 */
angular.module('maximushcApp')
  .service('SocioService', SocioService);

SocioService.$inject = ['$http', 'URLBACKEND'];

function SocioService($http, URLBACKEND){
  
  const URL_RESOURCE = URLBACKEND + '/socios';

  var service = {
    inserir : inserir,
    inserirPagamento : inserirPagamento,
    inserirCartao : inserirCartao,
    consultaPagamentoAprovadoSemCartaoAssociado : consultaPagamentoAprovadoSemCartaoAssociado,
    consultaConsultarCartaoVinculadoAtivoOuPendente : consultaConsultarCartaoVinculadoAtivoOuPendente
  };

  return service;

  function inserir(socio){
    return $http.post(URL_RESOURCE + '/', socio);
  }

  function inserirPagamento(socioId, pagamento){
    return $http.post(URL_RESOURCE + '/'+ socioId + '/pagamento/', pagamento);
  }

  function inserirCartao(socioId, numeroCartao, pagamento){
    var cartao = {};
    cartao.numero = numeroCartao;
    cartao.pagamento_socio_id = pagamento;
    return $http.post(URL_RESOURCE + '/'+ socioId + '/cartao/', cartao);
  }

  function consultaPagamentoAprovadoSemCartaoAssociado(socioId){
    return $http.get(URL_RESOURCE + '/' + socioId + '/pagamento/aprovado/semcartao/');
  }


  function consultaConsultarCartaoVinculadoAtivoOuPendente(socioId){
    return $http.get(URL_RESOURCE + '/' + socioId + '/cartao/aprovado/');
  }

}
