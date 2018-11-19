"use strict";

console.info("\u25A1 cannon.js is loading..."); // timer

var timer = new Timer();
initDropCanvas();
initGraphCanvases();
addEvents(); // drop canvas 초기화

function initDropCanvas() {
  var canvas, ctx;
  canvas = document.getElementById("dropDown");
  ctx = canvas.getContext('2d');
  drawDrones(ctx);
  drawObjects(ctx);
} // 드론 그리기


function drawDrones(ctx) {
  var img, img2;
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


function drawObjects(ctx) {
  var leftObject, rightObject;
  leftObject = new Image();
  rightObject = new Image();
  leftObject.addEventListener("load", function () {
    ctx.drawImage(leftObject, dropCanvasInfo.objectPos.left - leftObject.width / 2, dropCanvasInfo.objectPos.y - leftObject.height / 2);
  });
  rightObject.addEventListener("load", function () {
    ctx.drawImage(rightObject, dropCanvasInfo.objectPos.right - rightObject.width / 2, dropCanvasInfo.objectPos.y - rightObject.height / 2);
  });
  leftObject.src = dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[0]];
  rightObject.src = dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[1]];
} // graph canvas 초기화


function initGraphCanvases() {
  var canvases;
  canvases = $ts.getEl(".graphCanvas");
  canvases.forEach(function (canvas) {
    if (!graphCanvasInfo.graphIsLocated) {
      canvas.style.left = graphCanvasInfo.graphPosition.left + "px";
      canvas.style.bottom = graphCanvasInfo.graphPosition.bottom + "px";
      canvas.width = graphCanvasInfo.graphPosition.width * 4.3;
      canvas.height = graphCanvasInfo.graphPosition.height * 4.3;
      graphCanvasInfo.graphIsLocated = true;
    }

    var ctx;
    ctx = canvas.getContext('2d');
  });
} // graph 그리기


function drawGraph(ctx) {
  ctx.beginPath();
  ctx.moveTo(graphCanvasInfo.startPos.x, graphCanvasInfo.startPos.y);
  ctx.lineTo(110, 110);
  ctx.stroke();
} // event 추가하기


function addEvents() {
  var playBtn = new ClickToggleClass($ts.getEl(".playBtn")[0], "on", {
    on: function on() {
      timer.startTimer();
    }
  }).addEvent();
  var stopBtn = new ClickToggleClass($ts.getEl(".stopBtn")[0], "on").addEvent();
  var replayBtn = new ClickToggleClass($ts.getEl(".replayBtn")[0], "on").addEvent();
}