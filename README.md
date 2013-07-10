# basex-standalone [![Build Status](https://secure.travis-ci.org/alxarch/basex-standalone.png?branch=master)](http://travis-ci.org/alxarch/basex-standalone)

Process data using XQuery with BaseX in standalone mode.

## Getting Started
Install the module with: `npm install basex-standalone`

```javascript
var basex = require('basex-standalone');

// prints '1 2 3 4 5 6 7 8 9 10'
basex({xquery: '1 to 10'}).then(console.log)

```

Or run as an instance to set individual defaults

```javascript
var basex = require('basex-standalone');

var b = new basex()

b.defaults.debug = true

b.env.path = '/tmp/basex'

// prints '/tmp/basex/data'
b.exec({
	serializer: { method: 'text' },
	xquery: 'db:system()/mainoptions/dbpath/text()'
}).then(console.log)

```

The *promise* interface is used, as provided by the `q` module [see more](http://documentup.com/kriskowal/q/)

## Documentation

### Options

For better understanding of these options see [Startup Options](http://docs.basex.org/wiki/Startup_Options#BaseX_Standalone).

#### run
Type: `String`
Default value: `''`

Similar to `RUN` command. [docs](http://docs.basex.org/wiki/Commands#RUN)

The input string may point to an existing file. 
If the file suffix is `.bxs`, the file content 
will be evaluated as Command Script; otherwise, 
the file contents will be evaluated as an XQuery expression.

This value is *expanded* to `RUN` multiple files.

#### commands
Type: `String|Array`
Default value: `[]`

Execute commands before *each* src / dest pair execution.

In order to execute set of commands *once* before 
a target use a separate target and a MultiTask

#### bind
Type: `Object`
Default value: `{}`

Binds external variables to XQuery expressions. 
[docs](http://docs.basex.org/wiki/Options#BINDINGS)

#### xquery
Type: `String`
Default value: `null`

Executes the specified string as XQuery expression for *each* src / dest pair.

#### debug
Type: `Boolean`
Default value: `false`
Argument: `-d`
Toggles the debugging mode.

#### newline
Type: `Boolean`
Default value: `false`
Argument: `-L`

Separates returned query items by newlines (instead of spaces) 
and appends a newline to the end of a result.

#### serializer
Type: `Object`
Default value: `{}`
Argument(s): `-s<pars>`

Specifies parameters for serializing XQuery results.
[docs](http://docs.basex.org/wiki/Serialization)

#### update
Type: `Boolean`
Default value: `false`
Argument: `-u`

Write updates back to original files.

#### whitespace
Type: `Boolean`
Default value: `false`

Preserve whitespaces from input files (`-w`).

### Environment

In order for the module to work java needs access to `org.basex.BaseX` class.

The easiest way is to directly point to a `BaseX.jar` file by setting
the `env.jar` option (see below).

Download the latest version from [here](http://files.basex.org/releases)

Alternatively `org.basex.BaseX` class must be fount in java `CLASSPATH` by other means [more](http://en.wikipedia.org/wiki/Classpath_(Java)).

To contain `BaseX`'s data folders in some specific dir you can set
the env.path option (see below)

Environment settings can be set module-wide:

```javascript
var basex = require('basex-standalone')

basex.env.jar = 'lib/basex.jar'

```

or on individual instances:

```javascript

var basex = require('basex-standalone')
var b = new basex()

b.env.path = '/tmp/instancebasex'

```

#### env.java

Type: `String`

Default value: `/usr/bin/env java`

Java executable to use.


#### env.jar

Type: `String`

Default value: `null`

Path to BaseX.jar.


#### env.path

Type: `String`

Default value: `tmp/basex`

Path for BaseX [Home Directory](http://docs.basex.org/wiki/Configuration#Home_Directory)

> Note that all file paths in commands / script etc 
> remain relative to node's cwd

## Examples

Modify a document in-place using xquery

```javascript
basex({
	input: 'path/to/some/file.xml',
	update: true,
	xquery: 'for $a in //a return replace value of node $a/@href with "#test"'
})
.then(function(data){
	// Updating xquery expressions have no output
})
```

Execute an XQuery script file to 
query a folder with multiple xml files

```javascript
basex({
	input: 'path/to/some/dir',
	run: 'path/to/some/script.xql'
})
.done(function(output){
	console.log(output)
})
```

Execute a BaseX Command Script to batch-process json and xml data

```xml
<!-- some/command/script.bxs  -->
<commands>
	<info/>
	<create-db name="test"/>
	<add path="test.xml">some/file.xml</add>
	<set option="parser">json</set>
	<set option="createfilter">*.json</set>
	<add>somedir/with/json/files</add>
	<xquery>
	<![CDATA[
		for $book in //json/book
			let $author = $book//author
			group by $author/@id
			return 
			<author books="{{count($book)}}">{{$author/text()}}</author>"

	 ]]>
	 </xquery>
	<drop-db name="test"/>
<commands>
```

```javascript
basex({ run: 'some/command/script.bxs'})
.done(function(output){
	console.log(output)
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Alexandros Sigalas  
Licensed under the MIT license.
