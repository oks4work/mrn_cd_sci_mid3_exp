"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CommentBox =
/*#__PURE__*/
function () {
  function CommentBox(elements, config) {
    _classCallCheck(this, CommentBox);

    this.elements = elements;
    this.config = config;
    this.count = 0;
    this.callbacks = {
      commentEnd: undefined
    };
  }

  _createClass(CommentBox, [{
    key: "addCallbacks",
    value: function addCallbacks(callbacks) {
      for (var prop in this.callbacks) {
        if (callbacks[prop]) {
          this.callbacks[prop] = callbacks[prop];
        }
      }
    }
  }, {
    key: "setBasicStyles",
    value: function setBasicStyles() {
      var _this = this;

      var container, comments;
      container = this.elements.container;
      comments = this.elements.comments;
      container.style.opacity = 1;
      container.style.transitionDuration = "".concat(this.config.containerTransitionDuration, "ms");
      comments.forEach(function (comment, index) {
        comment.style.opacity = 0;
        comment.innerHTML = _this.config.commentTexts[index];
      }); // mode: btn

      if (this.config.mode === "btn") {
        this.hideBtn();
      }
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this2 = this;

      document.addEventListener("DOMContentLoaded", function () {
        _this2.elements.comments[0].style.display = "";

        _this2.showNextTimeout(_this2.config.firstShowDelay);
      });

      if (this.config.mode === "btn") {
        this.elements.btn.addEventListener("click", function () {
          _this2.showNext();
        });
      }
    }
  }, {
    key: "showNextTimeout",
    value: function showNextTimeout(delay) {
      var _this3 = this;

      window.setTimeout(function () {
        _this3.showNext();
      }, delay);
    }
  }, {
    key: "showNext",
    value: function showNext() {
      var _this4 = this;

      // mode: btn
      if (this.config.mode === "btn") {
        if (this.count === this.elements.comments.length) {
          this.hideComment();
          return;
        } else {// this.hideBtn();
        }
      }

      if (this.elements.comments[this.count - 1]) {
        this.elements.comments[this.count - 1].style.display = "none";
      }

      this.elements.comments[this.count].style.display = "";
      this.elements.comments[this.count].style.opacity = "1";
      this.elements.comments[this.count].style.transitionDuration = "".concat(this.config.transitionDuration, "ms");
      this.count++;
      window.setTimeout(function () {
        // mode: auto
        if (_this4.config.mode === "auto") {
          if (!_this4.elements.comments[_this4.count]) {
            _this4.hideComment();
          } else {
            _this4.showNextTimeout(0);
          }
        } // mode: btn
        else if (_this4.config.mode === "btn") {
            _this4.showBtn();
          }
      }, this.config.commentHideDelay[this.count - 1]);
    }
  }, {
    key: "hideComment",
    value: function hideComment() {
      var _this5 = this;

      this.elements.container.style.opacity = 0;
      window.setTimeout(function () {
        _this5.elements.container.style.display = "none";
      }, this.config.containerTransitionDuration);

      if (this.callbacks && this.callbacks.commentEnd) {
        this.callbacks.commentEnd();
      }
    }
  }, {
    key: "hideBtn",
    value: function hideBtn() {
      this.elements.btn.style.opacity = "0";
      this.elements.btn.style.visibility = "hidden";
      this.elements.btn.style.transitionDuration = "";
    }
  }, {
    key: "showBtn",
    value: function showBtn() {
      this.elements.btn.style.opacity = "1";
      this.elements.btn.style.visibility = "visible";
      this.elements.btn.style.transitionDuration = "".concat(this.config.containerTransitionDuration, "ms");
    }
  }, {
    key: "start",
    value: function start() {
      this.setBasicStyles();
      this.addEvents();
    }
  }]);

  return CommentBox;
}();