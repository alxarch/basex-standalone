module.exports = (function(){

var _ = require('lodash')
  , validate = require('./validate.js')
  , _path = require('path')
  , read = require('fs').readFileSync
  , commands = JSON.parse(read(__dirname+'/commands.json'))
  , Job = function(){
        this.queue = []
        this.bindings = {}
        this.db = null
    }
  , format = require('util').format
  , attr = function(v, k) {
        return format('%s=%s', k, v) 
    }

Job.prototype = {
    requires: function(){
        var that = this
        _(arguments)
            .toArray()
            .flatten()
            .compact()
            .each(function(m){
                that.queue.unshift({__cmd__:'repo-install', path: m})
            })
        return this
    }
  , xquery: function(xquery){
        return this.command('xquery', xquery)
    }
  , command: function(name, input, params){

        if(_.isPlainObject(input)){
            params = input
            input = undefined
        }

        params = params || {}

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

        var cmd = _.extend({}, params, {__cmd__: name, __input__: input})

        validate.command(cmd)

        this.queue.push(cmd)

        return this
    }
  , check: function(dbname){
        return this.command('check', {input: dbname})
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

        options = options || {}

        child.open(options.db || this.db)
        
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

        input = _.isString(input) ? [input] : input

        _([input]).flatten().compact().each(function(f){
            var params = {}

            if(path) params.path = _path.join(path, f)

            child.command('add', f, params)
        })

        this.execute(child)

        return this
    }
  , export: function(path){
        return this.command('export', {path: path})
    }
  , execute: function(input){
        return this.command('execute', input)
    }
  , run: function(file){
        return this.command('run', {file: file})
    }
  , bind: function(key, value){

        if(!key) return this

        var that = this
          , bind = function(value, key){
                that.bindings[key] = value.toString().replace(',', ',,')
            }
          , pairs = _.isPlainObject(key) ? key : _.object([key], [value])

        _(pairs).each(bind)
        
        return this
    }
  , set: function(key, value){
        
        if(!key) return this

        var that = this
          , set = function(value, key){
                validate.option(key, value)
                that.command('set', value, {option: key})
            }
          , pairs = _.isPlainObject(key) ? key : _.object([key], [value])

        _(pairs).each(set)

        return this
    }
  , render: function(){
        var bindings = _.map(this.bindings, attr).join(','),
            queue = _.clone(this.queue)

        if(bindings)
            queue.unshift({__cmd__: 'set', option: 'bindings', __input__: bindings})

        return format('<commands>%s</commands>', queue.map(function(c){
            var cmd = c.__cmd__
              , input = c.__input__ || ''
              , par = _(c)
                    .omit('__input__', '__cmd__')
                    .map(function(v, k){
                        
                        if(_.isPlainObject(v)) 
                            v = _(v).map(attr).compact().join(',')

                        return attr(format('"%s"', v), k)

                    })
                    .compact()
                    .join(' ')

            if(commands[cmd].input)
                return format('<%s%s>%s</%s>', cmd, par ? ' '+par : '', input, cmd)
            else
                return format('<%s%s/>', cmd, par ? ' '+par : '')

        }).join(''))
    }
  , toString: function(){
        return this.render()
    }
  
}

return Job

})()