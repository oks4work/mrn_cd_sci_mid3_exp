"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Timer =
/*#__PURE__*/
function () {
  function Timer(config, callbacks) {
    _classCallCheck(this, Timer);

    this.startTime = 0;
    this.continuousTime = 0;
    this.intervalID = 0;
    this.config = config;
    this.callbacks = callbacks;
  }

  _createClass(Timer, [{
    key: "addConfig",
    value: function addConfig(config) {
      for (var prop in config) {
        this.config[prop] = config[prop];
      }
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this = this;

      var startIndicator = false;
      this.intervalID = window.setInterval(function () {
        if (!startIndicator) {
          _this.startTime = new Date().getTime();
          startIndicator = true;
        } // console.log(this.timePassed);


        if (_this.callbacks && _this.callbacks.interval) {
          _this.callbacks.interval();
        }
      });
    }
  }, {
    key: "pauseTimer",
    value: function pauseTimer() {
      this.continuousTime = this.timePassed;
      window.clearInterval(this.intervalID);
    }
  }, {
    key: "resetTimer",
    value: function resetTimer() {
      this.continuousTime = 0;
      window.clearInterval(this.intervalID);
    } // 지난 시간

  }, {
    key: "timePassed",
    get: function get() {
      return this.continuousTime + (new Date().getTime() - this.startTime) * this.config.playbackSpeed;
    }
  }]);

  return Timer;
}();