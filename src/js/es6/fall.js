console.info(`□ cannon.js is loading...`);

// timer
const timer = new Timer(timerConfig);

// digital clock
const clock = new DigitalClock({
    hour: null,
    min: null,
    sec: $ts.getEl("#digital_sec"),
    ms: $ts.getEl("#digital_ms")
});

const playBtn = $ts.getEl(".playBtn")[0];
const stopBtn = $ts.getEl(".stopBtn")[0];
const replayBtn = $ts.getEl(".replayBtn")[0];

const dragdrop = new DragDrop({
    containerElement: $ts.getEl(".contentsArea")[0],
    dragElements: $ts.getEl(".dragObj"),
    dropAreaElements: $ts.getEl(".dropArea"),
    completeCallback: (dragObj, dropObj) => {
        dropCanvasInfo.selectedObjects[dropObj.answers - 1] = dropCanvasInfo.objectImgIndexing[dragObj.answers - 1];

        initDropCanvas();
    }
});

dragdrop.initialize();

initDropCanvas();
initGraphCanvases();
addEvents();

// clear canvas
function clearCanvas(canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// drop canvas get
function getDropCanvas() {
    return document.getElementById("dropDown");
}

// drop canvas 초기화
function initDropCanvas() {
    let canvas = getDropCanvas();

    clearCanvas(canvas);

    drawDrones();

    // 오브젝트 위치 초기값으로 재설정
    dropCanvasInfo.objectPos.y = dropCanvasInfo.objectPos.initial.y;
    dropCanvasInfo.objectPos.left = dropCanvasInfo.objectPos.initial.left;
    dropCanvasInfo.objectPos.right = dropCanvasInfo.objectPos.initial.right;

    drawObjects();
    disableSelectedObjects();
}

// 드론 그리기
function drawDrones() {
    let canvas, ctx, img, img2;

    canvas = getDropCanvas();
    ctx = canvas.getContext('2d');

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
function drawObjects() {
    let canvas, ctx, leftObject, rightObject;

    canvas = getDropCanvas();
    ctx = canvas.getContext('2d');

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

// 선택된 오브젝트 비활성화하기
function disableSelectedObjects() {
    let dragObjs;

    dragObjs = $ts.getEl(".dragObj");

    dragObjs.forEach((dragObj) => {
        dragObj.classList.remove("disabled");
        dragObj.dataset.dragElement = "";
    });

    dropCanvasInfo.selectedObjects.forEach((name) => {
        let nameIndex;

        nameIndex = dropCanvasInfo.objectImgIndexing.indexOf(name);

        dragObjs.forEach((dragObj, index) => {
            if (nameIndex === index) {
                dragObj.classList.add("disabled");
                dragObj.dataset.dragElement = "complete";
            }
        });
    });
}

// drop canvas get
function getGraphCanvases() {
    return $ts.getEl(".graphCanvas");
}

// graph canvas 초기화
function initGraphCanvases() {
    let canvases;

    canvases = getGraphCanvases();

    canvases.forEach((canvas, index) => {
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
}

// graph 그리기
function drawGraphs(count = 0) {
    let canvases;

    canvases = getGraphCanvases();

    canvases.forEach((canvas) => {
        let ctx, stdSize, corrRatio;

        ctx = canvas.getContext('2d');
        stdSize = graphCanvasInfo.graphPosition;
        corrRatio = timerConfig.captureInterval / graphCanvasInfo.stdTime;

        // line 그리기
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(stdSize.width * (count - 1) * corrRatio, canvas.height - stdSize.height * (count - 1) * corrRatio);
        ctx.lineTo(stdSize.width * count * corrRatio, canvas.height - stdSize.height * count * corrRatio);
        ctx.stroke();

        // 원 그리기
        ctx.beginPath();
        ctx.arc(stdSize.width * count * corrRatio, canvas.height - stdSize.height * count * corrRatio, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    });
}

// event 추가하기
function addEvents() {
    new ClickToggleClass(playBtn, "on", {
        on: () => {
            timer.startTimer();
            stopBtn.click();
            replayBtn.click();
        }
    }).addEvent();
    new ClickToggleClass(stopBtn, "on", {
        on: () => {
            timer.pauseTimer();
            // replayBtn.click();
        },
        off: () => {
        }
    }).addEvent();
    new ClickToggleClass(replayBtn, "on", {
        on: () => {
            timer.resetTimer();
            playBtn.click();
            if (!stopBtn.object.isOn) {
                stopBtn.click();
            }
        },
        off: () => {

        }
    }).addEvent();
}