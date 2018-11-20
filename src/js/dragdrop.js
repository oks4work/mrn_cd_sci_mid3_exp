"use strict"; /////////////////////////
// DragObj Constructor //
/////////////////////////

function DragObj(dragElement, DragDrop) {
  this.dragElement = dragElement;
  this.DragDrop = DragDrop; // getter, setter 설정하기

  Object.defineProperties(this, {
    // dragElement size
    size: {
      get: function get() {
        return this.dragElement.getBoundingClientRect();
      }
    },
    // dragElement css styles
    styles: {
      get: function get() {
        var styles = window.getComputedStyle(this.dragElement);
        return {
          position: styles.position,
          left: parseInt(styles.left),
          top: parseInt(styles.top),
          width: parseInt(styles.width),
          height: parseInt(styles.height)
        };
      }
    },
    // dragObj 처음 위치
    initStyles: {
      set: function set(styleObj) {
        this._initStyles = styleObj;
      },
      get: function get() {
        return this._initStyles;
      }
    },
    // dragObj 시작 좌표
    dragElementStartCoordinates: {
      set: function set(object) {
        this._dragElementStartCoordinates = object;
      },
      get: function get() {
        return this._dragElementStartCoordinates;
      }
    },
    // 비활성화되었는지 확인
    disabled: {
      get: function get() {
        return this.dragElement.dataset.dragElement === "complete";
      }
    },
    // 정답 get
    answers: {
      get: function get() {
        var answers;
        answers = this.dragElement.dataset.dragDropAnswer;

        if (answers.includes(",")) {
          answers = answers.split(",");
          answers = answers.map(function (item) {
            return item.trim();
          });
        }

        return answers;
      }
    }
  }); // 비활성화 & 활성화

  this.disable = function () {
    this.dragElement.dataset.dragElement = "complete";
  };

  this.able = function () {
    this.dragElement.dataset.dragElement = "";
  }; // class on


  this.classOn = function () {
    this.dragElement.style.position = "";
    this.dragElement.style.left = "";
    this.dragElement.style.top = "";
    this.dragElement.classList.add("dragComplete");
  }; // class off


  this.classOff = function () {
    this.dragElement.classList.remove("dragComplete");
  }; // 초기화


  this.reset = function () {
    this.dragElement.style.position = this.initStyles.position;
    this.dragElement.style.left = this.initStyles.left + "px";
    this.dragElement.style.top = this.initStyles.top + "px";
    this.classOff();
    this.able();
  }; // 정답 확인


  this.dragObjAnswer = function () {
    var answers, answersLen, answer, areaObjs, areaObjsLen, areaObj, areaAnswers, areaAnswer, areaAnswersLen;
    answers = this.answers;
    answersLen = answers.length;
    areaObjs = this.DragDrop.areaObjs;
    areaObjsLen = this.DragDrop.areaObjsLen;

    for (var i = 0; i < areaObjsLen; i++) {
      areaObj = areaObjs[i];
      areaAnswers = areaObj.answers;
      areaAnswersLen = areaAnswers.length;

      for (var j = 0; j < areaAnswersLen; j++) {
        areaAnswer = areaAnswers[j];

        for (var k = 0; k < answersLen; k++) {
          answer = answers[k];

          if (answer === areaAnswer) {
            if (this.DragDrop.opts.class) {
              this.classOn();
            } else {
              this.dragElement.style.position = "absolute";
              this.dragPositioning(areaObj);
            }

            this.disable();
          }
        }
      }
    }
  }; // down event가 이 dragElement 위인지 check


  this.checkDownEventIsOn = function (coordinates) {
    var bool;
    bool = this.size.left < coordinates.x && coordinates.x < this.size.left + this.size.width && this.size.top < coordinates.y && coordinates.y < this.size.top + this.size.height;
    return bool;
  }; // drag start


  this.dragStart = function (coordinates) {
    this.dragElement.style.position = "absolute"; // drag positioning

    this.dragPositioning(coordinates);
  }; // drag positioning


  this.dragPositioning = function (coordinates) {
    // console.log(coordinates.constructor.name); // dropArea 위에 떨어질 경우
    if (coordinates.constructor.name === "DropAreaObj") {
      this.dragElement.style.left = coordinates.dropSize.x + "px";
      this.dragElement.style.top = coordinates.dropSize.y + "px"; // 처음 자리로 돌아갈 경우
    } else {
      this.dragElement.style.left = this.dragElementStartCoordinates.x + (coordinates.x - this.DragDrop.eventStartCoordinates.x) + "px";
      this.dragElement.style.top = this.dragElementStartCoordinates.y + (coordinates.y - this.DragDrop.eventStartCoordinates.y) + "px";
    }
  }; // drag end


  this.dragObjEnd = function (coordinates) {
    var areaObjNow, isCorrect;
    areaObjNow = this.DragDrop.areaObjNow;
    isCorrect = this.DragDrop.isCorrect; // area 안에 들어온 경우

    if (areaObjNow) {
      // option이 정답인데 오답인 경우
      if (this.DragDrop.opts.answer && !isCorrect) {
        this.dragPositioning(this.DragDrop.eventStartCoordinates);
      } else {
        // noComplete 옵션인 경우, completeCallback만 실행
        if (this.DragDrop.opts.noComplete) {
          this.dragPositioning(this.DragDrop.eventStartCoordinates);

          if (this.DragDrop.completeCallback) {
            this.DragDrop.completeCallback(this, areaObjNow);
          }

          return;
        } // 클래스 부여해주는 옵션인 경우


        if (this.DragDrop.opts.class) {
          this.classOn(); // area 위치에 맞추는 경우
        } else {
          this.dragPositioning(areaObjNow);
        } // area 비활성화


        if (this.DragDrop.opts.disableArea) {
          areaObjNow.disable();
        } // dragObj 비활성화


        this.disable();
      } // area 안에 들어오지 않은 경우

    } else {
      // drag positioning
      this.dragPositioning(this.DragDrop.eventStartCoordinates);
    }

    if (this.DragDrop.endCallback) {
      this.DragDrop.endCallback({
        dragObj: this.DragDrop.dragObjNow,
        areaObj: areaObjNow,
        isCorrect: isCorrect
      });
    }
  };
} //////////////////////////
// DropArea Constructor //
//////////////////////////


function DropAreaObj(areaElement, DragDrop) {
  this.areaElement = areaElement;
  this.DragDrop = DragDrop; // getter, setter 설정하기

  Object.defineProperties(this, {
    // areaElement size
    size: {
      get: function get() {
        return this.areaElement.getBoundingClientRect();
      }
    },
    // areaElement css styles
    styles: {
      get: function get() {
        var styles = window.getComputedStyle(this.areaElement);
        return {
          left: parseInt(styles.left),
          top: parseInt(styles.top),
          width: parseInt(styles.width),
          height: parseInt(styles.height)
        };
      }
    },
    // dragObj가 drop되는 위치
    dropSize: {
      get: function get() {
        return {
          x: this.styles.left,
          y: this.styles.top
        };
      }
    },
    // 정답 get
    answers: {
      get: function get() {
        var answers;
        answers = this.areaElement.dataset.dragDropAnswer;

        if (answers.includes(",")) {
          answers = answers.split(",");
          answers = answers.map(function (item) {
            return item.trim();
          });
        }

        return answers;
      }
    },
    // 비활성화되었는지 확인
    disabled: {
      get: function get() {
        return this.areaElement.dataset.dropAreaElement === "complete";
      }
    }
  }); // up event가 이 areaElement 위인지 check

  this.checkUpEventIsOn = function (coordinates) {
    var bool;
    bool = this.size.left < coordinates.x && coordinates.x < this.size.left + this.size.width && this.size.top < coordinates.y && coordinates.y < this.size.top + this.size.height;
    return bool;
  }; // 비활성화 & 활성화


  this.disable = function () {
    this.areaElement.dataset.dropAreaElement = "complete";
  };

  this.able = function () {
    this.areaElement.dataset.dropAreaElement = "";
  }; // 초기화


  this.reset = function () {
    this.able();
  };
} //////////////////////////
// DragDrop CONSTRUCTOR //
//////////////////////////


var DragDrop = function DragDrop(opts) {
  this.containerElement = opts.containerElement;
  this.containerElement.self = this;
  this.dragElements = opts.dragElements;
  this.areaElements = opts.dropAreaElements;
  this.dragObjs = [];
  this.areaObjs = [];
  this.moveEventIsOutCorrection = 10; // options

  this.completeCallback = opts.completeCallback || null;
  this.opts = {
    answer: false,
    class: false,
    disableArea: false,
    noComplete: false
  }; // getter, setter 설정하기

  Object.defineProperties(this, {
    dragObjsLen: {
      get: function get() {
        return this.dragObjs.length;
      }
    },
    areaObjsLen: {
      get: function get() {
        return this.areaObjs.length;
      }
    },
    containerSize: {
      get: function get() {
        return this.containerElement.getBoundingClientRect();
      }
    },
    // event 시작 좌표
    eventStartCoordinates: {
      set: function set(object) {
        this._eventStartCoordinates = object;
      },
      get: function get() {
        return this._eventStartCoordinates;
      }
    },
    // dragObj now
    dragObjNow: {
      set: function set(dragObj) {
        this._dragObjNow = dragObj;
      },
      get: function get() {
        return this._dragObjNow;
      }
    },
    // area now
    areaObjNow: {
      set: function set(areaObj) {
        this._areaObjNow = areaObj;
      },
      get: function get() {
        return this._areaObjNow;
      }
    },
    // 정답인지 체크
    isCorrect: {
      get: function get() {
        if (this.opts.answer) {
          var dragAnswers, dragAnswersLen, areaAnswers, areaAnswersLen, areaAnswer, dragAnswer; // 아직 areaObjNow가 들어오지 않았다면 return false

          if (!this.dragObjNow || !this.areaObjNow) return false;
          dragAnswers = this.dragObjNow.answers;
          dragAnswersLen = dragAnswers.length;
          areaAnswers = this.areaObjNow.answers;
          areaAnswersLen = areaAnswers.length;

          for (var i = 0; i < areaAnswersLen; i++) {
            areaAnswer = areaAnswers[i];

            for (var j = 0; j < dragAnswersLen; j++) {
              dragAnswer = dragAnswers[j];
              if (areaAnswer === dragAnswer) return true;
            }
          }
        } else {
          return true;
        }
      }
    }
  }); // 시작

  this.initialize = function () {
    var self = this; // dragObjs 생성

    this.createDragObjs(); // areaObjs 생성

    this.createAreaObjs(); // add container down event handler

    this.addDownEventHandler(); // option이 있을 경우 설정

    this.setOptions();
  }; // dragObjs 생성


  this.createDragObjs = function () {
    var len;
    len = this.dragElements.length;

    for (var i = 0; i < len; i++) {
      var dragElement, dragObj;
      dragElement = this.dragElements[i];
      dragObj = new DragObj(dragElement, this);
      dragObj.initStyles = dragObj.styles;
      this.dragObjs.push(dragObj);
    }
  }; // areaObjs 생성


  this.createAreaObjs = function () {
    var len;
    len = this.areaElements.length;

    for (var i = 0; i < len; i++) {
      var areaElement, areaObj;
      areaElement = this.areaElements[i];
      areaObj = new DropAreaObj(areaElement, this);
      this.areaObjs.push(areaObj);
    }
  }; // 정답 확인


  this.answerAll = function () {
    for (var i = 0; i < this.dragObjsLen; i++) {
      var dragObj;
      dragObj = this.dragObjs[i];
      dragObj.dragObjAnswer();
    }

    for (var i = 0; i < this.areaObjsLen; i++) {
      var areaObj;
      areaObj = this.areaObjs[i];
      areaObj.disable();
    }
  }; // 초기화


  this.resetAll = function () {
    for (var i = 0; i < this.dragObjsLen; i++) {
      var dragObj;
      dragObj = this.dragObjs[i];
      dragObj.reset();
    }

    for (var i = 0; i < this.areaObjsLen; i++) {
      var areaObj;
      areaObj = this.areaObjs[i];
      areaObj.reset();
    }
  }; // option이 있을 경우 설정


  this.setOptions = function () {
    // option이 없을 경우 return
    if (!this.containerElement.hasAttribute("data-drag-drop-option")) return;
    var options, len;
    options = this.containerElement.dataset.dragDropOption;
    options = options.split(",");
    options = options.map(function (item) {
      return item.trim();
    });
    len = options.length;

    for (var i = 0; i < len; i++) {
      var option = options[i];
      this.opts[option] = true;
    }

    console.log("DragDrop options:\n", this.opts);
  }; // add container down event handler


  this.addDownEventHandler = function () {
    this.containerElement.addEventListener("mousedown", this.downEventHandler, false);
    this.containerElement.addEventListener("touchstart", this.downEventHandler, false);
  }; // remove container down event handler


  this.removeDownEventHandler = function () {
    this.containerElement.removeEventListener("mousedown", this.downEventHandler, false);
    this.containerElement.removeEventListener("touchstart", this.downEventHandler, false);
  }; // container down event handler


  this.downEventHandler = function (event) {
    var isTouch, coordinates, self;
    isTouch = event.touches ? true : false;

    if (isTouch) {
      if (event.type === "mousedown") {
        return;
      }

      coordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else {
      if (event.type === "touchstart") {
        return;
      }

      coordinates = {
        x: event.clientX,
        y: event.clientY
      };
    }

    self = this.self; // container down event가 dragElement 위에 적용되었는지 check

    self.checkDownEventIsOnDragElement(coordinates);
  }; // container down event가 dragElement 위에 적용되었는지 check


  this.checkDownEventIsOnDragElement = function (coordinates) {
    loop: {
      for (var i = 0; i < this.dragObjsLen; i++) {
        var dragObj, downEventIsOn;
        dragObj = this.dragObjs[i];
        downEventIsOn = dragObj.checkDownEventIsOn(coordinates);

        if (downEventIsOn) {
          // drag start
          this.dragStart(dragObj, coordinates);
          break loop;
        }
      }
    }
  }; // drag start


  this.dragStart = function (dragObj, coordinates) {
    // dragObj가 비활성화된 경우 return
    if (dragObj.disabled) {
      return;
    } // 현재 drag되는 obj에 등록


    this.dragObjNow = dragObj; // event 시작 좌표 설정

    this.eventStartCoordinates = coordinates; // dragObj 시작 좌표 설정

    dragObj.dragElementStartCoordinates = {
      x: dragObj.styles.left,
      y: dragObj.styles.top
    }; // drag start

    dragObj.dragStart(coordinates); // add event handlers

    this.addMoveEventHandler();
    this.addUpEventHandler(); // remove event handler

    this.removeDownEventHandler();
  }; // add container move event handler


  this.addMoveEventHandler = function () {
    this.containerElement.addEventListener("mousemove", this.moveEventHandler, false);
    this.containerElement.addEventListener("touchmove", this.moveEventHandler, false);
  }; // remove container move event handler


  this.removeMoveEventHandler = function () {
    this.containerElement.removeEventListener("mousemove", this.moveEventHandler, false);
    this.containerElement.removeEventListener("touchmove", this.moveEventHandler, false);
  }; // container move event handler


  this.moveEventHandler = function (event) {
    var isTouch, coordinates, self, moveEventIsOut;
    isTouch = event.touches ? true : false;

    if (isTouch) {
      if (event.type === "mousemove") {
        return;
      }

      coordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else {
      if (event.type === "touchmove") {
        return;
      }

      coordinates = {
        x: event.clientX,
        y: event.clientY
      };
    }

    self = this.self;
    self.dragObjNow.dragPositioning(coordinates);
    moveEventIsOut = self.checkMoveEventIsOut(coordinates);

    if (moveEventIsOut) {
      self.dragDropEnd(coordinates);
    }
  }; // move event가 container 영역 벗어나는지 check


  this.checkMoveEventIsOut = function (coordinates) {
    var bool = coordinates.x < this.containerSize.left + this.moveEventIsOutCorrection || this.containerSize.left + this.containerSize.width < coordinates.x + this.moveEventIsOutCorrection || coordinates.y < this.containerSize.top + this.moveEventIsOutCorrection || this.containerSize.top + this.containerSize.height < coordinates.y + this.moveEventIsOutCorrection;
    return bool;
  }; // add container up event handler


  this.addUpEventHandler = function () {
    this.containerElement.addEventListener("mouseup", this.upEventHandler, false);
    this.containerElement.addEventListener("touchend", this.upEventHandler, false);
  }; // remove container up event handler


  this.removeUpEventHandler = function () {
    this.containerElement.removeEventListener("mouseup", this.upEventHandler, false);
    this.containerElement.removeEventListener("touchend", this.upEventHandler, false);
  }; // container up event handler


  this.upEventHandler = function (event) {
    var isTouch, coordinates, self;
    isTouch = event.touches ? true : false;

    if (isTouch) {
      if (event.type === "mouseup") {
        return;
      }

      coordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else {
      if (event.type === "touchend") {
        return;
      }

      coordinates = {
        x: event.clientX,
        y: event.clientY
      };
    }

    self = this.self;
    self.dragDropEnd(coordinates);
  }; // drag end


  this.dragDropEnd = function (coordinates) {
    var checkedUpEventIsOn, areaObj; // container up event가 dropArea 위에 적용되었는지 check

    checkedUpEventIsOn = this.checkUpEventIsOnAreaElement(coordinates).bool;
    areaObj = this.checkUpEventIsOnAreaElement(coordinates).obj;

    if (checkedUpEventIsOn) {
      this.areaObjNow = areaObj;
    } // drag end


    this.dragObjNow.dragObjEnd(coordinates); // remove event handlers

    this.removeMoveEventHandler();
    this.removeUpEventHandler(); // add event handler

    this.addDownEventHandler(); // 현재 drag되는 obj 삭제

    this.dragObjNow = null; // 현재 drop되는 obj 삭제

    this.areaObjNow = null;
  }; // container up event가 dropArea 위에 적용되었는지 check


  this.checkUpEventIsOnAreaElement = function (coordinates) {
    loop: {
      for (var i = 0; i < this.areaObjsLen; i++) {
        var areaObj, upEventIsOn;
        areaObj = this.areaObjs[i];
        upEventIsOn = areaObj.checkUpEventIsOn(coordinates);

        if (upEventIsOn && !areaObj.disabled) {
          return {
            bool: true,
            obj: areaObj
          };
          break loop;
        }
      }
    }

    return {
      bool: false,
      obj: null
    };
  };
}; ///////////////
// polyfills //
///////////////