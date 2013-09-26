/*
 * basex-standalone
 * https://github.com/alxarch/basex-standalone
 *
 * Copyright (c) 2013 Alexandros Sigalas
 * Licensed under the MIT license.
 */

'use strict';

module.exports = (function(){

var _ = require('lodash')
  , Q = require('q')
  , spawn = require('child_process').spawn
  , path = require('path')
  , ident = _.identity
  , Job = require('./job.js')
  , slice = Array.prototype.slice
  , cat = Array.prototype.concat
  , arr = function(){
        return cat.apply([], slice.apply(arguments)).filter(ident)
    }
  , args = function(opt){
        opt = opt || {}

        var com = arr(opt.commands).join(';')

        return arr(
              opt.debug && '-d'
            , opt.newline && '-L'
            , opt.whitespace && '-w'
            , opt.update && '-u'
            , o2a(opt.bind, 'b')
            , opt.input && ['-i', opt.input]
            , opt.output && ['-o', opt.output]
            , o2a(opt.serializer, 's')
            , com && [ '-c', com]
            , opt.xquery && [ '-q', opt.xquery]
            , opt.run instanceof Job ? opt.run.render() : opt.run
            , (opt.run || com || opt.xquery) ? '' : '()'
        )
    }
  , val = function(opt){
        return _.isPlainObject(opt) ? 
        _(opt)
          .map(function(value, name){
            return name+'='+value
          })
          .valueOf()
          .join(',')
        : 
        opt
    } 
  , o2a = function(obj, a){
        a = a || ''
        return _(obj).map(function(v, n) {
            return a ? ['-'+a, n+'='+val(v)] : ['-'+n, val(v)]
        }).flatten().valueOf()
    }
  , BaseXEnvironment = function(options){
      if(_.isString(options) || options instanceof Job)
          options = {run: options}
      this._defaults = options || {}
    }
  , BaseX = function(options){
        if (this instanceof BaseX)
            return BaseX.partial(options)
        else
            return (new BaseXEnvironment(options)).op()
    }

BaseX.partial = function(options){
  var defaults = _.clone(options, true),
      basex = new BaseXEnvironment(options),
      partial = function(options){
        return basex.op(options)
      }

  basex.reset = function(){
    this._defaults = _.clone(defaults, true)
  }
  _.bindAll(basex)
  _.assign(partial, basex)

  return partial
}

var defaults = {
  debug: false
, newline: false
, serializer: {}
, update: false
, whitespace: false
, bind: {}
, input: null
, output: null
, commands: []
, xquery: null
, run: null
, java: 'java'
, basexpath: null
, classpath: [__dirname+'/basex.jar', __dirname+'/tagsoup.jar']
}

// Export for testing
BaseX._args = args

BaseXEnvironment.prototype = {
  defaults: function(){
    var arg

    if(arguments.length > 0){

      arg = arguments[0]

      if(arguments.length > 1){
        if(_.isString(arg)) 
          this._defaults[arg] = arguments[1]
      }
      
      else if(_.isString(arg)) 
        return this._defaults[arg]

      if(_.isPlainObject(arg))
        _.assign(this._defaults, arg)
    }
    
    return _.clone(this._defaults, true)
  }

, spawn: function(options){

    if(_.isString(options) || options instanceof Job) options = {run: options}

    var opt = _.assign({}, defaults, BaseX._defaults, this._defaults || {}, options || {})
      , classpath = arr(opt.classpath).join(path.delimiter)
      , baseargs = arr(
          opt.java.split(' ')
        , o2a(opt.jvmargs || {}, '')
        , classpath && ['-cp', classpath]
        , opt.basexpath && '-Dorg.basex.path='+opt.basexpath
        , 'org.basex.BaseX'
        )
        
      , cmd = baseargs.shift()
      , arg = args(opt)
      , cp = spawn(cmd, baseargs.concat(arg), opt)

    cp.stdout.setEncoding('utf-8')
    cp.stderr.setEncoding('utf-8')

    return cp
  }
, op: function(options){

    var cp = this.spawn(options)
      , out = []
      , err = []
      , def = Q.defer()

    cp.stdout.on('data', function(data){
      out.push(data)
    })

    cp.stderr.on('data', function(data){
      err.push(data)
    })

    cp.on('error', function(error){
      def.reject(error)
    })

    cp.on('close', function(code){

      if(code === 0)
        def.resolve(out.join(""))
      else
        def.reject(err.join("") || 'Unknown Reason')
    })

    return def.promise
  }
}


// Resets module defaults to private defaults
BaseX.reset = function(){
  this._defaults = _.clone(defaults, true)
}

BaseX.reset()
// Copy the api to the module.
BaseX.defaults = _.bind(BaseXEnvironment.prototype.defaults, BaseX)
BaseX.spawn = function(options){
  return BaseX.partial().spawn(options)
}
BaseX.op = function(options){
  return BaseX.partial().op(options)
}

BaseX.Job = Job

return BaseX

})()
