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
    insert : insert
  };

  return service;

  function insert(socio){
    return $http.post(URL_RESOURCE + '/', socio);
  }

}
