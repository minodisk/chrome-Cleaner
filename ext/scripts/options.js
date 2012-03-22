(function() {
  var Options, storage,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Options = (function() {

    function Options(_storage) {
      var _this = this;
      this._storage = _storage;
      this._onInputChanged = __bind(this._onInputChanged, this);
      window.addEventListener('DOMContentLoaded', function(e) {
        var input, inputs, value, _i, _len, _results;
        inputs = document.querySelectorAll('select, input');
        _results = [];
        for (_i = 0, _len = inputs.length; _i < _len; _i++) {
          input = inputs[_i];
          value = _this._storage.get(input.name);
          switch (input.type) {
            case 'checkbox':
              input.checked = value;
              break;
            default:
              input.value = value;
          }
          _results.push(input.addEventListener('change', _this._onInputChanged));
        }
        return _results;
      });
    }

    Options.prototype._onInputChanged = function(e) {
      var input, value;
      input = e.target;
      switch (input.type) {
        case 'checkbox':
          value = input.checked;
          break;
        default:
          value = input.value;
      }
      return this._storage.set(input.name, value);
    };

    return Options;

  })();

  storage = chrome.extension.getBackgroundPage().storage;

  new Options(storage);

}).call(this);
