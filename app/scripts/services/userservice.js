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

  UserService.$inject = ['$http'];

  function UserService($http){

    var service = {
      getRoleByUserEmail : getRoleByUserEmail
    };

    return service;


    function getRoleByUserEmail(email){
      return $http.get('http://localhost/maximushc-backend/users/email/' + email);
    }


  }
