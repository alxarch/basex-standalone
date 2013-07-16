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

        test.equal(j.queue[0].cmd, 'repo-install')
        test.equal(j.queue[0].path, 'test.xqm')
        test.equal(j.queue[1].cmd, 'info')
        test.equal(j.queue.length, 2)

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
        test.equal(c.cmd, 'add');
        test.equal(c.txt, 'input');
        test.equal(c.path, 'value');

        j.command('info')
        c = j.queue[1]
        test.equal(c.cmd, 'info');
        test.equal(c.txt, undefined);
        test.equal(Object.keys(c).length, 2);

        j.command('create-db', {name: 'test'})
        c = j.queue[2]

        test.equal(c.cmd, 'create-db');
        test.equal(c.txt, undefined);
        test.equal(c.name, 'test');
        test.equal(Object.keys(c).length, 3);

        test.done()
    },
    'create-db': function(test){
        test.expect(4)
        var j = new Job()
        var jj = j.createdb('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].cmd, 'create-db')
        test.equal(j.queue[0].name, 'test')
        test.equal(j.queue[0].input, undefined)
        test.done()
    },
    'open': function(test){
        test.expect(4)
        var j = new Job()
        var jj = j.open('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].cmd, 'open')
        test.equal(j.queue[0].name, 'test')
        test.equal(j.queue[0].input, undefined)
        test.done()
    },
    'export': function(test){
        test.expect(4)
        var j = new Job()
        var jj = j.export('test')
        test.ok(jj instanceof Job)
        test.equal(j.queue[0].cmd, 'export')
        test.equal(j.queue[0].path, 'test')
        test.equal(j.queue[0].input, undefined)
        test.done()
    },
    'add': function(test){
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
    }
}