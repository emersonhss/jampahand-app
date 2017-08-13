'use strict';

describe('Controller: SociotorcedorCtrl', function () {

  // load the controller's module
  beforeEach(module('maximushcApp'));

  var SociotorcedorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SociotorcedorCtrl = $controller('SociotorcedorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SociotorcedorCtrl.awesomeThings.length).toBe(3);
  });
});
