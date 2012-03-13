(function() {
  var DEFAULT;

  DEFAULT = {
    period: 'everything',
    cache: true,
    cookies: false,
    downloads: true,
    formData: false,
    history: true,
    passwords: false
  };

  window.storage = {
    get: function(key) {
      var value;
      value = localStorage[key];
      if (value != null) value = JSON.parse(value);
      return value;
    },
    set: function(key, value) {
      return localStorage[key] = JSON.stringify(value);
    }
  };

  (function() {
    var key, value, _results;
    _results = [];
    for (key in DEFAULT) {
      value = DEFAULT[key];
      if (storage.get(key) == null) {
        _results.push(storage.set(key, value));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  })();

  chrome.browserAction.onClicked.addListener(function(tab) {
    return chrome.experimental.clear.browsingData(storage.get('period'), {
      cache: storage.get('cache'),
      cookies: storage.get('cookies'),
      downloads: storage.get('downloads'),
      formData: storage.get('formData'),
      history: storage.get('history'),
      passwords: storage.get('passwords')
    });
  });

}).call(this);
