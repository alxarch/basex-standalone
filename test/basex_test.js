'use strict';

var basex = require('../lib/basex.js');
var _ = require('lodash');

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

exports['basex'] = {
  setUp: function(done) {
    // setup here
    basex.defaults({
      classpath: 'tmp/basex.jar',
      basexpath: 'tmp/basex'
    })
    done()
  },
  'defaults - get': function(test){
    test.expect(1)
    test.equal(basex.defaults('basexpath'), 'tmp/basex')
    test.done()
  },
  'defaults - set': function(test){
    test.expect(5)
    var result = basex.defaults('basexpath', 'other/basex')
    test.ok(_.isPlainObject(result))
    test.equal(result.basexpath, 'other/basex')
    test.equal(basex.defaults('basexpath'), 'other/basex')
    basex.defaults('basexpath', 'tmp/basex')
    test.notEqual(basex.defaults('basexpath'), result.basexpath)
    test.equal(result.basexpath, 'other/basex')
    test.done()
  },
  'sets defaults on new instances': function(test){
    test.expect(1)

    var b = new basex({
      classpath: 'basex.jar'
    })

    test.equal(b.defaults('classpath'), 'basex.jar')

    test.done()

  },

  'defaults get overriden': function(test){
    test.expect(5)

    basex.defaults('xquery', '"A"')
    var a = new basex()
    var b = new basex({
      xquery: '"B"'
    })


    a.op()
      .then(function(result){
        test.equal(result, 'A')
        return b.op()
      })
      .then(function(result){
        
        test.equal(result, 'B')
        b.defaults('xquery', '"C"')
        return b.op()
      })
      .then(function(result){
        test.equal(result, "C")
        return b.op({xquery: '"D"'})
      })
      .then(function(result){
        test.equal(result, "D")
        basex.reset()
        basex.defaults({
          classpath : 'tmp/basex.jar',
          basexpath : 'tmp/basex'
        })

        return basex()
      })
      .then(function(result){
        test.equal(result, "")
        test.done()
      })
      .done()
  },

  'args': function(test){
    test.expect(1)
    var args = basex._args()
    test.
      equal(args[0], '()')
      test.done()
    },

  'args - xquery': function(test){
    test.expect(1)
    var args = basex._args({xquery: '1 to 10'})
    test.equal(args.join(' '), '-q 1 to 10')
    test.done()
  },

  'args - debug': function(test){
    test.expect(1)
    var args = basex._args({debug: true})
    test.equal(args.join(' '), '-d ()')
    test.done()
  },

  'args - whitespace': function(test){
    test.expect(1)
    var args = basex._args({whitespace: true})
    test.equal(args.join(' '), '-w ()')
    test.done()
  },

  'args - newline': function(test){
    test.expect(1)
    var args = basex._args({newline: true})
    test.equal(args.join(' '), '-L ()')
    test.done()
  },

  'args - update': function(test){
    test.expect(1)
    var args = basex._args({update: true})
    test.equal(args.join(' '), '-u ()')
    test.done()
  },

  'args - bind': function(test){
    test.expect(1)
    var args = basex._args({bind: {test: 'ok'}})
    test.equal(args.join(' '), '-b test=ok ()')
    test.done()
  },
  'args - bind multiple': function(test){
    test.expect(1)
    var args = basex._args({bind: {test: 'ok', myVar: 'set'}})
    test.equal(args.join(' '), '-b test=ok -b myVar=set ()')
    test.done()
  },

  'args - serializer': function(test){
    test.expect(1)
    var args = basex._args({serializer: {method: 'html'}})
    test.equal(args.join(' '), '-s method=html ()')
    test.done()
  },
  'args - serializer multiple': function(test){
    test.expect(1)
    var args = basex._args({serializer: {method: 'html', version: 5}})
    test.equal(args.join(' '), '-s method=html -s version=5 ()')
    test.done()
  },

  'args - input': function(test){
    test.expect(1)
    var args = basex._args({input: 'somefile.xml'})
    test.equal(args.join(' '), '-i somefile.xml ()')
    test.done()
  },

  'args - output': function(test){
    test.expect(1)
    var args = basex._args({output: 'somefile.xml'})
    test.equal(args.join(' '), '-o somefile.xml ()')
    test.done()
  },

  'args - order': function(test){
    test.expect(1)
    var args = basex._args({
      input: 'somefile.xml', 
      commands: 'INFO', 
      xquery: '//a',
      bind: { test: 'ok'},
      serializer: {method: 'html'},
      run: 'run.bxs'
    })
    test.equal(args.join(' '), '-b test=ok -i somefile.xml -s method=html -c INFO -q //a run.bxs')
    test.done()
  },

  'args - commands': function(test){
    test.expect(1)
    var args = basex._args({commands: ['INFO', 'INFO']})
    test.equal(args.join(' '), '-c INFO;INFO')
    test.done()
  },

  'args - run': function(test){
    test.expect(1)
    var args = basex._args({run: 'file.xq'})
    test.equal(args.join(' '), 'file.xq')
    test.done()
  },
  'op - simple query': function(test) {
    test.expect(1);
    // tests here
    var b = new basex()
    b.op('1 to 10')
      .then(function(actual){
        test.equal(actual, '1 2 3 4 5 6 7 8 9 10', 'Should run simple queries.')
        test.done()
      })
      .done()
  },
  'op - escapes xquery': function(test){
      test.expect(1);
      var b = new basex()
      b.op({ xquery: 'for $n in 1 to 10 return $n || ""'})
        .then(function(data){
            test.equal(data, '1 2 3 4 5 6 7 8 9 10', "Escapes $ and '\"' sign properly.")
            test.done()
        })
        .done()
  },

  'op - returns promise': function(test){
      test.expect(3);
      var b = new basex()
      var op = b.op()
      
      test.equal(op.constructor.name, 'Promise')
      test.ok('then' in  op)
      test.ok('fail' in  op)
      test.done()
  },

  'op - uses input doc': function(test){
      test.expect(1);
      var b = basex.partial({ 
            input: 'test/fixtures/book.html'
          })

      b('//abbr/@title/string()')
        .then(function(data){
            test.equal(data, 'ok')
            test.done()
        })
        .done()
  },

  'op - runs command scripts': function(test){
      test.expect(1);
      var b = new basex({newline: true})
      b.op('test/fixtures/info.bxs')
        .then(function(data){
            test.ok(data.match(/General Information/g).length === 3)
            test.done()
        })
        .done()
  },

  'callable - module': function(test) {
    test.expect(1);
    
    basex('1 to 10')
      .then(function(data){
        test.equal(data, '1 2 3 4 5 6 7 8 9 10', 'Module should be callable directly.')
        test.done()
      })
      .done()
  },

  'callable - instance': function(test) {
    test.expect(1);
    var b = new basex()
    b.op('1 to 10')
      .then(function(data){
        test.equal(data, '1 2 3 4 5 6 7 8 9 10', 'Instances should be callable directly.')
        test.done()
      })
      .done()
  },

  'op - run xquery from file': function(test){
    test.expect(1);
    var b = new basex()
    b.op('test/fixtures/query.xql')
      .then(function(data){
        test.equal(data, 'ok', 'Should run XQuery files.')
        test.done()
      })
      .done()
    
  },

  'spawn - returns child process': function(test){
    test.expect(1);
    var b = new basex()
    var c = b.spawn()

    test.equal(c.constructor.name, 'ChildProcess')
    test.done()
  },

  'no args': function(test) {
    test.expect(1);
    // tests here
    basex()
      .then(function(data){
        test.equal(data, '', 'should run empty without output.')
        test.done()
      })
      .done()
  },

  'classpath - multiple': function(test){
    test.expect(2);

    test.doesNotThrow(function(){
      basex({
        classpath: ['tmp/basex.jar', 'tmp/tagsoup.jar'],
        xquery: '1 to 10'
      })
      .then(function(data){
        test.equal(data, '1 2 3 4 5 6 7 8 9 10', 'Should accept multiple jars as classpath.')
        test.done()
      })
    })

  }
};
