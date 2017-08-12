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

  UserService.$inject = ['$http', 'URLBACKEND', '$window', '$base64'];

  function UserService($http, URLBACKEND, $window, $base64){

    const URL_RESOURCE = URLBACKEND + '/users';
    const USER_STORE_KEY = sha256('usrlogged');

    var service = {
      getRoleByUserEmail : getRoleByUserEmail,
      executeLogin : executeLogin,
      executeChangePassword : executeChangePassword,
      getUserLogged : getUserLogged,
      setUserLogged : setUserLogged,
      removeUserLogged : removeUserLogged
    };

    return service;


    function getRoleByUserEmail(email){
      return $http.get(URL_RESOURCE + '/email/' + email);
    }

    function executeLogin(credentials) {
      return $http.post(URL_RESOURCE + '/login/',credentials);
    }

    function executeChangePassword(userId, oldPassword, newPassword) {
      var passwords = { oldPassword : sha256(oldPassword), newPassword : sha256(newPassword) };
      return $http.put(URL_RESOURCE + '/' + userId + '/password/', passwords);
    }

    function getUserLogged() {
      var userLogged = $window.localStorage.getItem(USER_STORE_KEY);
      if(userLogged) {
        userLogged = JSON.parse($base64.decode(userLogged));
      }
      return userLogged;
    }

    function setUserLogged(user) {
      $window.localStorage.setItem(USER_STORE_KEY, $base64.encode(JSON.stringify(user)));
    }

    function removeUserLogged(user) {
      $window.localStorage.removeItem(USER_STORE_KEY);
    }


  }
