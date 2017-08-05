'use strict';

describe('Controller: CadastrarSocioCtrl', function () {

  // load the controller's module
  beforeEach(module('maximushcApp'));

  var CadastrarSocioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CadastrarSocioCtrl = $controller('CadastrarSocioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CadastrarSocioCtrl.awesomeThings.length).toBe(3);
  });
});
