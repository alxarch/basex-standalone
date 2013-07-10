'use strict';

var basex = require('../lib/basex-standalone.js');

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

basex.env.basexjar = 'tmp/basex.jar';
basex.env.basexpath = 'tmp/basex';

var one_to_ten = {
  xquery: '1 to 10'
, expect: '1 2 3 4 5 6 7 8 9 10'
}

exports['basex'] = {
  setUp: function(done) {
    // setup here
    done()
  },
  'simple query': function(test) {
    test.expect(1);
    // tests here
    var b = new basex()
    b.exec(one_to_ten).then(function(actual){
      test.equal(actual, one_to_ten.expect, 'should run simple queries.')
      test.done()
    })
  },
  'escape xquery': function(test){
      test.expect(1);
      basex({ xquery: 'for $n in 1 to 10 return $n'})
        .done(function(data){
            test.equal(data, one_to_ten.expect, "Escapes $ sign properly.")
            test.done()
        })
  },
  'debug': function(test) {
    test.expect(1);
    // tests here
    basex({ xquery: '1 to 10wrr-', debug: true})
      .fail(function(error){
        var contains = 'org.basex.query.QueryException'
        test.ok(error.message.indexOf(contains) > -1, 'Debug info in error message.')
        test.done()
      })
  },
  'simple command': function(test) {
    test.expect(1)
    // tests here
   
    basex({ commands: ['INFO']})
      .then(function(data){
        test.ok(data.match(/General Information/), 'should run simple queries.')
        test.done()
      })
  },
  'callable': function(test) {
    test.expect(1);
    // tests here
    
    basex(one_to_ten)
      .then(function(data){
        test.equal(data, one_to_ten.expect, 'should be callable directly.')
        test.done()
      })
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    basex().then(function(data){
      test.equal(data, '', 'should run empty without outout.')
      test.done()
    })
  },
};
