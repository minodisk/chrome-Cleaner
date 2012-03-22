(function() {
  var Notification,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Notification = (function() {

    function Notification(data) {
      this._stopToClose = __bind(this._stopToClose, this);
      this._startToClose = __bind(this._startToClose, this);      this._startToClose();
      window.addEventListener('mouseover', this._stopToClose);
      window.addEventListener('mouseout', this._startToClose);
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
    }

    Notification.prototype._startToClose = function() {
      return this._timeoutId = setTimeout((function() {
        return window.close();
      }), 5000);
    };

    Notification.prototype._stopToClose = function() {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        return this._timeoutId = null;
      }
    };

    return Notification;

  })();

  new Notification(JSON.parse(location.hash.substr(1)));

}).call(this);
