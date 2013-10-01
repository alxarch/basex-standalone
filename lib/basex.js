/*
 * basex-standalone
 * https://github.com/alxarch/basex-standalone
 *
 * Copyright (c) 2013 Alexandros Sigalas
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash')
  , spawn = require('child_process').spawn
  , path = require('path')
  , ident = _.identity
  , Job = require('./job.js')
  , slice = Array.prototype.slice
  , cat = Array.prototype.concat
  , arr = function(){
        return cat.apply([], slice.apply(arguments)).filter(ident)
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
  , defaults = {
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
    , classpath: []
  }
  , op = function(options, cb){
      if(_.isFunction(options)){
        cb = options
        options = {}
      }

      if (_.isString(options) || options instanceof Job) options = { run: options }

      var opt = _.assign({}, defaults, options || {})
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

       var cp = spawn(cmd, baseargs.concat(arg), opt)
 
        cp.stdout.setEncoding('utf-8')
        cp.stderr.setEncoding('utf-8')

        if (_.isFunction(cb)){
          var out = []
            , err = []
          
          cp.stdout.on('data', function(data){
            out.push(data)
          })
          
          cp.stderr.on('data', function(data){
            err.push(data)
          })
          
          cp.on('error', function(error){
            cb(error, out.join(''), err.join(''))
          })
          
          cp.on('close', function(code){
            if(code === 0)
              cb(null, out.join(''), err.join(''))
            else
              cb(new Error('Operation failed.'), out.join(''), err.join(''))
          })
        }

        return cp
  }
  , partial = function(options){
      return function(opt, cb){
        if (_.isString(opt) || opt instanceof Job) opt = { run: opt }
        op(_.assign({}, options, opt), cb)
      }
  }

op._args = args
op.partial = partial
op.Job = Job

module.exports = op
