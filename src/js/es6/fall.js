console.info(`□ cannon.js is loading...`);

// timer
const timer = new Timer();

initDropCanvas();
initGraphCanvases();
addEvents();

// drop canvas 초기화
function initDropCanvas() {
    let canvas, ctx;

    canvas = document.getElementById("dropDown");
    ctx = canvas.getContext('2d');

    drawDrones(ctx);
    drawObjects(ctx);
}

// 드론 그리기
function drawDrones(ctx) {
    let img, img2;

    img = new Image();
    img2 = new Image();

    img.addEventListener("load", function() {
        ctx.drawImage(img, dropCanvasInfo.dronePos.left, dropCanvasInfo.dronePos.y);
    });
    img2.addEventListener("load", function() {
        ctx.drawImage(img2, dropCanvasInfo.dronePos.right, dropCanvasInfo.dronePos.y);
    });

    img.src = dropCanvasInfo.droneImgSrc;
    img2.src = dropCanvasInfo.droneImgSrc;
}

// 오브젝트 그리기
function drawObjects(ctx) {
    let leftObject, rightObject;

    leftObject = new Image();
    rightObject = new Image();

    leftObject.addEventListener("load", function() {
        ctx.drawImage(leftObject, dropCanvasInfo.objectPos.left - leftObject.width / 2, dropCanvasInfo.objectPos.y - leftObject.height / 2);
    });
    rightObject.addEventListener("load", function() {
        ctx.drawImage(rightObject, dropCanvasInfo.objectPos.right - rightObject.width / 2, dropCanvasInfo.objectPos.y - rightObject.height / 2);
    });

    leftObject.src = dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[0]];
    rightObject.src = dropCanvasInfo.objectImgs[dropCanvasInfo.selectedObjects[1]];
}

// graph canvas 초기화
function initGraphCanvases() {
    let canvases;

    canvases = $ts.getEl(".graphCanvas");

    canvases.forEach((canvas) => {
        if (!graphCanvasInfo.graphIsLocated) {
            canvas.style.left = graphCanvasInfo.graphPosition.left + "px";
            canvas.style.bottom = graphCanvasInfo.graphPosition.bottom + "px";
            canvas.width = graphCanvasInfo.graphPosition.width * 4.3;
            canvas.height = graphCanvasInfo.graphPosition.height * 4.3;
            graphCanvasInfo.graphIsLocated = true;
        }
        let ctx;

        ctx = canvas.getContext('2d');
    });
}

// graph 그리기
function drawGraph(ctx) {
    ctx.beginPath();
    ctx.moveTo(graphCanvasInfo.startPos.x, graphCanvasInfo.startPos.y);
    ctx.lineTo(110, 110);
    ctx.stroke();
}

// event 추가하기
function addEvents() {
    const playBtn = new ClickToggleClass($ts.getEl(".playBtn")[0], "on", {
        on: () => {
            timer.startTimer();
        }
    }).addEvent();
    const stopBtn = new ClickToggleClass($ts.getEl(".stopBtn")[0], "on").addEvent();
    const replayBtn = new ClickToggleClass($ts.getEl(".replayBtn")[0], "on").addEvent();
}