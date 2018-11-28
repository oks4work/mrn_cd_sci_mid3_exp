"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var ClickToggleClass =
  /*#__PURE__*/
  function () {
    function ClickToggleClass(HTMLelement, className, callbacks) {
      _classCallCheck(this, ClickToggleClass);

      this.element = HTMLelement;
      this.element.object = this;
      this.toggleClassName = className;
      this.callbacks = {
        click: callbacks && callbacks.click || null,
        on: callbacks && callbacks.on || null,
        off: callbacks && callbacks.off || null
      };
    }

    _createClass(ClickToggleClass, [{
      key: "addEvent",
      value: function addEvent() {
        var _this = this;

        this.element.addEventListener("click", function () {
          _this.clickEventHandler();

          if (_this.callbacks.click) {
            _this.callbacks.click();
          }
        });
      }
    }, {
      key: "clickEventHandler",
      value: function clickEventHandler() {
        if (this.isOn) {
          this.off();

          if (this.callbacks.off) {
            this.callbacks.off();
          }
        } else {
          this.on();

          if (this.callbacks.on) {
            this.callbacks.on();
          }
        }
      }
    }, {
      key: "on",
      value: function on() {
        this.element.classList.add(this.toggleClassName);
      }
    }, {
      key: "off",
      value: function off() {
        this.element.classList.remove(this.toggleClassName);
      }
    }, {
      key: "pointerOn",
      value: function pointerOn() {
        this.element.style.cursor = "pointer";
        this.element.style.pointerEvents = "auto";
      }
    }, {
      key: "pointerOff",
      value: function pointerOff() {
        this.element.style.cursor = "default";
        this.element.style.pointerEvents = "none";
      }
    }, {
      key: "isOn",
      get: function get() {
        return this.element.classList.contains(this.toggleClassName);
      }
    }]);

    return ClickToggleClass;
  }();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ClickToggleClass;
  } else {
    window.ClickToggleClass = ClickToggleClass;
  }
})();