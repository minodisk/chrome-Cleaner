data = JSON.parse location.hash.substr(1)

timeoutId = null
startToClose = ->
  timeoutId = setTimeout (->
    window.close()
  ), 5000
stopToClose = ->
  clearTimeout timeoutId

window.addEventListener 'mouseover', (e)->
  stopToClose()
window.addEventListener 'mouseout', (e)->
  startToClose()
startToClose()

window.addEventListener 'DOMContentLoaded', (e)->
  document.querySelector("##{data.period}").style.display = 'inline'
  for name, flag of data.dataToRemove
    if flag
      document.querySelector("##{name}").style.display = 'block'
