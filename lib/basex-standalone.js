/*
 * basex-standalone
 * https://github.com/alxarch/basex-standalone
 *
 * Copyright (c) 2013 Alexandros Sigalas
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash')
  , Q = require('q')
  , exec = require('child_process').exec
  , f = require('util').format
  , fs = require('fs')
  
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
        return f('-%s%s=%s', a, n, val(v))
      }).valueOf()
    }
  , esc = function(str){
      // Helper function to escape double quotes in strings.
      return str.toString()
        .replace(/"/g, '\\"')       // escape double quotes
        .replace(/\$/g, "\\$")      // escape dollar signs
    }
  , BaseX = function(options){
      if (this instanceof BaseX) {
          this.env = _.assign({}, BaseX.env || {}, options || {})
      }
      else{
        var basex = new BaseX();
        return basex.exec(options)
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
}

BaseX.defaults = _.assign({}, defaults);

var default_env = {
  java: '/usr/bin/env java'
, classpath: null
, path: null
, jar: null
}

BaseX.env = _.assign({}, default_env);

// Export escape as a helper.
BaseX.helpers = {
  escape: esc
}

BaseX.prototype = {
  cmd: function(options){
    var opt = _.assign({}, defaults, BaseX.defaults || {}, this.defaults || {}, options || {})
      , com = (opt.commands || []).filter(_.identity).map(esc).join(';')
      , env = _.assign({}, default_env, BaseX.env || {}, this.env || {})
      , run = opt.run

    if(run && !(fs.existsSync(run) && fs.statSync(run).isFile()))
      run = null

    return [].concat(
          env.java
        , o2a(opt.jvmargs || {}, '')
        , env.path && f('-Dorg.basex.path=%s', env.path)
        , (env.jar || env.classpath) && ['-cp', env.jar || env.classpath]
        , 'org.basex.BaseX'
        , opt.debug && '-d'
        , opt.newline && '-L'
        , opt.whitespace && '-w'
        , opt.update && '-u'
        , o2a(opt.bind, 'b')
        , o2a(opt.serializer, 's')
        , com && f('-c"%s"', com)
        , opt.input && f('-i%s', opt.input)
        , opt.xquery && f('-q"%s"', esc(opt.xquery))
        , run
        , (run || com || opt.xquery) ? '' : '"()"'
      ).filter(_.identity).join(' ')
  }
, exec: function(options){
    var def = Q.defer();
    
    exec(this.cmd(options), function(error, stdout, stderr){
      if(error) def.reject(error)
      def.resolve(stdout, stderr)
    })

    return def.promise
  }
}

module.exports = BaseX
