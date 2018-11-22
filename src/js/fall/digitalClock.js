"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var DigitalClock =
  /*#__PURE__*/
  function () {
    function DigitalClock(elements) {
      _classCallCheck(this, DigitalClock);

      this.elements = elements;
    } // 개별 요소 바꾸기


    _createClass(DigitalClock, [{
      key: "changeAll",
      // 전체 요소 바꾸기
      value: function changeAll(time) {
        this.time = time;

        if (this.elements.hour) {
          DigitalClock.change(this.elements.hour, this.hour);
        }

        if (this.elements.min) {
          DigitalClock.change(this.elements.min, this.min);
        }

        if (this.elements.sec) {
          DigitalClock.change(this.elements.sec, this.sec);
        }

        if (this.elements.ms) {
          DigitalClock.change(this.elements.ms, this.ms);
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        this.changeAll(0);
      }
    }, {
      key: "time",
      set: function set(num) {
        this._time = num;
      },
      get: function get() {
        return this._time;
      }
    }, {
      key: "ms",
      get: function get() {
        return Math.floor(this._time % 1000 / 10);
      }
    }, {
      key: "sec",
      get: function get() {
        return Math.floor(this.time / 1000) % 60;
      }
    }, {
      key: "min",
      get: function get() {
        return Math.floor(this.time / 1000 * 60) % 60;
      }
    }, {
      key: "hour",
      get: function get() {
        return Math.floor(this.time / 1000 * 60 * 60) % 24;
      }
    }], [{
      key: "change",
      value: function change(element, value) {
        var array = value.toString().split("");

        if (array.length === 1) {
          element.children[0].innerHTML = 0;
          element.children[1].innerHTML = array[0];
        } else {
          element.children[0].innerHTML = array[0];
          element.children[1].innerHTML = array[1];
        }
      }
    }]);

    return DigitalClock;
  }();

  window.DigitalClock = DigitalClock;
})();