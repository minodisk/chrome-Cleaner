class Notification

  constructor: (data)->
    @_startToClose()
    window.addEventListener 'mouseover', @_stopToClose
    window.addEventListener 'mouseout', @_startToClose
    window.addEventListener 'DOMContentLoaded', (e)->
      document.querySelector("##{data.period}").style.display = 'inline'
      for name, flag of data.dataToRemove
        if flag
          document.querySelector("##{name}").style.display = 'block'

  _startToClose: =>
    @_timeoutId = setTimeout (->
      window.close()
    ), 5000

  _stopToClose: =>
    if @_timeoutId
      clearTimeout @_timeoutId
      @_timeoutId = null

new Notification JSON.parse(location.hash.substr(1))