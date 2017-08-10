'use strict';

describe('Service: URLBACKEND', function () {

  // load the service's module
  beforeEach(module('maximushcApp'));

  // instantiate service
  var URLBACKEND;
  beforeEach(inject(function (_URLBACKEND_) {
    URLBACKEND = _URLBACKEND_;
  }));

  it('should do something', function () {
    expect(!!URLBACKEND).toBe(true);
  });

});
