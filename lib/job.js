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
        }

        var cmd = _.extend({}, params || {}, {cmd: name, txt: input})

        validate.command(cmd)

        this.queue.push(cmd)

        return this
    }
  , createdb: function(dbname, input){
        return this.command('create-db', input, {name: dbname})
    }
  , open: function(dbname){
        return this.command('open', {name: dbname})
    }
  , import: function(files, options){
        if(!this.db)
            throw new Error('No database opened.')

        var child = new Job()

        child.open(this.db)

        var _add = function(input, path){
                child.command('add', input, {path: path})
            }

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

        if(_.isString(files)) 
            _add(files)

        else if(_.isPlainObject(files))
            _.each(files, function(dest, src){
                _add(src, dest)
            })
        
        else if(_.isArray(files))
            _.each(files, function(f){

                if(_.isPlainObject(f)) 
                    _add(f.src, f.dest)

                else if(f.toString) 
                    _add(f.toString())
            })


        this.run(child.render())
        return this
    }
  , export: function(path){
        return this.command('export', {path: path})
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