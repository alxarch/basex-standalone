module.exports = (function(){

var _ = require('lodash')
  , format = require('util', format)

/*
@see lib/xquery/options.xql
*/

var options = {
  "dbpath": "path",
  "repopath": "path",
  "debug": "boolean",
  "lang": "language",
  "langkey": "boolean",
  "globallock": "boolean",
  "host": "host",
  "port": "port",
  "serverport": "port",
  "eventport": "port",
  "user": "name",
  "password": "password",
  "serverhost": "host|ip",
  "proxyhost": "host",
  "proxyport": "port",
  "nonproxyhosts": "hosts",
  "timeout": "seconds",
  "keepalive": "seconds",
  "parallel": "number",
  "log": "boolean",
  "logmsgmaxlen": "length",
  "webpath": "path",
  "restxqpath": "path",
  "httplocal": "boolean",
  "stopport": "port",
  "mainmem": "boolean",
  "addcache": "boolean",
  "createfilter": "filter",
  "addarchives": "boolean",
  "skipcorrupt": "boolean",
  "addraw": "boolean",
  "parser": "type",
  "parseropt": "options",
  "htmlopt": "options",
  "chop": "boolean",
  "intparse": "boolean",
  "dtd": "boolean",
  "catfile": "path",
  "textindex": "boolean",
  "attrindex": "boolean",
  "ftindex": "boolean",
  "maxlen": "int",
  "maxcats": "int",
  "updindex": "boolean",
  "indexsplitsize": "num",
  "ftindexsplitsize": "num",
  "stemming": "boolean",
  "casesens": "boolean",
  "diacritics": "boolean",
  "language": "lang",
  "stopwords": "path",
  "queryinfo": "boolean",
  "xquery3": "",
  "bindings": "vars",
  "querypath": "path",
  "cachequery": "boolean",
  "forcecreate": "boolean",
  "checkstrings": "boolean",
  "lserror": "error",
  "runs": "num",
  "serialize": "boolean",
  "serializer": "params",
  "exporter": "params",
  "xmlplan": "boolean",
  "compplan": "boolean",
  "dotplan": "boolean",
  "dotcompact": "boolean",
  "dotdisplay": "boolean",
  "dotty": "path",
  "autoflush": "boolean",
  "writeback": "boolean",
  "maxstat": "num"
}

/* 
@see lib/xquery/commands.xql
*/

var commands = {
  "create-db": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "open": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "check": {
    "input-required": false,
    "params": {
      "required": {
        "input": "string"
      },
      "optional": {
      }
    }
  },
  "close": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "export": {
    "input-required": false,
    "params": {
      "required": {
        "path": "string"
      },
      "optional": {
      }
    }
  },
  "create-index": {
    "input-required": false,
    "params": {
      "required": {
        "type": [
          "text",
          "attribute",
          "fulltext"
        ]
      },
      "optional": {
      }
    }
  },
  "drop-index": {
    "input-required": false,
    "params": {
      "required": {
        "type": [
          "text",
          "attribute",
          "fulltext"
        ]
      },
      "optional": {
      }
    }
  },
  "alter-db": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string",
        "newname": "string"
      },
      "optional": {
      }
    }
  },
  "drop-db": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "create-backup": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "restore": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "inspect": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "drop-backup": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "show-backups": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "copy": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string",
        "newname": "string"
      },
      "optional": {
      }
    }
  },
  "info-db": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "info-index": {
    "input-required": false,
    "params": {
      "required": {
        "type": [
          "tag",
          "attname",
          "path",
          "text",
          "attribute",
          "fulltext"
        ]
      },
      "optional": {
      }
    }
  },
  "info-storage": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "list": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
        "name": "string",
        "path": "string"
      }
    }
  },
  "xquery": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "retrieve": {
    "input-required": false,
    "params": {
      "required": {
        "path": "string"
      },
      "optional": {
      }
    }
  },
  "find": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "cs": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "repo-install": {
    "input-required": false,
    "params": {
      "required": {
        "path": "string"
      },
      "optional": {
      }
    }
  },
  "repo-list": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "repo-delete": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "add": {
    "input-required": true,
    "params": {
      "required": {
      },
      "optional": {
        "path": "string"
      }
    }
  },
  "delete": {
    "input-required": false,
    "params": {
      "required": {
        "path": "string"
      },
      "optional": {
      }
    }
  },
  "rename": {
    "input-required": false,
    "params": {
      "required": {
        "path": "string",
        "newpath": "string"
      },
      "optional": {
      }
    }
  },
  "replace": {
    "input-required": true,
    "params": {
      "required": {
        "path": "string"
      },
      "optional": {
      }
    }
  },
  "store": {
    "input-required": true,
    "params": {
      "required": {
      },
      "optional": {
        "path": "string"
      }
    }
  },
  "optimize": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "optimize-all": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "flush": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "show-sessions": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "show-users": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
        "database": "string"
      }
    }
  },
  "kill": {
    "input-required": false,
    "params": {
      "required": {
        "target": "string"
      },
      "optional": {
      }
    }
  },
  "create-event": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "show-events": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "drop-event": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "create-user": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "alter-user": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
      }
    }
  },
  "drop-user": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string"
      },
      "optional": {
        "database": "string"
      }
    }
  },
  "grant": {
    "input-required": false,
    "params": {
      "required": {
        "name": "string",
        "permission": [
          "none",
          "read",
          "write",
          "create",
          "admin"
        ]
      },
      "optional": {
        "database": "string"
      }
    }
  },
  "password": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "run": {
    "input-required": false,
    "params": {
      "required": {
        "file": "string"
      },
      "optional": {
      }
    }
  },
  "execute": {
    "input-required": true,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "get": {
    "input-required": false,
    "params": {
      "required": {
        "option": "string"
      },
      "optional": {
      }
    }
  },
  "set": {
    "input-required": false,
    "params": {
      "required": {
        "option": "string"
      },
      "optional": {
      }
    }
  },
  "info": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "help": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  },
  "exit": {
    "input-required": false,
    "params": {
      "required": {
      },
      "optional": {
      }
    }
  }
}

return {
  option: function(option, value){
    option = option.toLowerCase()
    _.identity(value);
    if(!_.has(options, option))
        throw new Error('Invalid option name: '+option)

  },
  command: function(cmd){
        var name = cmd.cmd
          , err = []

        if(!_.has(commands, name))
            throw new Error(format('Invalid command name: %s', name))

        var def = commands[name]
        
        if(!cmd.txt && def.input_required)
            err.push(format('Command requires input: %s', def.definition))

        _.each(cmd, function(v, p){
            if(p === 'cmd' || p === 'txt' || _.has(def.params.optional, p) || _.has(def.params.required, p)) 
                return
            ;else
                err.push(format('Invalid parameter "%s" (%s)', p, def.definition))
        })

        _.each(def.params.required || {}, function(values, p){
            if(!_.has(cmd, p))
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
  },
  _options: options,
  _commands: commands
}

})()
