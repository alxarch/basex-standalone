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
, f = require('util').format
, fs = require('fs')
, ident = _.identity
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
        , o2a(opt.serializer, 's')
        , com && [ '-c', com]
        , opt.xquery && [ '-q', opt.xquery]
        , opt.run
        , (opt.run || com || opt.xquery) ? '' : '()'
      )
  }
, val = function(opt){
    return _.isPlainObject(opt) ? 
    _(opt)
      .map(function(value, name){
        return f('%s=%s', name, value)
      })
      .valueOf()
      .join(',')
    : 
    opt
  } 
, o2a = function(obj, a){
    a = a || ''
    return _(obj).map(function(v, n) {
      return a ? ['-'+a, f('%s=%s', n, val(v))] : ['-'+n, val(v)]
    }).flatten().valueOf()
  }
, BaseX = function(options){
    if (this instanceof BaseX) {
        this.defaults = _.assign({}, BaseX.defaults || {}, options || {})
    }
    else{
      var basex = new BaseX();
      return basex.op(options)
    }
  }

var defaults = {
  debug: false
, newline: false
, serializer: {}
, update: false
, whitespace: false
, bind: {}
, input: null
, commands: []
, xquery: null
, run: null
, java: '/usr/bin/env java'
, basexpath: null
, classpath: null

}

BaseX.defaults = _.assign({}, defaults)
// Export for testing
BaseX._args = args
BaseX.prototype = {
  spawn: function(options){
    var opt = _.extend({}, defaults, BaseX.defaults || {}, this.defaults || {}, options || {})
      , classpath = arr(opt.classpath).join(';')
      , baseargs = arr(
          opt.java.split(' ')
        , o2a(opt.jvmargs || {}, '')
        , classpath && ['-cp', classpath]
        , opt.basexpath && f('-Dorg.basex.path=%s', opt.basexpath)
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
        def.resolve(out.join("\n"))
      else
        def.reject(err.join("\n") || 'Unknown Reason')
    })

    return def.promise
  }
}


return BaseX

})()
