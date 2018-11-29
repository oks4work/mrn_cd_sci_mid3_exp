"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

console.info("\u25A1 cannon.js is loading...");
var efSound = new EffectSound($ts.getEl(".contentsArea")[0]);
efSound.initiate();
var commentbox = new CommentBox({
  container: $ts.getEl(".commentBox")[0],
  comments: $ts.getEl("p", $ts.getEl(".commentBox_inner")[0]),
  btn: $ts.getEl(".commentNextBtn")[0]
}, commentConfig);
commentbox.start();

var DropMove =
/*#__PURE__*/
function () {
  function DropMove(HTMLelement) {
    _classCallCheck(this, DropMove);

    this.element = HTMLelement;
    this.img = this.element.querySelector("img");
  }

  _createClass(DropMove, [{
    key: "positioning",
    value: function positioning(x, y) {
      if (this.element.style.top !== y) {
        this.element.style.top = "".concat(y, "px");
      }

      if (this.element.style.left !== x) {
        this.element.style.left = "".concat(x, "px");
      }
    }
  }, {
    key: "changeSrc",
    value: function changeSrc(string) {
      this.img.src = string;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.element.style.display = "none";
    }
  }, {
    key: "show",
    value: function show() {
      this.element.style.display = "";
    }
  }]);

  return DropMove;
}(); // scale


var _scale = new $cale({
  target: $ts.getEl(".contentsArea")[0]
}); // timer


var timer = new Timer(timerConfig); // digital clock

var clock = new DigitalClock({
  hour: null,
  min: null,
  sec: $ts.getEl("#digital_sec"),
  ms: $ts.getEl("#digital_ms")
});
var playBtn = $ts.getEl(".playBtn")[0];
var stopBtn = $ts.getEl(".stopBtn")[0];
var replayBtn = $ts.getEl(".replayBtn")[0];
var dragdrop = new DragDrop({
  containerElement: $ts.getEl(".contentsArea")[0],
  dragElements: $ts.getEl(".dragObj"),
  dropAreaElements: $ts.getEl(".dropArea"),
  completeCallback: function completeCallback(dragObj, dropObj) {
    efSound.play("media/change.mp3");
    dropCanvasInfo.selectedObjects[dropObj.answers - 1] = dropCanvasInfo.objectImgIndexing[dragObj.answers - 1];
    dropMoves.changeSources();
    initDropCanvas();
  },
  scale: function scale() {
    return _scale.getZoomRate();
  }
});
var dropMoves = {
  objects: [],
  move: function move() {
    this.objects[0].positioning(dropCanvasInfo.objectPos.left, dropCanvasInfo.objectPos.y);
    this.objects[1].positioning(dropCanvasInfo.objectPos.right, dropCanvasInfo.objectPos.y);
  },
  changeSources: function changeSources() {
    this.objects[0].changeSrc(dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[0]]);
    this.objects[1].changeSrc(dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[1]]);
  },
  hide: function hide() {
    this.objects.forEach(function (object) {
      object.hide();
    });
  },
  show: function show() {
    this.objects.forEach(function (object) {
      object.show();
    });
  }
};
$ts.getEl(".dropMove").forEach(function (el) {
  dropMoves.objects.push(new DropMove(el));
});
dropMoves.move();
dropMoves.hide();
dropMoves.changeSources();
dragdrop.initialize();
initDropCanvas();
initGraphCanvases();
addEvents(); // clear canvas

function clearCanvas(canvas) {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
} // drop canvas get


function getDropCanvas() {
  return document.getElementById("dropDown");
} // drop canvas 초기화


function initDropCanvas() {
  var canvas = getDropCanvas();
  clearCanvas(canvas);
  drawDrones(); // 오브젝트 위치 초기값으로 재설정

  dropCanvasInfo.objectPos.y = dropCanvasInfo.objectPos.initial.y;
  dropCanvasInfo.objectPos.left = dropCanvasInfo.objectPos.initial.left;
  dropCanvasInfo.objectPos.right = dropCanvasInfo.objectPos.initial.right;
  drawObjects(); // disableSelectedObjects();
} // 드론 그리기


function drawDrones() {
  var canvas, ctx, img, img2;
  canvas = getDropCanvas();
  ctx = canvas.getContext('2d');
  img = new Image();
  img2 = new Image();
  img.addEventListener("load", function () {
    ctx.drawImage(img, dropCanvasInfo.dronePos.left, dropCanvasInfo.dronePos.y);
  });
  img2.addEventListener("load", function () {
    ctx.drawImage(img2, dropCanvasInfo.dronePos.right, dropCanvasInfo.dronePos.y);
  });
  img.src = dropCanvasInfo.droneImgSrc;
  img2.src = dropCanvasInfo.droneImgSrc;
} // 오브젝트 그리기


function drawObjects(lastObject) {
  var canvas, ctx, leftObject, rightObject, leftSrc, rightSrc;
  canvas = getDropCanvas();
  ctx = canvas.getContext('2d');
  leftObject = new Image();
  rightObject = new Image();
  leftSrc = dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[0]];
  rightSrc = dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[1]];

  if (lastObject) {
    leftSrc = addBroken(leftSrc);
    rightSrc = addBroken(rightSrc);
  }

  leftObject.addEventListener("load", function () {
    ctx.drawImage(leftObject, dropCanvasInfo.objectPos.left - leftObject.width / 2, dropCanvasInfo.objectPos.y - leftObject.height / 2);
  });
  rightObject.addEventListener("load", function () {
    ctx.drawImage(rightObject, dropCanvasInfo.objectPos.right - rightObject.width / 2, dropCanvasInfo.objectPos.y - rightObject.height / 2);
  });
  leftObject.src = leftSrc;
  rightObject.src = rightSrc;

  function addBroken(string) {
    return "".concat(string.slice(0, string.lastIndexOf(".")), "_broken").concat(string.slice(string.lastIndexOf("."), string.length));
  }
} // 선택된 오브젝트 비활성화하기


function disableSelectedObjects() {
  var dragObjs = $ts.getEl(".dragObj");
  dragObjs.forEach(function (dragObj) {
    dragObj.classList.remove("disabled");
    dragObj.dataset.dragElement = "";
  });
  dropCanvasInfo.selectedObjects.forEach(function (name) {
    var nameIndex;
    nameIndex = dropCanvasInfo.objectImgIndexing.indexOf(name);
    dragObjs.forEach(function (dragObj, index) {
      if (nameIndex === index) {
        dragObj.classList.add("disabled");
        dragObj.dataset.dragElement = "complete";
      }
    });
  });
} // 모든 오브젝트 활성화하기


function ableAllObjects() {
  $ts.getEl(".dragObj").forEach(function (dragObj) {
    dragObj.dataset.dragElement = "";
  });
} // 모든 오브젝트 비활성화하기


function disableAllObjects() {
  $ts.getEl(".dragObj").forEach(function (dragObj) {
    dragObj.dataset.dragElement = "complete";
  });
} // drop canvas get


function getGraphCanvases() {
  return $ts.getEl(".graphCanvas");
} // graph canvas 초기화


function initGraphCanvases() {
  var canvases;
  canvases = getGraphCanvases();
  canvases.forEach(function (canvas, index) {
    // let ctx = canvas.getContext('2d');
    clearCanvas(canvas);

    if (!graphCanvasInfo.graphIsLocated[index]) {
      canvas.style.left = graphCanvasInfo.graphPosition.left + "px";
      canvas.style.bottom = graphCanvasInfo.graphPosition.bottom + "px";
      canvas.width = graphCanvasInfo.graphPosition.width * 4.3;
      canvas.height = graphCanvasInfo.graphPosition.height * 4.3;
      graphCanvasInfo.graphIsLocated[index] = true;
    }
  });
} // graph 그리기


function drawGraphs() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var canvases;
  canvases = getGraphCanvases();
  canvases.forEach(function (canvas) {
    var ctx, stdSize, corrRatio;
    ctx = canvas.getContext('2d');
    stdSize = graphCanvasInfo.graphPosition;
    corrRatio = timerConfig.captureInterval / graphCanvasInfo.stdTime; // line 그리기

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#e1435b";
    ctx.moveTo(stdSize.width * (count - 1) * corrRatio, canvas.height - stdSize.height * (count - 1) * corrRatio);
    ctx.lineTo(stdSize.width * count * corrRatio, canvas.height - stdSize.height * count * corrRatio);
    ctx.stroke(); // 원 그리기
    // ctx.beginPath();
    // ctx.arc(stdSize.width * count * corrRatio, canvas.height - stdSize.height * count * corrRatio, 2, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.stroke();
  });
} // event 추가하기


function addEvents() {
  new ClickToggleClass(playBtn, "on", {
    click: function click() {
      efSound.play("media/click.mp3");
    },
    on: function on() {
      timer.startTimer();
      playBtn.object.pointerOn();
      stopBtn.object.off();
      replayBtn.object.off();
      replayBtn.object.pointerOn();
      disableAllObjects();
    },
    off: function off() {
      timer.pauseTimer();
    }
  }).addEvent();
  new ClickToggleClass(stopBtn, "on", {
    click: function click() {
      efSound.play("media/click.mp3");
    },
    on: function on() {
      timer.pauseTimer();
    }
  }).addEvent();
  new ClickToggleClass(replayBtn, "on", {
    click: function click() {
      efSound.play("media/click.mp3");
    },
    on: function on() {
      timer.resetTimer();
      playBtn.object.off();
      playBtn.object.pointerOn();
      replayBtn.object.pointerOff();

      if (!stopBtn.object.isOn) {
        stopBtn.object.on();
      }

      ableAllObjects(); // disableSelectedObjects();
    }
  }).addEvent();
  document.addEventListener('touchmove', function (event) {
    event.preventDefault();
  }, {
    passive: false
  });
}