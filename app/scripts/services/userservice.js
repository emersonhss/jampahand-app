'use strict';

/**
 * @ngdoc service
 * @name maximushcApp.UserService
 * @description
 * # UserService
 * Factory in the maximushcApp.
 */
angular.module('maximushcApp')
  .factory('UserService', UserService);

  UserService.$inject = ['$http', 'URLBACKEND'];

  function UserService($http, URLBACKEND){

    const URL_RESOURCE = URLBACKEND + '/users';

    var service = {
      getRoleByUserEmail : getRoleByUserEmail,
      executeLogin : executeLogin
    };

    return service;


    function getRoleByUserEmail(email){
      return $http.get(URL_RESOURCE + '/email/' + email);
    }

    function executeLogin(credentials) {
      return $http.post(URL_RESOURCE + '/login/',credentials);
    }


  }
