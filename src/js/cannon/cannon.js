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
    } // 속도 = 처음속도 + 가속도 * 시간

  }, {
    key: "velocity",
    get: function get() {
      return this.config.startVelocity + this.config.graAcc * this.timePassed / 1000;
    } // 처음 속도로 이동한 거리 + 가속도로 이동한 거리 (가속도 * 시간의 제곱 / 2)

  }, {
    key: "distance",
    get: function get() {
      return this.config.startVelocity * this.timePassed / 1000 + this.config.graAcc * Math.pow(this.timePassed / 1000, 2) / 2;
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
    this.reset();
  }

  _createClass(Ball, [{
    key: "move",
    value: function move(distance) {
      this.element.style.display = "";
      Ball.transform(this.element, "translateY(".concat(distance * cannon.config.cannonMeterPixelRatio, "px)"));
    }
  }, {
    key: "reset",
    value: function reset() {
      this.element.style.display = "none";
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

var CannonLine =
/*#__PURE__*/
function () {
  function CannonLine(config) {
    _classCallCheck(this, CannonLine);

    this.config = config;
    this.area = $ts.getEl(".cannonLineArea")[0];
    this.increaseLine = $ts.getEl("#increaseLine");
    this.descendLine = $ts.getEl("#descendLine");
    this.lines = [this.increaseLine, this.descendLine];
    this.pins = [];
    this.pinCount = 0;
  }

  _createClass(CannonLine, [{
    key: "initiate",
    value: function initiate() {
      this.addEvent();
      this.hideArea();
    }
  }, {
    key: "addEvent",
    value: function addEvent() {
      this.lines.forEach(function (line) {
        line.addEventListener("click", CannonLine.lineClickHandler);
      });
    }
  }, {
    key: "hideArea",
    value: function hideArea() {
      this.area.style.display = "none";
    }
  }, {
    key: "showArea",
    value: function showArea() {
      this.area.style.display = "block";
    }
  }, {
    key: "pinDistributor",
    value: function pinDistributor(config) {
      if (this.pinCount < cannon.config.pin.maxLength) {
        this.pinMaker(config);
      }
    }
  }, {
    key: "pinMaker",
    value: function pinMaker(config) {
      var _this = this;

      var container, pin, circle, text, indicator;
      container = cannon.elements.pinContainer;
      pin = $ts.ce({
        tag: "li",
        parent: container
      });
      pin.style.top = "".concat(config.top - 18, "px");
      circle = $ts.ce({
        tag: "div",
        class: "circle",
        parent: pin
      });
      circle.style.backgroundColor = cannon.config.pin.color[this.pinCount];
      text = $ts.ce({
        tag: "div",
        class: "text",
        parent: pin
      });
      text.innerHTML = cannon.config.pin.text[this.pinCount];
      indicator = $ts.ce({
        tag: "div",
        class: "indicator pin_indicator",
        parent: pin
      });
      pin.indicator = indicator;
      this.pins.push(pin);
      this.pinCount++;
      this.pins.forEach(function (pin) {
        pin.indicator.classList.remove("indicating");
      });
      window.setTimeout(function () {
        _this.pins.forEach(function (pin) {
          pin.indicator.classList.add("indicating");
        });
      });
      circle.addEventListener("click", function (e) {
        CannonLine.pinClickHandler(e, config);
      });
      text.addEventListener("click", function (e) {
        CannonLine.pinClickHandler(e, config);
      });
      indicator.addEventListener("click", function (e) {
        CannonLine.pinClickHandler(e, config);
      });
    }
  }, {
    key: "pinDestroyer",
    value: function pinDestroyer() {
      this.pins.forEach(function (pin) {
        pin.parentElement.removeChild(pin);
      });
      this.pins = [];
      this.pinCount = 0;
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      this.hideArea();
      CannonLine.hidePins();
    }
  }, {
    key: "showAll",
    value: function showAll() {
      this.showArea();
      CannonLine.showPins();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.hideAll();
      this.pinDestroyer();
    }
  }, {
    key: "change",
    value: function change(distance) {
      this.increaseLine.style.height = "".concat(distance * cannon.config.cannonMeterPixelRatio - (41 + 35), "px");
      this.increaseLine.style.bottom = "".concat(35, "px");

      if (cannon.timer.velocity >= 0) {
        this.descendLine.style.top = "".concat(1, "px");
        this.descendLine.style.height = "".concat(parseInt(this.area.style.height) - distance * cannon.config.cannonMeterPixelRatio - (5 + 1), "px");
      } else {
        this.descendLine.style.height = 0;
        this.area.style.height = "".concat(distance * cannon.config.cannonMeterPixelRatio, "px");
      }
    }
  }], [{
    key: "clickedHeight",
    value: function clickedHeight(event) {
      var clientY, cannonSize, cannonY, cannonHeight, clickedY, result;
      clientY = event.touches ? event.touches[0].clientY : event.clientY;
      clientY = clientY / cannon.scale.getZoomRate();
      cannonSize = $ts.getSize(cannon.elements.cannonArea);
      cannonY = cannonSize.top;
      cannonHeight = cannonSize.height / cannon.scale.getZoomRate();
      clickedY = clientY - cannonY; // 실제 클릭한 높이 (위에서 아래 => y값)

      result = cannonHeight - clickedY; // 실제 클릭한 높이 (아래에서 위 => 실제)

      result = result / cannon.config.cannonMeterPixelRatio; // 클릭 높이(px) / (px / m) = 실제 높이(m)

      return {
        top: clickedY,
        height: -result // (-) 없애기

      };
    }
  }, {
    key: "lineClickHandler",
    value: function lineClickHandler() {
      var event, result;
      event = arguments[0];
      result = CannonLine.clickedHeight(event);
      cannon.line.pinDistributor(result);
    }
  }, {
    key: "pinClickHandler",
    value: function pinClickHandler(e, config) {
      var target = e.target;

      while (target.className) {
        target = target.parentElement;
      }

      cannon.graph.changes({
        height: config.height,
        target: target
      });
    }
  }, {
    key: "hidePins",
    value: function hidePins() {
      cannon.elements.pinContainer.style.display = "none";
    }
  }, {
    key: "showPins",
    value: function showPins() {
      cannon.elements.pinContainer.style.display = "block";
    }
  }]);

  return CannonLine;
}();

var Graph =
/*#__PURE__*/
function () {
  function Graph(elements) {
    _classCallCheck(this, Graph);

    this.elements = elements;
    this.bars = [];
    this.distance = null; // 높이

    this.KE = null; // 운동 에너지

    this.LE = null; // 위치 에너지

    this.ME = null; // 역학적 에너지
  }

  _createClass(Graph, [{
    key: "initiate",
    value: function initiate() {
      var _this2 = this;

      this.distance = new Bar($ts.getEl("#distance"));
      this.KE = new Bar($ts.getEl("#kineticEnergy"));
      this.LE = new Bar($ts.getEl("#locationEnergy"));
      this.ME = new Bar($ts.getEl("#mechanicalEnergy"));
      this.bars = [this.distance, this.KE, this.LE, this.ME];
      this.bars.forEach(function (bar, index) {
        var bottomText = _this2.elements.texts[index];

        if (index === 0) {
          bottomText.style.marginLeft = "".concat(cannon.config.graph.barMargin, "px");
        }

        bottomText.style.width = "".concat(cannon.config.graph.barWidth, "px");
        bottomText.style.marginRight = "".concat(cannon.config.graph.barMargin, "px");
        bar.initiate();
        bar.change(0);
      });
      this.elements.barContainer.style.height = "".concat(cannon.config.graph.areaHeight, "px");
      this.hideTitle();
    }
  }, {
    key: "hideTitle",
    value: function hideTitle() {
      this.elements.titleTxt.classList.add("off");
    }
  }, {
    key: "showTitle",
    value: function showTitle(string) {
      this.elements.titleTxt.classList.remove("off");
      $ts.getEl("p", this.elements.titleTxt)[0].innerHTML = "".concat(string, " \uC9C0\uC810");
    }
  }, {
    key: "changes",
    value: function changes(config) {
      var height, titleText, mechanicalE, locationE, kineticE;
      height = Math.floor(-config.height);

      if (config.target) {
        titleText = config.target.children[1].innerHTML;
        this.showTitle(titleText);
      }

      mechanicalE = cannon.config.mechanicalE;
      locationE = Graph.locationEnergy(-config.height);
      kineticE = mechanicalE - locationE;
      this.distance.change(height);
      this.LE.change(locationE);
      this.ME.change(mechanicalE);
      this.KE.change(kineticE);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.hideTitle();
      this.bars.forEach(function (bar) {
        bar.change(0);
      });
    }
  }], [{
    key: "locationEnergy",
    value: function locationEnergy(distance) {
      var result = Math.round(cannon.config.constants.graAcc * cannon.config.mass.current * distance);

      if (result >= cannon.config.mechanicalE) {
        result = cannon.config.mechanicalE;
      }

      return result;
    }
  }]);

  return Graph;
}();

var Bar =
/*#__PURE__*/
function () {
  function Bar(element) {
    _classCallCheck(this, Bar);

    this.element = element;
    this.tip = $ts.getEl("div", element)[0];
    this.num = $ts.getEl(".num", element)[0];
    this.name = element.id;
  }

  _createClass(Bar, [{
    key: "initiate",
    value: function initiate() {
      if (this.name === "distance") {
        this.element.style.marginLeft = "".concat(cannon.config.graph.barMargin, "px");
      }

      this.element.style.width = "".concat(cannon.config.graph.barWidth, "px");
      this.element.style.marginRight = "".concat(cannon.config.graph.barMargin, "px"); // this.element.style.transitionTimingFunction = `linear`;

      this.element.style.transitionDuration = "".concat(cannon.config.graph.barTransitionDuration, "ms");
      this.tip.style.top = "".concat(-cannon.config.graph.tipHeight, "px");
      this.tip.style.height = "".concat(cannon.config.graph.tipHeight, "px");
      this.tip.style.lineHeight = "".concat(cannon.config.graph.tipHeight, "px");
    }
  }, {
    key: "change",
    value: function change(value) {
      var height = 0,
          num = 0,
          maxHeight;
      maxHeight = cannon.config.graph.areaHeight - cannon.config.graph.tipHeight; // 높이

      if (this.name === "distance") {
        height = value / Math.floor(-cannon.config.maxDistance) * maxHeight;
        num = value;
      } // 역학적 에너지
      else if (this.name === "mechanicalEnergy") {
          if (value) {
            height = maxHeight;
            num = value;
          }
        } // 운동 에너지 & 위치 에너지
        else {
            height = value / cannon.config.mechanicalE * maxHeight;
            num = value;
          }

      this.element.style.height = "".concat(height, "px");
      this.num.innerHTML = "".concat(num);
    }
  }]);

  return Bar;
}();

var Indicator =
/*#__PURE__*/
function () {
  function Indicator(element) {
    _classCallCheck(this, Indicator);

    this.element = element;
    this.hide();
  }

  _createClass(Indicator, [{
    key: "indicating",
    value: function indicating() {
      this.element.classList.add("indicating");
    }
  }, {
    key: "show",
    value: function show() {
      this.element.classList.remove("displayN");
    }
  }, {
    key: "hide",
    value: function hide() {
      this.element.classList.add("displayN");
    }
  }]);

  return Indicator;
}();

var Cannon =
/*#__PURE__*/
function () {
  function Cannon(elements, config) {
    var _this3 = this;

    _classCallCheck(this, Cannon);

    this.elements = elements;
    this.config = config;
    this.inputConnections = [];
    this.playBtn = null; // this.stopBtn = null;

    this.replayBtn = null;
    this.timer = null;
    this.ball = null;
    this.line = null;
    this.graph = null;
    this.commentBox = new CommentBox({
      container: $ts.getEl(".commentBox")[0],
      comments: $ts.getEl("p", $ts.getEl(".commentBox_inner")[0]),
      btn: $ts.getEl(".commentNextBtn")[0]
    }, config.comment);
    this.commentBox.addCallbacks({
      commentEnd: function commentEnd() {
        _this3.indicators.velocity.show();

        _this3.indicators.velocity.indicating();

        _this3.indicators.mass.show();

        _this3.indicators.mass.indicating();
      }
    });
    this.scale = new $cale({
      target: $ts.getEl(".contentsArea")[0]
    });
    this.indicators = {
      velocity: null,
      mass: null
    };
  }

  _createClass(Cannon, [{
    key: "initiate",
    value: function initiate() {
      this.commentBox.start();
      this.initiateHTMLelements();
      this.initiateEfSound();
      this.initiateBtns();
      this.initiateTimer();
      this.initiateInputConnections();
      this.initiateBall();
      this.initiateLine();
      this.initiateGraph();
      this.initiateIndicators();
    }
  }, {
    key: "initiateHTMLelements",
    value: function initiateHTMLelements() {
      var _this4 = this;

      var intervalID = window.setInterval(function () {
        var cannonAreaSize, cannonAreaStyle;
        cannonAreaSize = $ts.getSize(_this4.elements.cannonArea);
        cannonAreaStyle = $ts.getStyles(_this4.elements.cannonArea);

        if (cannonAreaSize.top && cannonAreaStyle.left) {
          window.clearInterval(intervalID);
          _this4.elements.pinContainer.style.top = "".concat(cannonAreaSize.top, "px");
          _this4.elements.pinContainer.style.left = "".concat(cannonAreaStyle.left);
        }
      });
      this.elements.cannonArea.style.height = "".concat(this.config.cannon.areaHeight, "px");
      this.elements.lineComment.style.display = "none";
      document.addEventListener('touchmove', function (event) {
        event.preventDefault();
      }, {
        passive: false
      });
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
      var _this5 = this;

      this.playBtn = new ClickToggleClass(this.elements.playBtn, "on", {
        click: function click() {
          _this5.efSound.play("media/click.mp3");
        },
        on: function on() {
          _this5.timer.resetConfig({
            startVelocity: cannon.config.velocity.current,
            mass: cannon.config.mass.current
          });

          _this5.playBtn.pointerOn();

          _this5.replayBtn.off();

          _this5.line.hideAll();

          _this5.elements.lineComment.style.display = "none";

          _this5.graph.reset();

          _this5.disableInputs();

          _this5.timer.startTimer();
        },
        off: function off() {
          _this5.timer.pauseTimer();

          _this5.line.showAll();

          _this5.elements.lineComment.style.display = "block"; // this.replayBtn.on();
        }
      }); // this.stopBtn = new ClickToggleClass(this.elements.stopBtn, "on", {
      //     click: () => {
      //         this.efSound.play("media/click.mp3");
      //     },
      //     on: () => {
      //         this.timer.pauseTimer();
      //
      //         cannon.playBtn.off();
      //
      //         this.line.showAll();
      //     }
      // });

      this.replayBtn = new ClickToggleClass(this.elements.replayBtn, "on", {
        click: function click() {
          _this5.efSound.play("media/click.mp3");
        },
        on: function on() {
          _this5.reset();
        }
      });
      this.playBtn.addEvent(); // this.stopBtn.addEvent();

      this.replayBtn.addEvent();
    }
  }, {
    key: "initiateTimer",
    value: function initiateTimer() {
      var _this6 = this;

      this.timer = new CannonTimer(cannon.config.timer, {
        interval: function interval() {
          if (_this6.timer.distance > 0) {
            // 끝나는 경우
            _this6.reset();
          } else {
            _this6.ball.move(_this6.timer.distance);

            _this6.line.change(-_this6.timer.distance);

            _this6.graph.changes({
              height: _this6.timer.distance
            });
          }
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
    key: "initiateInputConnections",
    value: function initiateInputConnections() {
      var _this7 = this;

      this.elements.inputPairs.forEach(function (pair) {
        var name, inputConn;
        name = pair[0].id.indexOf("velocity") > -1 ? "velocity" : "mass";
        inputConn = new InputConnection(name, pair, {
          initiate: function initiate(self) {
            self.inputs.forEach(function (input) {
              input.min = name === "mass" ? cannon.config[self.name].min : -cannon.config[self.name].min;
              input.max = name === "mass" ? cannon.config[self.name].max : -cannon.config[self.name].max;
              input.value = name === "mass" ? cannon.config[self.name].initial : -cannon.config[self.name].initial;
            });
          },
          change: function change() {
            var _this8 = this;

            // this : callback 보낸 input tag
            var value, self;
            value = parseInt(this.value);
            self = this.self; // 바뀐 값 config에 입력

            cannon.config[self.name].current = self.name === "mass" ? value : -value;
            self.inputs.forEach(function (input) {
              // 둘 중 다른 input에 넣기
              if (_this8 !== input) {
                input.value = value;
              }
            });

            if (self.name === "mass") {
              if (!cannon.indicators.mass.changedFirst) {
                cannon.indicators.mass.hide();
                cannon.indicators.mass.changedirst = true;
              }
            } else {
              if (!cannon.indicators.velocity.changedFirst) {
                cannon.indicators.velocity.hide();
                cannon.indicators.velocity.changedirst = true;
              }
            }
          }
        });
        inputConn.initiate();

        _this7.inputConnections.push(inputConn);
      });
    }
  }, {
    key: "initiateBall",
    value: function initiateBall() {
      this.ball = new Ball($ts.getEl("#cannonball"), {
        ratio: this.config.constants.cannonMeterPixelRatio
      });
    }
  }, {
    key: "initiateLine",
    value: function initiateLine() {
      this.line = new CannonLine({
        ratio: this.config.constants.cannonMeterPixelRatio
      });
      this.line.initiate();
    }
  }, {
    key: "initiateGraph",
    value: function initiateGraph() {
      this.graph = new Graph({
        titleTxt: $ts.getEl(".graphTitleTxt")[0],
        titleLine: $ts.getEl(".graphTitleLIne")[0],
        barContainer: $ts.getEl(".graphContents")[0],
        bars: $ts.getEl(".colorBar"),
        texts: $ts.getEl("li", $ts.getEl(".cannonGraph_text")[0])
      });
      this.graph.initiate();
    }
  }, {
    key: "initiateIndicators",
    value: function initiateIndicators() {
      this.indicators.velocity = new Indicator(this.elements.indicators.velocity);
      this.indicators.velocity.changedFirst = false;
      this.indicators.mass = new Indicator(this.elements.indicators.mass);
      this.indicators.mass.changedFirst = false;
    }
  }, {
    key: "disableInputs",
    value: function disableInputs() {
      this.elements.inputPairs.forEach(function (pair) {
        pair[0].disabled = true;
        pair[1].disabled = true;
      });
    }
  }, {
    key: "ableInputs",
    value: function ableInputs() {
      this.elements.inputPairs.forEach(function (pair) {
        pair[0].disabled = false;
        pair[1].disabled = false;
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.timer.resetTimer();
      this.playBtn.off(); // this.stopBtn.on();

      this.replayBtn.on();
      this.line.reset();
      this.elements.lineComment.style.display = "none";
      this.ball.reset();
      this.graph.reset();
      this.ableInputs();
    }
  }]);

  return Cannon;
}();

var cannon = new Cannon({
  container: $ts.getEl(".contentsArea")[0],
  playBtn: $ts.getEl(".playBtn")[0],
  // stopBtn: $ts.getEl(".stopBtn")[0],
  replayBtn: $ts.getEl(".replayBtn")[0],
  inputPairs: [[$ts.getEl("#rangeInput_velocity"), $ts.getEl("#numberInput_velocity")], [$ts.getEl("#rangeInput_mass"), $ts.getEl("#numberInput_mass")]],
  cannonArea: $ts.getEl(".cannonArea")[0],
  lineComment: $ts.getEl(".cannonLineArea_comment")[0],
  pinContainer: $ts.getEl(".cannonLinePins")[0],
  indicators: {
    velocity: $ts.getEl("#velocityArrow"),
    mass: $ts.getEl("#massArrow")
  }
}, config);
cannon.initiate();