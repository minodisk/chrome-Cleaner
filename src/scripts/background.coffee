DEFAULT =
  period   : 'everything'
  history  : true
  downloads: true
  cache    : true
  cookies  : false
  passwords: false
  formData : false

window.storage =
  get: (key)->
    value = localStorage[key]
    if value?
      value = JSON.parse value
    value
  set: (key, value)->
    localStorage[key] = JSON.stringify value

do ->
  for key, value of DEFAULT
    unless storage.get(key)?
      storage.set key, value

chrome.browserAction.onClicked.addListener (tab)->
  data =
    period      : storage.get 'period'
    dataToRemove:
      history  : storage.get 'history'
      downloads: storage.get 'downloads'
      cache    : storage.get 'cache'
      cookies  : storage.get 'cookies'
      passwords: storage.get 'passwords'
      formData : storage.get 'formData'
  chrome.experimental.clear.browsingData data.period, data.dataToRemove, ->
    webkitNotifications.createHTMLNotification("notification.html##{JSON.stringify(data)}").show()
