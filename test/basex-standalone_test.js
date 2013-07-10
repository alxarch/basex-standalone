'use strict';

var basex = require('../lib/basex-standalone.js');
// var fs = require('fs');
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

basex.env.jar = 'tmp/basex.jar';
basex.env.path = 'tmp/basex';

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
  'run xquery': function(test){
    test.expect(1);
    basex({
      run: 'test/fixtures/query.xql'
    }).then(function(data){
      console.log(data)
      test.equal(data, 'ok', 'should run XQuery files.')
      test.done()
    })
    .fail(function(){
      test.done(false)
    })
    
  },
  'no run xquery inline': function(test){
    test.expect(1);
    basex({
      run: '"1 to 10"'
    }).then(function(data){
      test.equal(data, '', 'should run XQuery inline.')
      test.done()
    })
    .fail(function(){
      test.done(false)
    })

    
  },
  'newline': function(test){
    test.expect(1);
    basex({
      xquery: '1 to 10',
      newline: true
    }).then(function(data){
      test.ok(data = one_to_ten.expect.replace(' ', "\n"), 'Should split results by newlines.')
      test.done()
    })
    .fail(function(){
      test.done(false)
    })

    
  },
  'run bxs': function(test){
    test.expect(1);
    basex({
      run: 'test/fixtures/info.bxs'
    }).then(function(data){
      test.ok(data.match(/General Information/g).length === 3, 'Should run Command Scripts.')
      test.done()
    })
    .fail(function(){
      test.done(false)
    })

    
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    basex().then(function(data){
      test.equal(data, '', 'should run empty without output.')
      test.done()
    })
  },
};
