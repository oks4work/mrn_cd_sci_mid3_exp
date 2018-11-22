"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputConnection =
/*#__PURE__*/
function () {
  function InputConnection(name, inputs, callbacks) {
    _classCallCheck(this, InputConnection);

    this.name = name;
    this.inputs = inputs;
    this.callbacks = callbacks;
  }

  _createClass(InputConnection, [{
    key: "initiate",
    value: function initiate() {
      var _this = this;

      this.inputs.forEach(function (input) {
        input.self = _this;
      });
      this.addEvents();

      if (this.callbacks && this.callbacks.initiate) {
        this.callbacks.initiate(this);
      }
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this2 = this;

      this.inputs.forEach(function (input) {
        if (_this2.callbacks && _this2.callbacks.change) {
          input.addEventListener("change", _this2.callbacks.change);
        }
      });
    }
  }]);

  return InputConnection;
}();