"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var Timer =
  /*#__PURE__*/
  function () {
    function Timer() {
      _classCallCheck(this, Timer);

      this.startTime = null;
      this.intervalID = null;
      this.count = 1;
    }

    _createClass(Timer, [{
      key: "startTimer",
      value: function startTimer() {
        var _this = this;

        this.startTime = new Date().getTime();
        this.intervalID = window.setInterval(function () {
          if (_this.timePassed >= 250 * _this.count) {
            console.log(_this.timePassed);
            _this.count++;
          }
        });
      }
    }, {
      key: "resetTimer",
      value: function resetTimer() {
        window.clearInterval(this.intervalID);
        this.startTime = null;
        this.intervalID = null;
        this.count = 1;
      }
    }, {
      key: "timePassed",
      get: function get() {
        return new Date().getTime() - this.startTime;
      }
    }]);

    return Timer;
  }();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    console.log(module);
    module.exports = Timer;
  } else {
    window.Timer = Timer;
  }
})();