module.exports = (function(){

_ = require('lodash')

/*
@see lib/xquery/options.xql
*/

var options = {
  "DBPATH": "path",
  "REPOPATH": "path",
  "DEBUG": "boolean",
  "LANG": "language",
  "LANGKEY": "boolean",
  "GLOBALLOCK": "boolean",
  "HOST": "host",
  "PORT": "port",
  "SERVERPORT": "port",
  "EVENTPORT": "port",
  "USER": "name",
  "PASSWORD": "password",
  "SERVERHOST": "host|ip",
  "PROXYHOST": "host",
  "PROXYPORT": "port",
  "NONPROXYHOSTS": "hosts",
  "TIMEOUT": "seconds",
  "KEEPALIVE": "seconds",
  "PARALLEL": "number",
  "LOG": "boolean",
  "LOGMSGMAXLEN": "length",
  "WEBPATH": "path",
  "RESTXQPATH": "path",
  "HTTPLOCAL": "boolean",
  "STOPPORT": "port",
  "MAINMEM": "boolean",
  "ADDCACHE": "boolean",
  "CREATEFILTER": "filter",
  "ADDARCHIVES": "boolean",
  "SKIPCORRUPT": "boolean",
  "ADDRAW": "boolean",
  "PARSER": "type",
  "PARSEROPT": "options",
  "HTMLOPT": "options",
  "CHOP": "boolean",
  "INTPARSE": "boolean",
  "DTD": "boolean",
  "CATFILE": "path",
  "TEXTINDEX": "boolean",
  "ATTRINDEX": "boolean",
  "FTINDEX": "boolean",
  "MAXLEN": "int",
  "MAXCATS": "int",
  "UPDINDEX": "boolean",
  "INDEXSPLITSIZE": "num",
  "FTINDEXSPLITSIZE": "num",
  "STEMMING": "boolean",
  "CASESENS": "boolean",
  "DIACRITICS": "boolean",
  "LANGUAGE": "lang",
  "STOPWORDS": "path",
  "QUERYINFO": "boolean",
  "XQUERY3": "",
  "BINDINGS": "vars",
  "QUERYPATH": "path",
  "CACHEQUERY": "boolean",
  "FORCECREATE": "boolean",
  "CHECKSTRINGS": "boolean",
  "LSERROR": "error",
  "RUNS": "num",
  "SERIALIZE": "boolean",
  "SERIALIZER": "params",
  "EXPORTER": "params",
  "XMLPLAN": "boolean",
  "COMPPLAN": "boolean",
  "DOTPLAN": "boolean",
  "DOTCOMPACT": "boolean",
  "DOTDISPLAY": "boolean",
  "DOTTY": "path",
  "AUTOFLUSH": "boolean",
  "WRITEBACK": "boolean",
  "MAXSTAT": "num"
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
  option: function(key, value){
    option = option.toUpperCase()

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
