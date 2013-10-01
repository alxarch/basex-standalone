'use strict';

var basex = require('../lib/basex.js');

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
var b = basex.partial({
	classpath: ['tmp/basex.jar'],
	basexpath: 'tmp/basex'
});

exports['basex'] = {
	'args': function (test) {
		test.expect(1);
		var args = basex._args();
		test.
			equal(args[0], '()');
			test.done();
		},

	'args - xquery': function (test) {
		test.expect(1);
		var args = basex._args({xquery: '1 to 10'});
		test.equal(args.join(' '), '-q 1 to 10');
		test.done();
	},

	'args - debug': function (test) {
		test.expect(1);
		var args = basex._args({debug: true});
		test.equal(args.join(' '), '-d ()');
		test.done();
	},

	'args - whitespace': function (test) {
		test.expect(1);
		var args = basex._args({whitespace: true});
		test.equal(args.join(' '), '-w ()');
		test.done();
	},

	'args - newline': function (test) {
		test.expect(1);
		var args = basex._args({newline: true});
		test.equal(args.join(' '), '-L ()');
		test.done();
	},

	'args - update': function (test) {
		test.expect(1);
		var args = basex._args({update: true});
		test.equal(args.join(' '), '-u ()');
		test.done();
	},

	'args - bind': function (test) {
		test.expect(1);
		var args = basex._args({bind: {test: 'ok'}});
		test.equal(args.join(' '), '-b test=ok ()');
		test.done();
	},
	'args - bind multiple': function (test) {
		test.expect(1);
		var args = basex._args({bind: {test: 'ok', myVar: 'set'}});
		test.equal(args.join(' '), '-b test=ok -b myVar=set ()');
		test.done();
	},

	'args - serializer': function (test) {
		test.expect(1);
		var args = basex._args({serializer: {method: 'html'}});
		test.equal(args.join(' '), '-s method=html ()');
		test.done();
	},
	'args - serializer multiple': function (test) {
		test.expect(1);
		var args = basex._args({serializer: {method: 'html', version: 5}});
		test.equal(args.join(' '), '-s method=html -s version=5 ()');
		test.done();
	},

	'args - input': function (test) {
		test.expect(1);
		var args = basex._args({input: 'somefile.xml'});
		test.equal(args.join(' '), '-i somefile.xml ()');
		test.done();
	},

	'args - output': function (test) {
		test.expect(1);
		var args = basex._args({output: 'somefile.xml'});
		test.equal(args.join(' '), '-o somefile.xml ()');
		test.done();
	},

	'args - order': function (test) {
		test.expect(1);
		var args = basex._args({
			input: 'somefile.xml', 
			commands: 'INFO', 
			xquery: '//a',
			bind: { test: 'ok'},
			serializer: {method: 'html'},
			run: 'run.bxs'
		});
		test.equal(args.join(' '), '-b test=ok -i somefile.xml -s method=html -c INFO -q //a run.bxs')
		test.done();
	},

	'args - commands': function (test) {
		test.expect(1);
		var args = basex._args({commands: ['INFO', 'INFO']});
		test.equal(args.join(' '), '-c INFO;INFO');
		test.done();
	},

	'args - run': function (test) {
		test.expect(1);
		var args = basex._args({run: 'file.xq'});
		test.equal(args.join(' '), 'file.xq');
		test.done();
	},
	'op - simple query': function (test) {
		test.expect(1);
		
		b({xquery: '1 to 10'}, function (e, actual) {
			if(e) {
				throw e;
			}
			test.equal(actual, '1 2 3 4 5 6 7 8 9 10', 'Should run simple queries.');
			test.done();
		})
			
	},
	'op - escapes xquery': function (test) {
		test.expect(1);
		b({ xquery: 'for $n in 1 to 10 return $n || ""'}, function (e, data) {
			if(e) {
				throw e;
			}
			test.equal(data, '1 2 3 4 5 6 7 8 9 10', "Escapes $ and '\"' sign properly.");
			test.done();
		})
	},

	'op - uses input doc': function (test) {
		test.expect(1);
		b({ 
			input: 'test/fixtures/book.html', 
			xquery: '//abbr/@title/string()'
		}, function (e, data) {
				if(e){
					throw e;
				}
				test.equal(data, 'ok');
				test.done();
			});
	},

	'op - run xquery from file': function (test) {
		test.expect(1);
		b('test/fixtures/query.xql', function (e, data) {
			if(e) {
				throw e;
			}
			test.equal(data, 'ok', 'Should run XQuery files.');
			test.done();
		});
	},

	'op - runs command scripts': function (test) {
		test.expect(1);
		var b2 = basex.partial({ 
			classpath: 'tmp/basex.jar',
			basexpath: 'tmp/basex',
			xquery: '1 to 10',
			newline: true
		});
		b2('test/fixtures/info.bxs', function (e, data) {
			if(e) {
				throw e;
			}
			test.ok(data.match(/General Information/g).length === 3);
			test.done();
		});
	},

	'callable - module': function (test) {
		test.expect(1);
		
		basex({ 
			classpath: 'tmp/basex.jar',
			basexpath: 'tmp/basex',
			xquery: '1 to 10'
		}, function (e, data) {
			test.equal(data, '1 2 3 4 5 6 7 8 9 10', 'Module should be callable directly.');
			test.done();
		})
	},

	'classpath - multiple': function (test) {
		test.expect(2);

		test.doesNotThrow(function () {
			basex({
				classpath: ['tmp/basex.jar', 'tmp/tagsoup.jar'],
				basexpath: 'tmp/basex',
				xquery: '1 to 10'
			}, function (e, data) {
				test.equal(data, '1 2 3 4 5 6 7 8 9 10', 'Should accept multiple jars as classpath.');
				test.done();
			})
		})

	}
};
