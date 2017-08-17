'use strict';

describe('Service: urlMpCheckout', function () {

  // load the service's module
  beforeEach(module('maximushcApp'));

  // instantiate service
  var urlMpCheckout;
  beforeEach(inject(function (_urlMpCheckout_) {
    urlMpCheckout = _urlMpCheckout_;
  }));

  it('should do something', function () {
    expect(!!urlMpCheckout).toBe(true);
  });

});
