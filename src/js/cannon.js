"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

console.info("\u25A1 cannon.js is loading...");

var CannonTimer =
/*#__PURE__*/
function (_Timer) {
  _inherits(CannonTimer, _Timer);

  function CannonTimer(config, callbacks) {
    _classCallCheck(this, CannonTimer);

    return _possibleConstructorReturn(this, _getPrototypeOf(CannonTimer).call(this, config, callbacks));
  }

  _createClass(CannonTimer, [{
    key: "resetConfig",
    value: function resetConfig(values) {
      this.setStartVelocity = values.startVelocity;
      this.setMass = values.mass;
    }
  }, {
    key: "velocity",
    get: function get() {
      // 속도 = 처음속도 + 가속도 * 시간
      return this.config.graAcc * this.timePassed / 1000 - this.config.startVelocity;
    }
  }, {
    key: "distance",
    get: function get() {
      // 처음 속도로 이동한 거리 - 가속도로 이동한 거리 (가속도 * 시간의 제곱 / 2)
      var result = this.config.startVelocity * this.timePassed / 1000 - this.config.graAcc * Math.pow(this.timePassed / 1000, 2) / 2;
      return -result;
    }
  }, {
    key: "setStartVelocity",
    set: function set(number) {
      this.config.startVelocity = number;
    }
  }, {
    key: "setMass",
    set: function set(number) {
      this.config.mass = number;
    }
  }]);

  return CannonTimer;
}(Timer);

var Ball =
/*#__PURE__*/
function () {
  function Ball(element, config) {
    _classCallCheck(this, Ball);

    this.element = element;
    this.config = config;
  }

  _createClass(Ball, [{
    key: "move",
    value: function move(distance) {
      Ball.transform(this.element, "translateY(".concat(distance * cannon.config.cannonMeterPixelRatio, "px)"));
    }
  }, {
    key: "reset",
    value: function reset() {
      Ball.transform(this.element, "translateY(0)");
    }
  }], [{
    key: "transform",
    value: function transform(element, value) {
      element.style.webkitTransform = value;
      element.style.mozTransform = value;
      element.style.msTransform = value;
      element.style.oTransform = value;
      element.style.transform = value;
    }
  }]);

  return Ball;
}();

var Cannon =
/*#__PURE__*/
function () {
  function Cannon(elements, config) {
    _classCallCheck(this, Cannon);

    this.elements = elements;
    this.config = config;
    this.inputConnections = [];
    this.playBtn = null;
    this.stopBtn = null;
    this.replayBtn = null;
    this.timer = null;
    this.ball = null;
  }

  _createClass(Cannon, [{
    key: "initiate",
    value: function initiate() {
      this.initiateEfSound();
      this.initiateBtns();
      this.initiateInputConnections();
      this.initiateTimer();
      this.initiateBall();
      $ts.getEl(".cannonArea")[0].style.height = "".concat(this.config.ratio, "px");
    }
  }, {
    key: "initiateEfSound",
    value: function initiateEfSound() {
      this.efSound = new EffectSound(this.elements.container);
      this.efSound.initiate();
    }
  }, {
    key: "initiateBtns",
    value: function initiateBtns() {
      var _this = this;

      this.playBtn = new ClickToggleClass(this.elements.playBtn, "on", {
        click: function click() {
          _this.efSound.play("media/click.mp3");
        },
        on: function on() {
          _this.timer.resetConfig({
            startVelocity: cannon.config.velocity.current,
            mass: cannon.config.mass.current
          });

          _this.timer.startTimer();

          _this.stopBtn.off();

          _this.replayBtn.off();
        }
      });
      this.stopBtn = new ClickToggleClass(this.elements.stopBtn, "on", {
        click: function click() {
          _this.efSound.play("media/click.mp3");
        },
        on: function on() {
          _this.timer.pauseTimer();

          cannon.playBtn.off();
        }
      });
      this.replayBtn = new ClickToggleClass(this.elements.replayBtn, "on", {
        click: function click() {
          _this.efSound.play("media/click.mp3");
        },
        on: function on() {
          _this.timer.resetTimer();

          _this.ball.move(0);

          cannon.playBtn.off();

          if (!cannon.stopBtn.isOn) {
            cannon.stopBtn.on();
          }
        }
      });
      this.playBtn.addEvent();
      this.stopBtn.addEvent();
      this.replayBtn.addEvent();
    }
  }, {
    key: "initiateInputConnections",
    value: function initiateInputConnections() {
      var _this2 = this;

      this.elements.inputPairs.forEach(function (pair) {
        var name, inputConn;
        name = pair[0].id.indexOf("velocity") > -1 ? "velocity" : "mass";
        inputConn = new InputConnection(name, pair, {
          initiate: function initiate(self) {
            self.inputs.forEach(function (input) {
              input.min = cannon.config[self.name].min;
              input.max = cannon.config[self.name].max;
              input.value = cannon.config[self.name].initial;
            });
          },
          change: function change() {
            var _this3 = this;

            // this : callback 보낸 input tag
            var value, self;
            value = parseInt(this.value);
            self = this.self; // 바뀐 값 config에 입력

            cannon.config[self.name].current = value;
            self.inputs.forEach(function (input) {
              // 둘 중 다른 input에 넣기
              if (_this3 !== input) {
                input.value = value;
              }
            });
          }
        });
        inputConn.initiate();

        _this2.inputConnections.push(inputConn);
      });
    }
  }, {
    key: "initiateTimer",
    value: function initiateTimer() {
      var _this4 = this;

      this.timer = new CannonTimer(cannon.config.timer, {
        interval: function interval() {
          if (_this4.timer.distance >= 0) {
            // 끝나는 경우
            _this4.timer.resetTimer();

            _this4.playBtn.off();

            _this4.stopBtn.on();

            _this4.replayBtn.on();
          }

          _this4.ball.move(_this4.timer.distance);
        }
      });
      this.timer.addConfig(cannon.config.constants); // 여러 상수들 입력

      this.timer.addConfig({
        startVelocity: cannon.config.velocity.current
      });
      this.timer.addConfig({
        mass: cannon.config.mass.current
      });
    }
  }, {
    key: "initiateBall",
    value: function initiateBall() {
      this.ball = new Ball($ts.getEl("#cannonball"), {
        ratio: this.config.constants.cannonMeterPixelRatio
      });
    }
  }]);

  return Cannon;
}();

var cannon = new Cannon({
  container: $ts.getEl(".contentsArea")[0],
  playBtn: $ts.getEl(".playBtn")[0],
  stopBtn: $ts.getEl(".stopBtn")[0],
  replayBtn: $ts.getEl(".replayBtn")[0],
  inputPairs: [[$ts.getEl("#rangeInput_velocity"), $ts.getEl("#numberInput_velocity")], [$ts.getEl("#rangeInput_mass"), $ts.getEl("#numberInput_mass")]]
}, config);
cannon.initiate();
console.info(cannon);