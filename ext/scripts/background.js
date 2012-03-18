(function() {
  var DEFAULT;

  DEFAULT = {
    period: 'everything',
    history: true,
    downloads: true,
    cache: true,
    cookies: false,
    passwords: false,
    formData: false
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
    var data;
    data = {
      period: storage.get('period'),
      dataToRemove: {
        history: storage.get('history'),
        downloads: storage.get('downloads'),
        cache: storage.get('cache'),
        cookies: storage.get('cookies'),
        passwords: storage.get('passwords'),
        formData: storage.get('formData')
      }
    };
    return chrome.experimental.clear.browsingData(data.period, data.dataToRemove, function() {
      return webkitNotifications.createHTMLNotification("notification.html#" + (JSON.stringify(data))).show();
    });
  });

}).call(this);
