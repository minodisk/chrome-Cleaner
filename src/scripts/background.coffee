class Storage

  @DEFAULT:
    period   : 'everything'
    history  : true
    downloads: true
    cache    : true
    cookies  : false
    passwords: false
    formData : false

  constructor: ->
    for key, value of Storage.DEFAULT
      unless @get(key)?
        @set key, value

  get: (key)->
    value = localStorage[key]
    if value?
      value = JSON.parse value
    value

  set: (key, value)->
    localStorage[key] = JSON.stringify value

  getData: ->
    {
    period      : @get 'period'
    dataToRemove:
      history  : @get 'history'
      downloads: @get 'downloads'
      cache    : @get 'cache'
      cookies  : @get 'cookies'
      passwords: @get 'passwords'
      formData : @get 'formData'
    }

class BrowsingData

  constructor: (@_storage)->
    chrome.browserAction.onClicked.addListener @clearWithStorageData

  clearWithStorageData: =>
    @clear @_storage.getData()

  clear: (data)->
    unless data.period?
      data.period = @_storage.get 'period'
    chrome.experimental.clear.browsingData data.period, data.dataToRemove, ->
      webkitNotifications
      .createHTMLNotification("notification.html##{JSON.stringify(data)}")
      .show()

class Omnibox

  @FLAGS: do ->
    FLAGS =
      h: 'history'
      d: 'downloads'
      c: 'cache'
      k: 'cookies'
      p: 'passwords'
      f: 'formData'
    for flag, keyword of FLAGS
      i = keyword.indexOf flag
      FLAGS[flag] =
        keyword: keyword
        keys   : [
          keyword.substr 0, i - 1
          keyword.substr i, 1
          keyword.substr i + 1
        ]
    FLAGS

  constructor: (@_browsingData)->
    @_setDefaultSuggestion ''
    chrome.omnibox.onInputChanged.addListener @_setDefaultSuggestion
    chrome.omnibox.onInputEntered.addListener @_clear

  _setDefaultSuggestion: (text)->
    desc = []
    for flag, { keys } of Omnibox.FLAGS
      if text.indexOf(flag) isnt -1
        d = "<url>#{keys[0]}<match>#{keys[1]}</match>#{keys[2]}</url>"
      else
        d = "<dim>#{keys[0]}</dim><match>#{keys[1]}</match><dim>#{keys[2]}</dim>"
      desc.push d
    chrome.omnibox.setDefaultSuggestion {
    description: desc.join ', '
    }

  _clear: (text)=>
    if text is ''
      @_browsingData.clearWithStorageData()
    else
      data =
        dataToRemove: {}
      if text.indexOf('a') isnt -1
        for flag, { keyword } of Omnibox.FLAGS
          data.dataToRemove[keyword] = true
      else
        for flag, { keyword } of Omnibox.FLAGS
          data.dataToRemove[keyword] = text.indexOf(flag) isnt -1
      @_browsingData.clear data

@storage = new Storage()
@browsingData = new BrowsingData @storage
new Omnibox @browsingData
