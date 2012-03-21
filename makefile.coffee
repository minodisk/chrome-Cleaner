###
Installation of CoffeeScript
$ npm install -g coffee-script

Usage
$ coffee makefile.coffee

Function
1. Detect change of source files.
2. Compile CoffeeScript to JavaScript.
###

fs = require 'fs'
Junc = require 'junc'
coffee = require 'coffee-script'

requested = false

startWatch = ->
  for dir in ['src/scripts']
    fs.watch dir, onChange

onChange = (event, filename)->
  unless requested
    requested = true
    setTimeout (->
      requested = false
      startCompile()
    ), 1000

timeStamp = ->
  date = new Date()
  "#{padLeft date.getHours()}:#{padLeft date.getMinutes()}:#{padLeft date.getSeconds()}"

padLeft = (num, length = 2, pad = '0')->
  str = num.toString 10
  while str.length < length
    str = pad + str
  str

startCompile = ->
  Junc.serial(
    Junc.func(->
      fs.readdir 'src/scripts', @next
    )
    Junc.func((err, files)->
      juncs = []
      for file in files
        do (file)->
          juncs.push Junc.serial(
            Junc.func(->
              @local.src = "src/scripts/#{file}"
              @local.dst = "ext/scripts/#{file.replace '.coffee', '.js'}"
              console.log "#{timeStamp()} Start compiling #{@local.src}"
              fs.readFile @local.src, 'utf8', @next
            )
            Junc.func((err, code)->
              fs.writeFile @local.dst, coffee.compile(code), @next
            )
            Junc.func((err, code)->
              console.log "#{timeStamp()} Complete compiling #{@local.dst}"
              @next()
            )
          )
      @next juncs
    )
    Junc.parallel
  )
  .start()

startWatch()
startCompile()
