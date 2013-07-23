# basex-standalone [![Build Status](https://secure.travis-ci.org/alxarch/basex-standalone.png?branch=master)](http://travis-ci.org/alxarch/basex-standalone)

Process data using `XQuery` with `BaseX` in standalone mode.

## Getting Started


Install the module with: `npm install basex-standalone`

```js

var basex = require('basex-standalone');

// prints '1 2 3 4 5 6 7 8 9 10'
basex({xquery: '1 to 10'}).then(console.log)
```

Or create a partial to set individual defaults

```js

var basex = require('basex-standalone');

var b = basex.partial({
	debug: true,
	basexpath: '/tmp/basex'
})

// prints '/tmp/basex/data'
b({
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

Asynchronous execution is handled with the *promise* interface, 
as provided by the `q` module [see more](http://documentup.com/kriskowal/q/)


> Tip: For better performance, prefer [Command Scripts](http://docs.basex.org/wiki/Commands#Command_Scripts)
> over sequential invocations (ie multiple `ADD`, `SET` commands)

## Usage

You can either use the `Promise` based interface:

```js

var basex = require('basex')

basex({xquery: '1 to 10'}).then(console.log)
```

Or directly access the `ChildProcess`:

```js

var basex = require('basex')

var custom = basex.partial({classpath: 'path/to/basex.jar'})

var cp = custom.spawn({xquery: '1 to 10'})

cp.stdout.pipe(process.stdout)
```

### Partials

Partials are a convenience to avoid setting all options on each operation.

```js

var basex = require('basex-standalone')

var partial = basex.partial({debug: true, newlines: true})

partial('1 to 10')
partial('test.xql')
```

Calling the module as a constructor is equivalent to creating a partial.

```js

var partial = basex.partial({debug.true})
```
is equal to 

```js

var partial = new basex({debug: true})
```

#### `basex.partial(defaults)`

Returns: `Function`

Returns a partially applied function that will always use the provided options as defaults.


#### `partial(options)`

Returns: `Promise`

Calling the partial will execute an operation.

#### `partial.spawn(options)`

Returns: `ChildProcess`

Each partial has a `spawn` method that returns the `child_process` directly.
This can be used as a mode low-level interface than promise objects.

#### `partial.op(options)`

Returns: `Promise`

Equivalent of calling `partial(options)`. Returns a promise object.


#### `partial.reset()`

Resets the partial to its initial state.

#### `partial.defaults()`

Returns a deep copy of the default options for the partial.

#### `partial.defaults(key)`

Gets the value of key from the default options for the partial.

#### `partial.defaults(key, value)`

Sets the value of key on the default options for the partial.

#### `partial.defaults(options)`

Sets the value of all key, value pairs on the default options for the partial.

Default options also can be set with the same method on module level using `basex.defaults()`:

```js

var basex = require('basex')

basex.defaults({
	classpath: 'path/to/basex.jar'
})
```

> These settings affect *all* future operations.

> Note that upon execution global options are re-merged with the partial's defaults and the operation's options.

To restore the global defaults to their original values use `basex.reset()`


### Options

Options are converted to `BaseX` standalone arguments. 
For better understanding of these arguments see [Startup Options](http://docs.basex.org/wiki/Startup_Options#BaseX_Standalone).

Options object is also passed on to `child_process.spawn()` [more](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)


#### `run`

Type: `String`

Default value: `''`

The actual operation to run.

Similar to `RUN` command. [docs](http://docs.basex.org/wiki/Commands#RUN)

> Note: `run` argument will directly evaluate as XQuery by BaseX if it doesn't point to a file.
> It is preferable to use the `option.xquery` in order to evaluate XQuery code.

#### `commands`

Type: `String|Array`

Default value: `[]`

Argument(s): `-c<COMMAND>`

Execute commands before running the operation.

#### `bind`

Type: `Object`

Default value: `{}`

Argument(s): `-b<name>=<val>`

Binds external variables to XQuery expressions. 
[docs](http://docs.basex.org/wiki/Options#BINDINGS)

#### `xquery`

Type: `String`

Default value: `null`

Argument: `-q<xquery>`

Executes the specified string as XQuery expression before running the operation 
and after executing the `options.commands`.

#### `debug`

Type: `Boolean`

Default value: `false`

Argument: `-d`

Toggles the debugging mode.


#### `input`

Type: `String`

Default value: `null`

Argument: `-i<input>`

Sets file/directory to use as context.


#### `output`

Type: `String`

Default value: `null`

Argument: `-o<output>`

Sets file to write all output to.


#### `newline`

Type: `Boolean`

Default value: `false`

Argument: `-L`

Separates returned query items by newlines (instead of spaces) 
and appends a newline to the end of a result.

#### `serializer`

Type: `Object`

Default value: `{}`

Argument(s): `-s<name>=<value>`

Specifies parameters for serializing XQuery results.
[docs](http://docs.basex.org/wiki/Serialization)

#### `update`

Type: `Boolean`

Default value: `false`

Argument: `-u`

Write updates back to original files.

#### `whitespace`

Type: `Boolean`

Default value: `false`

Argument: `-w`

Preserve whitespaces from input files (`-w`).

#### `java`

Type: `String`

Default value: `/usr/bin/env java`

Java executable to use.


#### `classpath`

Type: `String|Array`

Default value: `null`

`CLASSPATH` definition to be used by Java [more](http://en.wikipedia.org/wiki/Classpath).

In order for the module to work java needs access to `org.basex.BaseX` class.

Download the latest version from [here](http://files.basex.org/releases)

Alternatively `org.basex.BaseX` class must be available to java system-wide.

Other useful jar files are: 

- [tagsoup](http://ccil.org/~cowan/XML/tagsoup/) For HTML parsing
- [saxon](http://www.saxonica.com/welcome/welcome.xml) For XSLT transforms and XSD validations


#### `basexpath`

Type: `String`

Default value: `null`

Path for BaseX [Home Directory](http://docs.basex.org/wiki/Configuration#Home_Directory)

> Note that all file paths in commands / script etc 
> remain relative to node's cwd


## `basex.Job`

A convenience object that generates `BaseX` [Command Scripts](http://docs.basex.org/wiki/Commands#Command_Scripts).

All `Job` methods except `Job.render()` are chainable.


### `job.command(name, input, params), job.command(name, params)`

`name`: the tagname of the command (`drop-db`)

Appends a command to the script.

All command name, input, and params are validated 
and relevant errors are thrown.

### `job.requires(module1, module2, ..., moduleN)`

Adds a `REPO INSTALL <file>` command for each argument.

### `job.bind(key, value), job.bind(bindings)`

Binds parameters for XQuery external variables.

These bindings are collected and *prepended* to the command script 
before all other commands upon rendering.

### `job.execute(command)`

Appends an `EXECUTE` command. 
If `command` can be a `basex.Job` instance.

### `job.xquery(xquery)`

Appends an `XQUERY` command.

### `job.import(files, path, options), job.import(files), job.import(files, options)`

Imports files.

In order to specify parsing options for the files without affecting
global options, it appends an `EXECUTE` command that executes 
a child Command Script. Options that can be set are:

#### `options.db`

Specify the database to add files to. 
If not set the currently opened database will be used.
If no db is currently open or the specified database does not exist
the script will fail upon execution.

#### `options.{createfilter, addarchives, skipcorrupt, addraw, parser, parseropt, htmlopt}`

See [Parsing Options](http://docs.basex.org/wiki/Options#Parsing)

#### `options.{chop, intparse}`
See [Parsing Options](http://docs.basex.org/wiki/Options#XML_Parsing)


### `job.set(option, value), job.set(options)`

`option`: Option name to set.
`value`: Value to set the option to.

or 

`options`: Object of option/value pairs.

Appends single/multiple `SET` command.

### `job.export(path)`

Appends an `EXPORT <path>` command.

### `job.check(db)`

Appends an `CHECK <db>` command.

### `job.open(db)`

Appends an `OPEN <db>` command.

### `job.close()`

Appends a `CLOSE` command.

### `job.run(file)`

Appends a `RUN` command.

### `job.render()`

Renders the xml for this Command Script.

### `job.toString()`

Alias of `job.render()`


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
basex('some/command/script.bxs')
	.then(function(output){
		console.log(output)
	})
```

Or do the same with a `basex.Job`:

```js

var job = new basex.Job()

job.command('info')
	.createdb('test')
	.import('some/file.xml', 'test.xml')
	.import('somedir/with/json/files', {
		parser: 'json',
		createfilter: '*.json'
	})
	.xquery("for $book ...")
	.dropdb('test')

basex(job).then(function(output){
		console.log(output)
	})
```


Run several queries against an input document in a queue:

```js

var b = basex.partial({input: 'doc.xml'})

b('//a[@id = "findme"]/string()')
	.then(function(id){
		return b.op('//div[@class="'+resolve(id)+'"]')
	})
	.then(console.log)
```


## Release History
1.0.1 - fix multiple values for `options.classpath` 
1.0.0 - First Official Release

## License
Copyright (c) 2013 Alexandros Sigalas
Licensed under the MIT license.
