'use strict';

/**
 * @ngdoc function
 * @name maximushcApp.controller:EntrarCtrl
 * @description
 * # EntrarCtrl
 * Controller of the maximushcApp
 */
angular.module('maximushcApp')
  .controller('EntrarCtrl', EntrarCtrl);

EntrarCtrl.$inject = ['$scope', '$rootScope', 'UserService'];

function EntrarCtrl($scope, $rootScope, UserService){

  var vm = this;
  vm.user = {};

}
