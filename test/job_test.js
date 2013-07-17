'use strict';

var Job = require('../lib/job.js');

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

exports['job'] = {
    'requires': function(test){
        test.expect(4)
        var j = new Job()

        j.command('info')

        j.requires('test.xqm')

        test.equal(j.queue[0].__cmd__, 'repo-install')
        test.equal(j.queue[0].path, 'test.xqm')
        test.equal(j.queue[1].__cmd__, 'info')
        test.equal(j.queue.length, 2)

        test.done()
    },
    'requires - multiple modules': function(test){
        test.expect(8)
        var j = new Job()

        j.command('info')

        j.requires('one.xqm', ['two.xqm', 'three.xqm'])
        test.equal(j.queue[0].__cmd__, 'repo-install')
        test.equal(j.queue[0].path, 'three.xqm')
        test.equal(j.queue[1].__cmd__, 'repo-install')
        test.equal(j.queue[1].path, 'two.xqm')
        test.equal(j.queue[2].__cmd__, 'repo-install')
        test.equal(j.queue[2].path, 'one.xqm')
        test.equal(j.queue[3].__cmd__, 'info')
        test.equal(j.queue.length, 4)
        
        test.done()
    },

    'render - no commands': function(test){
        test.expect(1)
        var j = new Job()
        test.equal(j.render(), '<commands></commands>')
        test.done()
    },
    'command': function(test){
        test.expect(11)
        var j = new Job()
        var result = j.command('add', 'input', {path: 'value'})
        var c = j.queue[0]

        test.ok(result instanceof Job)
        test.equal(c.__cmd__, 'add');
        test.equal(c.__input__, 'input');
        test.equal(c.path, 'value');

        j.command('info')
        c = j.queue[1]
        test.equal(c.__cmd__, 'info');
        test.equal(c.__input__, undefined);
        test.equal(Object.keys(c).length, 2);

        j.command('create-db', {name: 'test'})
        c = j.queue[2]

        test.equal(c.__cmd__, 'create-db');
        test.equal(c.__input__, undefined);
        test.equal(c.name, 'test');
        test.equal(Object.keys(c).length, 3);

        test.done()
    },
    'create-db': function(test){
        test.expect(5)
        var j = new Job()
        var jj = j.createdb('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].__cmd__, 'create-db')
        test.equal(j.queue[0].name, 'test')
        test.equal(j.db, 'test')
        test.equal(j.queue[0].__input__, undefined)
        test.done()
    },
    'open': function(test){
        test.expect(5)
        var j = new Job()
        var jj = j.open('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].__cmd__, 'open')
        test.equal(j.queue[0].name, 'test')
        test.equal(j.db, 'test')
        test.equal(j.queue[0].__input__, undefined)
        test.done()
    },
    'export': function(test){
        test.expect(4)
        var j = new Job()
        var jj = j.export('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].__cmd__, 'export')
        test.equal(j.queue[0].path, 'test')
        test.equal(j.queue[0].__input__, undefined)
        test.done()
    },
    'import': function(test){
        test.expect(1)
        test.ok(true)
        test.done()
    },
    'bind': function(test){
        test.expect(6)
        var j = new Job()

        var jj = j.bind()

        test.ok(jj instanceof Job)
        test.equal(Object.keys(j.bindings).length, 0)

        jj = j.bind('test', 'ok')
        test.ok(jj instanceof Job)
        test.equal(j.bindings.test, 'ok')


        j.bind({other: 'ok'})

        test.equal(j.bindings.other, 'ok')
        test.equal(j.bindings.test, 'ok')

        test.done()
    },
    'xquery - cdata': function(test){
        test.expect(2)
        var j = new Job()

        var jj = j.xquery('1 to 10')
        test.ok(jj instanceof Job)
        test.equal(j.render(), '<commands><xquery><![CDATA[1 to 10]]></xquery></commands>')
        test.done()
    },
    'check': function(test){
        test.expect(5)
        var j = new Job()
        var jj = j.check('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].__cmd__, 'check')
        test.equal(j.queue[0].input, 'test')
        test.equal(j.queue[0].__input__, undefined)
        test.equal(j.db, 'test')
        test.done()
    },
    'dropdb': function(test){
        test.expect(6)
        var j = new Job()
        j.open('test')
        test.equal(j.db, 'test')
        var jj = j.dropdb('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[1].__cmd__, 'drop-db')
        test.equal(j.queue[1].name, 'test')
        test.equal(j.queue[1].__input__, undefined)
        test.equal(j.db, null)
        test.done()
    },
    'invalid command': function(test){
        test.expect(1)
        var j = new Job()

        test.throws(function(){
            j.command('invalidcommandname')   
        })
        
        test.done()
    }
}