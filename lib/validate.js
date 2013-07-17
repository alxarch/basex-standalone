module.exports = (function(){

var _ = require('lodash')
  , format = require('util').format
  , read = require('fs').readFileSync
  , options = JSON.parse(read(__dirname+'/options.json'))
  , commands = JSON.parse(read(__dirname+'/commands.json'))

return {
  option: function(option, value){
    option = option.toLowerCase()
    _.identity(value);
    if(!_.has(options, option))
        throw new Error('Invalid option name: '+option)

  },
  command: function(cmd){
        var name = cmd.__cmd__
          , err = []

        if(!_.has(commands, name))
            throw new Error(format('Invalid command name: %s', name))

        var def = commands[name]

        _.each(cmd, function(v, p){
            if(p === '__cmd__' || p === '__input__' || _.has(def.params.optional, p) || _.has(def.params.required, p)) 
                return
            ;else
                err.push(format('Invalid parameter "%s" (%s)', p, def.definition))
        })

        _.each(def.params.required || {}, function(values, p){
            if(!_.has(cmd, p) || !cmd[p])
                err.push(format('Command requires parameter "%s" (%s)', p, def.definition))

            if(_.isArray(values) && !_.contains(values, cmd[p]))
                err.push(format('Invalid parameter value %s="%s" (%s)', p, cmd[p], def.definition))
        })

        _.each(def.params.optional || {}, function(values, p){
            if(p in cmd && _.isArray(values) && !_.contains(values, cmd[p]))
                err.push(format('Invalid parameter value %s="%s" (%s)', p, cmd[p], def.definition))
        })

        if(err.length > 0)
            throw new Error(err.join("\n"))
  }
}

})()
