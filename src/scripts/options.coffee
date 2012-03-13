{ storage } = chrome.extension.getBackgroundPage()

onInputChanged = (e)->
  input = e.target
  switch input.type
    when 'checkbox'
      value = input.checked
    else
      value = input.value
  storage.set input.name, value

window.addEventListener 'DOMContentLoaded', (e)->
  inputs = document.querySelectorAll 'select, input'
  for input in inputs
    value = storage.get input.name
    switch input.type
      when 'checkbox'
        input.checked = value
      else
        input.value = value
    input.addEventListener 'change', onInputChanged

