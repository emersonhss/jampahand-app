'use strict';

describe('Service: socioservice', function () {

  // load the service's module
  beforeEach(module('maximushcApp'));

  // instantiate service
  var socioservice;
  beforeEach(inject(function (_socioservice_) {
    socioservice = _socioservice_;
  }));

  it('should do something', function () {
    expect(!!socioservice).toBe(true);
  });

});
