'use strict';

var basex_standalone = require('../lib/basex-standalone.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

basex_standalone.env.basexjar = 'tmp/basex.jar';
basex_standalone.env.basexpath = 'tmp/basex';

var one_to_ten = {
  xquery: '1 to 10'
, expect: '1 2 3 4 5 6 7 8 9 10'
}

exports['basex'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'simple query': function(test) {
    test.expect(1);
    // tests here
    var basex = new basex_standalone()
    basex.exec(one_to_ten, function(error, stdout){
      if(error) throw error

      test.equal(stdout, one_to_ten.expect, 'should run simple queries.')
      test.done()
    })
  },
  'debug': function(test) {
    test.expect(1);
    // tests here
    basex_standalone({ xquery: '1 to 10wrr-', debug: true}, function(error){
      if(error){
        test.ok(error.toString().match(/org\.basex\.query\.QueryException/), 'Debug info in error message.')
      }
      test.done();
    })
  },
  'simple command': function(test) {
    test.expect(1);
    // tests here
    var basex = new basex_standalone()
    basex.exec({ commands: ['INFO']}, function(error, stdout){
      if(error) throw error
      test.ok(stdout.match(/General Information/), 'should run simple queries.');
      test.done();
    })
  },
  'callable': function(test) {
    test.expect(1);
    // tests here
    
    basex_standalone(one_to_ten, function(error, stdout){
      // if(error) test.done(error)

      test.equal(stdout, one_to_ten.expect, 'should be callable directly.');
      test.done();

    })
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    var basex = new basex_standalone()
    basex.exec({}, function(error, stdout){
      if(error) throw error

      test.equal(stdout, '', 'should run empty without outout.');
      test.done();

    })
  },
};
