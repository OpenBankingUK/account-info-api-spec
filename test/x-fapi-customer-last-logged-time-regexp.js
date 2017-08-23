'use strict';

const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');
const swaggerFilePath = path.resolve('./dist/account-info-swagger.yaml');
const assert = require('assert');
const spec = YAML.load(fs.readFileSync(swaggerFilePath).toString());

const params = spec.paths["/account-requests"].post.parameters;
const pattern = params.find(p => p.name === "x-fapi-customer-last-logged-time").pattern;
const regexp = new RegExp(pattern);

describe('x-fapi-customer-last-logged-time regexp', function() {

  it('matches FAPI example date', (done) => {
    const fapiDateExample = "Tue, 11 Sep 2012 19:43:31 UTC";
    assert(fapiDateExample.match(regexp));
    done();
  });

  it('matches RFC7231 example date', (done) => {
    const rfc7231DateExample = "Sun, 06 Nov 1994 08:49:37 GMT";
    assert(rfc7231DateExample.match(regexp));
    done();
  });

  it('does not match date with non GMT|UTC timezone', (done) => {
    assert(!"Sun, 06 Nov 1994 08:49:37 MST".match(regexp));
    done();
  });

  it('does not match RFC7231 example obsolete dates', (done) => {
    assert(!"Sunday, 06-Nov-94 08:49:37 GMT".match(regexp));
    assert(!"Sun Nov  6 08:49:37 1994".match(regexp));
    done();
  });
});
