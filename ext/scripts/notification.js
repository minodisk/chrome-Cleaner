(function() {
  var data, startToClose, stopToClose, timeoutId;

  data = JSON.parse(location.hash.substr(1));

  timeoutId = null;

  startToClose = function() {
    return timeoutId = setTimeout((function() {
      return window.close();
    }), 5000);
  };

  stopToClose = function() {
    return clearTimeout(timeoutId);
  };

  window.addEventListener('mouseover', function(e) {
    return stopToClose();
  });

  window.addEventListener('mouseout', function(e) {
    return startToClose();
  });

  startToClose();

  window.addEventListener('DOMContentLoaded', function(e) {
    var flag, name, _ref, _results;
    document.querySelector("#" + data.period).style.display = 'inline';
    _ref = data.dataToRemove;
    _results = [];
    for (name in _ref) {
      flag = _ref[name];
      if (flag) {
        _results.push(document.querySelector("#" + name).style.display = 'block');
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });

}).call(this);
