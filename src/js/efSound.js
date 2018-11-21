"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EffectSound =
/*#__PURE__*/
function () {
  function EffectSound(containerElement) {
    _classCallCheck(this, EffectSound);

    console.log(containerElement);
    this.container = containerElement;
    this.audio = document.createElement("audio");
    this.intervalID = 0;
  }

  _createClass(EffectSound, [{
    key: "initiate",
    value: function initiate() {
      this.audio.preload = "none";
      this.audio.autoplay = false;
    }
  }, {
    key: "play",
    value: function play(srcString) {
      var _this = this;

      if (this.audio.src.indexOf(srcString) > -1) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.audio.src = srcString;
        this.audio.load();
        this.intervalID = window.setInterval(function () {
          if (_this.audio.readyState) {
            window.clearInterval(_this.intervalID);

            _this.audio.play();
          }
        });
      } // audio.addEventListener("pause", () => {
      //     EffectSound.endUpFn(audio);
      // });
      // audio.addEventListener("ended", () => {
      //     EffectSound.endUpFn(audio);
      // });

    }
  }], [{
    key: "intervalFn",
    value: function intervalFn(e) {
      var audio = EffectSound.audio;

      if (audio.readyState) {
        window.clearInterval(audio.intervalID);
        audio.play();
      }
    }
  }]);

  return EffectSound;
}();