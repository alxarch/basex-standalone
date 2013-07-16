module.exports = (function(){

var _ = require('lodash')
  , validate = require('./validate.js')
  , Job = function(){
        this.queue = []
        this.bindings = {}
        this.db = null
    }
  , slice = Array.prototype.slice
  , ident = _.identity
  , arr = function(){
        return [].concat(slice.apply(arguments)).filter(ident)
    }
  , util = require('util')
  , format = util.format
  , attr = function(v, k) {
        return format('%s=%s', k, v) 
    }

Job.prototype = {
    requires: function(modules){
        var rq = function(m){
                this.queue.unshift({
                    cmd: 'repo-install',
                    path: m
                })
            }.bind(this)

        arr(modules).forEach(rq)
        
        return this
    }
  , xquery: function(xql){
        return this.command('xquery', xql)
    }
  , command: function(name, input, params){

        if(_.isPlainObject(input)){
            params = input
            input = undefined
        }

        switch(name){
            case 'xquery':
                input = format('<![CDATA[%s]]>', input || '()')
                break
            case 'open':
            case 'create-db':
                this.db = params.name
                break
            case 'check':
                this.db = params.input
                break
            case 'close':
                this.db = null
                break
            case 'drop-db':
                if(params.name === this.db)
                this.db = null
                break
        }

        var cmd = _.extend({}, params || {}, {cmd: name, txt: input})

        validate.command(cmd)

        this.queue.push(cmd)

        return this
    }
  , check: function(dbname){
        return this.command('check', {name: dbname})
    }
  , createdb: function(dbname, input){
        return this.command('create-db', input, {name: dbname})
    }
  , dropdb: function(dbname){
        return this.command('drop-db', {name: dbname})
    }
  , open: function(dbname){
        return this.command('open', {name: dbname})
    }
  , import: function(input, path, options){

        var child = new Job()

        child.set(_.pick(options, [
            'parser', 
            'createfilter', 
            'parseropt', 
            'htmlopt', 
            'chop', 
            'addarchives', 
            'skipcorrupt', 
            'addraw'
        ]))
        
        if(arguments.length === 2 && _.isPlainObject(path)){
            options = path
            path = ''
        }

        child.open(options.db || this.db)

        arr(input).forEach(function(f){
            var params = path ? {path: format('%s/%s', path, f)} : {}
            child.command('add', f, params)
        })

        this.run(child.render())

        return this
    }
  , export: function(path){
        return path ? this.command('export', {path: path}) : this
    }
  , execute: function(commands){
        var ex = function(input){
                this.command('execute', input)
            }.bind(this)

        arr(commands).forEach(ex)

        return this
    }
  , run: function(operation){
        var op = function(file){
                this.command('run', {file: file})
            }.bind(this)

        arr(operation).forEach(op)

        return this
    }
  , bind: function(key, value){

        if(!key) return this

        var bind = function(value, key){
                this.bindings[key] = value.toString().replace(',', ',,')
            }.bind(this)
          , pairs = _.isPlainObject(key) ? key : _.object([key], [value])

        _.each(pairs, bind)
        
        return this
    }
  , set: function(key, value){
        var set = function(value, key){
                validate.option(key, value)
                this.command('set', value, {option: key})
            }.bind(this)
          , pairs = _.isPlainObject(key) ? key : _.object([key], [value])

        _.each(pairs, set)

        return this
    }
  , render: function(){
        var bindings = _.map(this.bindings, attr).join(',')

        if(bindings)
            this.queue.unshift({cmd: 'set', option: 'bindings', txt: bindings})

        return format('<commands>%s</commands>', this.queue.map(function(c){
            var cmd = c.cmd
              , txt = c.txt
              , par = _.map(c, function(v, k){
                    if(k === 'txt' || k === 'cmd') 
                        return null

                    if(_.isPlainObject(v)) 
                        v = _.map(v, attr).filter(ident).join(',')

                    return attr(format('"%s"', v), k)

                }).filter(ident).join(' ')

            return format('<%s%s>%s</%s>', cmd, par ? ' '+par : '', txt || '', cmd)

        }).join(''))
    }
  , toString: function(){
        return this.render()
    }
  
}

return Job

})()