"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CommentBox =
/*#__PURE__*/
function () {
  function CommentBox(HTMLelements, opts) {
    _classCallCheck(this, CommentBox);

    this.elements = HTMLelements;
    this.opts = opts;
    this.count = 0;
  }

  _createClass(CommentBox, [{
    key: "setBasicStyles",
    value: function setBasicStyles() {
      var _this = this;

      var container, comments;
      container = this.elements.container;
      comments = this.elements.comments;
      container.style.opacity = 1;
      container.style.transitionDuration = "".concat(this.opts.containerTransitionDuration, "ms");
      comments.forEach(function (comment, index) {
        comment.style.opacity = 0;
        comment.innerHTML = _this.opts.commentTexts[index];
      });
    }
  }, {
    key: "addEvent",
    value: function addEvent() {
      var _this2 = this;

      document.addEventListener("DOMContentLoaded", function () {
        _this2.elements.comments[0].style.display = "";

        _this2.showNextComment(_this2.opts.firstShowDelay);
      });
    }
  }, {
    key: "showNextComment",
    value: function showNextComment(delay) {
      var _this3 = this;

      window.setTimeout(function () {
        if (_this3.elements.comments[_this3.count - 1]) {
          _this3.elements.comments[_this3.count - 1].style.display = "none";
        }

        _this3.elements.comments[_this3.count].style.display = "";
        _this3.elements.comments[_this3.count].style.opacity = 1;
        _this3.elements.comments[_this3.count].style.transitionDuration = "".concat(_this3.opts.transitionDuration, "ms");
        _this3.count++;
        window.setTimeout(function () {
          if (!_this3.elements.comments[_this3.count]) {
            _this3.hideComment();
          } else {
            _this3.showNextComment(0);
          }
        }, _this3.opts.commentHideDelay[_this3.count - 1]);
      }, delay);
    }
  }, {
    key: "hideComment",
    value: function hideComment() {
      var _this4 = this;

      this.elements.container.style.opacity = 0;
      window.setTimeout(function () {
        _this4.elements.container.style.display = "none";
      }, this.opts.containerTransitionDuration);
    }
  }, {
    key: "start",
    value: function start() {
      this.setBasicStyles();
      this.addEvent();
    }
  }]);

  return CommentBox;
}();