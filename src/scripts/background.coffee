DEFAULT =
  period: 'everything'
  cache: true
  cookies: false
  downloads: true
  formData: false
  history: true
  passwords: false

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
  chrome.experimental.clear.browsingData storage.get('period'), {
  cache: storage.get 'cache'
  cookies: storage.get 'cookies'
  downloads: storage.get 'downloads'
  formData: storage.get 'formData'
  history: storage.get 'history'
  passwords: storage.get 'passwords'
  }
