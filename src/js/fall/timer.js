"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var Timer =
  /*#__PURE__*/
  function () {
    function Timer(config) {
      _classCallCheck(this, Timer);

      this.startTime = null;
      this.continuousTime = 0;
      this.intervalID = null;
      this.count = 1;
      this.config = config;
    }

    _createClass(Timer, [{
      key: "startTimer",
      value: function startTimer() {
        var _this = this;

        this.startTime = new Date().getTime();
        this.intervalID = window.setInterval(function () {
          dropCanvasInfo.objectPos.y = dropCanvasInfo.objectPos.initial.y + _this.distance * _this.config.meterPixelRatio;
          dropMoves.show();
          dropMoves.move();
          clock.changeAll(_this.timePassed);

          if (_this.timePassedCorr >= _this.config.captureInterval * _this.count) {
            console.log("t: ".concat(_this.timePassedCorr / 1000, "s, v: ").concat(_this.velocity, "m/s, d: ").concat(_this.distance, "m, playback speed: ").concat(_this.config.playbackSpeed));
            drawGraphs(_this.count);
            drawObjects(_this.timePassedCorr === _this.config.limitTime);
            _this.count++; // 시간이 limit time 지난 경우

            if (_this.timePassedCorr >= _this.config.limitTime) {
              _this.pauseTimer();

              stopBtn.object.on();
              dropMoves.hide();
              playBtn.object.pointerOff();
              replayBtn.object.pointerOn();
            }
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
        window.clearInterval(this.intervalID);
        this.startTime = null;
        this.continuousTime = 0;
        this.intervalID = null;
        this.count = 1;
        initDropCanvas();
        initGraphCanvases();
        clock.reset();
        dropMoves.move();
      } // 지난 시간

    }, {
      key: "timePassed",
      get: function get() {
        return this.continuousTime + (new Date().getTime() - this.startTime) * this.config.playbackSpeed;
      } // 지난 시간(interval 맞춰서 고정)

    }, {
      key: "timePassedCorr",
      get: function get() {
        return Math.floor(this.timePassed / this.config.captureInterval) * this.config.captureInterval;
      } // 속도

    }, {
      key: "velocity",
      get: function get() {
        // 속도 = 중력가속도 * 시간
        return this.config.graAcc * 10 * this.timePassed / (this.config.timeToVeConst * 10);
      } // 거리

    }, {
      key: "distance",
      get: function get() {
        // 거리 = 중력가속도 * 속도의 제곱 / 2
        var result = this.config.graAcc * 10 * Math.pow(this.timePassed / this.config.timeToVeConst, 2) / 20;
        result = Math.round(result * 100) / 100;
        return result;
      }
    }]);

    return Timer;
  }();

  window.Timer = Timer;
})();