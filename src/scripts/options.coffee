class Options

  constructor: (@_storage)->
    window.addEventListener 'DOMContentLoaded', (e)=>
      inputs = document.querySelectorAll 'select, input'
      for input in inputs
        value = @_storage.get input.name
        switch input.type
          when 'checkbox'
            input.checked = value
          else
            input.value = value
        input.addEventListener 'change', @_onInputChanged

  _onInputChanged: (e)=>
    input = e.target
    switch input.type
      when 'checkbox'
        value = input.checked
      else
        value = input.value
    @_storage.set input.name, value

{ storage } = chrome.extension.getBackgroundPage()
new Options storage