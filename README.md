# basex-standalone [![Build Status](https://secure.travis-ci.org/alxarch/basex-standalone.png?branch=master)](http://travis-ci.org/alxarch/basex-standalone)

Process data using `XQuery` with `BaseX` in standalone mode.


## Getting Started


Install the module with: `npm install basex-standalone`

```js
var basex = require('basex-standalone');

// prints '1 2 3 4 5 6 7 8 9 10'
basex({xquery: '1 to 10'}).then(console.log)

```

Or run as an instance to set individual defaults

```js
var basex = require('basex-standalone');

var b = new basex()

b.defaults.debug = true

b.env.basexpath = '/tmp/basex'

// prints '/tmp/basex/data'
b.op({
	serializer: { method: 'text' },
	xquery: 'db:system()/mainoptions/dbpath/text()'
}).then(console.log)

```

## Documentation


`BaseX` includes a fast, feature-rich XQuery processor
that can juggle json, xml, csv and other data easily
and provides powerful document manipulation facilities 
by implementing the XQuery Update specification.

For more information about `BaseX`, 
what you can do with it, 
and how to do it,
read through the *excellent* documentation on [docs.basex.org](http://docs.basex.org)

This module acts as a simple wrapper around `BaseX`'s
*Standalone Mode* passing arguments via cli and reading back
stdout/stderr output.

Asynchronous execution is handled with
the *promise* interface, 
as provided by the `q` module [see more](http://documentup.com/kriskowal/q/)


> Tip: For better performance, prefer command scripts 
> over sequential invocations (ie multiple `ADD`, `SET` commands)

## Usage

You can either use the `Promise` based interface:

```js
var BaseX = require('basex')

var basex = new BaseX()

basex.op({xquery: '1 to 10'}).then(console.log)
```

Or directly access the `ChildProcess`:

```js
var BaseX = require('basex')

var basex = new BaseX({classpath: 'path/to/basex.jar'})

var cp = basex.spawn({xquery: '1 to 10'})

cp.stdout.pipe(process.stdout)

```

A shortcut method to the `Promise` interface is to directly call the required module:

```js
var basex = require('basex')

basex({xquery: '1 to 10'}).then(console.log)
```


### Options

Both `basex.spawn()` and `basex.op` accept the same set of options.

Default options can be set both on module level:

```js
var BaseX = require('basex')

BaseX.defaults({
	classpath: 'path/to/basex.jar'
})
```

and on instance level:
  
```js
var BaseX = require('basex')

// Set some defaults on instantiation
var basex = new Basex({ classpath: 'basex.jar'})

// Modify them
basex.defaults({
  	basexpath: '/tmp/basex'
})

```

Options object is passed on to `child_process.spawn()` [more](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

Options are converted to `BaseX` standalone arguments. 
For better understanding of these arguments see [Startup Options](http://docs.basex.org/wiki/Startup_Options#BaseX_Standalone).


#### run

Type: `String`

Default value: `''`


Similar to `RUN` command. [docs](http://docs.basex.org/wiki/Commands#RUN)


> Note: `run` argument will directly evaluate as XQuery by BaseX if it doesn't point to a file.
> It is preferable to use the `option.xquery` in order to evaluate XQuery code.

#### commands

Type: `String|Array`

Default value: `[]`

Argument(s): `-c<COMMAND>`

Execute commands before *each* src / dest pair execution.

In order to execute set of commands *once* before 
a target use a separate target and a MultiTask

#### bind

Type: `Object`

Default value: `{}`

Argument(s): `-b<name>=<val>`

Binds external variables to XQuery expressions. 
[docs](http://docs.basex.org/wiki/Options#BINDINGS)

#### xquery

Type: `String`

Default value: `null`

Argument: `-q<xquery>`

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

Argument(s): `-s<name>=<value>`

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

Argument: `-w`

Preserve whitespaces from input files (`-w`).

#### options.java

Type: `String`

Default value: `/usr/bin/env java`

Java executable to use.


#### options.classpath

Type: `String`

Default value: `null`

`CLASSPATH` definition to be used by Java [more](http://en.wikipedia.org/wiki/Classpath).

In order for the module to work java needs access to `org.basex.BaseX` class.

Download the latest version from [here](http://files.basex.org/releases)

Alternatively `org.basex.BaseX` class must be available to java system-wide.

Other useful jar files are: 

- [tagsoup](http://ccil.org/~cowan/XML/tagsoup/) For HTML parsing
- [saxon](http://www.saxonica.com/welcome/welcome.xml) For XSLT transforms and XSD validations


#### options.basexpath

Type: `String`

Default value: `null`

Path for BaseX [Home Directory](http://docs.basex.org/wiki/Configuration#Home_Directory)

> Note that all file paths in commands / script etc 
> remain relative to node's cwd


## Examples

Modify a document in-place using xquery

```js
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

```js
basex({
	input: 'path/to/some/dir',
	run: 'path/to/some/script.xql'
})
.then(function(output){
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

```js
basex({ 
	run: 'some/command/script.bxs'
})
.then(function(output){
	console.log(output)
})
```

## Release History

0.0.1 - Initial release

## License
Copyright (c) 2013 Alexandros Sigalas
Licensed under the MIT license.
