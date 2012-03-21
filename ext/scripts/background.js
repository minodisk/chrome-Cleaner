(function() {
  var BrowsingData, Omnibox, Storage,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Storage = (function() {

    Storage.DEFAULT = {
      period: 'everything',
      history: true,
      downloads: true,
      cache: true,
      cookies: false,
      passwords: false,
      formData: false
    };

    function Storage() {
      var key, value, _ref;
      _ref = Storage.DEFAULT;
      for (key in _ref) {
        value = _ref[key];
        if (this.get(key) == null) this.set(key, value);
      }
    }

    Storage.prototype.get = function(key) {
      var value;
      value = localStorage[key];
      if (value != null) value = JSON.parse(value);
      return value;
    };

    Storage.prototype.set = function(key, value) {
      return localStorage[key] = JSON.stringify(value);
    };

    Storage.prototype.getData = function() {
      return {
        period: this.get('period'),
        dataToRemove: {
          history: this.get('history'),
          downloads: this.get('downloads'),
          cache: this.get('cache'),
          cookies: this.get('cookies'),
          passwords: this.get('passwords'),
          formData: this.get('formData')
        }
      };
    };

    return Storage;

  })();

  BrowsingData = (function() {

    function BrowsingData(_storage) {
      var _this = this;
      this._storage = _storage;
      chrome.browserAction.onClicked.addListener(function() {
        return _this.clear(_this._storage.getData());
      });
    }

    BrowsingData.prototype.clear = function(data) {
      if (data.period == null) data.period = this._storage.get('period');
      return chrome.experimental.clear.browsingData(data.period, data.dataToRemove, function() {
        return webkitNotifications.createHTMLNotification("notification.html#" + (JSON.stringify(data))).show();
      });
    };

    return BrowsingData;

  })();

  Omnibox = (function() {

    Omnibox.FLAGS = (function() {
      var FLAGS, flag, i, keyword;
      FLAGS = {
        h: 'history',
        d: 'downloads',
        c: 'cache',
        k: 'cookies',
        p: 'passwords',
        f: 'formData'
      };
      for (flag in FLAGS) {
        keyword = FLAGS[flag];
        i = keyword.indexOf(flag);
        FLAGS[flag] = {
          keyword: keyword,
          keys: [keyword.substr(0, i - 1), keyword.substr(i, 1), keyword.substr(i + 1)]
        };
      }
      return FLAGS;
    })();

    function Omnibox(_browsingData) {
      this._browsingData = _browsingData;
      this._clear = __bind(this._clear, this);
      this._setDefaultSuggestion('');
      chrome.omnibox.onInputChanged.addListener(this._setDefaultSuggestion);
      chrome.omnibox.onInputEntered.addListener(this._clear);
    }

    Omnibox.prototype._setDefaultSuggestion = function(text) {
      var d, desc, flag, keys, _ref;
      desc = [];
      _ref = Omnibox.FLAGS;
      for (flag in _ref) {
        keys = _ref[flag].keys;
        if (text.indexOf(flag) !== -1) {
          d = "<url>" + keys[0] + "<match>" + keys[1] + "</match>" + keys[2] + "</url>";
        } else {
          d = "<dim>" + keys[0] + "</dim><match>" + keys[1] + "</match><dim>" + keys[2] + "</dim>";
        }
        desc.push(d);
      }
      return chrome.omnibox.setDefaultSuggestion({
        description: desc.join(', ')
      });
    };

    Omnibox.prototype._clear = function(text) {
      var data, flag, keyword, _ref;
      data = {
        dataToRemove: {}
      };
      _ref = Omnibox.FLAGS;
      for (flag in _ref) {
        keyword = _ref[flag].keyword;
        data.dataToRemove[keyword] = text.indexOf(flag) !== -1;
      }
      return this._browsingData.clear(data);
    };

    return Omnibox;

  })();

  this.storage = new Storage();

  this.browsingData = new BrowsingData(this.storage);

  new Omnibox(this.browsingData);

}).call(this);
