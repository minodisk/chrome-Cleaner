(function() {
  var onInputChanged, storage;

  storage = chrome.extension.getBackgroundPage().storage;

  onInputChanged = function(e) {
    var input, value;
    input = e.target;
    switch (input.type) {
      case 'checkbox':
        value = input.checked;
        break;
      default:
        value = input.value;
    }
    return storage.set(input.name, value);
  };

  window.addEventListener('DOMContentLoaded', function(e) {
    var input, inputs, value, _i, _len, _results;
    inputs = document.querySelectorAll('select, input');
    _results = [];
    for (_i = 0, _len = inputs.length; _i < _len; _i++) {
      input = inputs[_i];
      value = storage.get(input.name);
      switch (input.type) {
        case 'checkbox':
          input.checked = value;
          break;
        default:
          input.value = value;
      }
      _results.push(input.addEventListener('change', onInputChanged));
    }
    return _results;
  });

}).call(this);
